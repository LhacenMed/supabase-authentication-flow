"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { Link } from "@/components/ui/link";
import { Eye, EyeOff } from "lucide-react";
import { signupSchema } from "@/lib/utils/validation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signUp } from "@/app/auth/signup/actions";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/types/database";

type FormData = z.infer<typeof signupSchema>;

interface EmailVerificationResult {
  can_connect_smtp: boolean;
  domain: string;
  email: string;
  has_inbox_full: boolean;
  is_catch_all: boolean;
  is_deliverable: boolean;
  is_disabled: boolean;
  is_disposable: boolean;
  is_role_account: boolean;
  is_safe_to_send: boolean;
  is_spamtrap: boolean | null;
  is_valid_syntax: boolean;
  mx_accepts_mail: boolean;
  mx_records: string[];
  status: string;
  username: string;
}

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const form = useForm<FormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const checkCachedVerification = async (email: string) => {
    try {
      const { data: verification, error } = await supabase
        .from("email_verifications")
        .select("*")
        .eq("email", email)
        .single();

      // If no verification exists, that's expected for new emails
      if (error && error.code === "PGRST116") {
        return null;
      }

      // For other errors, log but continue
      if (error) {
        console.error("Error checking cached verification:", error);
        return null;
      }

      // Check if verification is still valid (less than 24 hours old)
      if (verification) {
        const verificationDate = new Date(verification.verification_date);
        const now = new Date();
        const hoursDiff =
          (now.getTime() - verificationDate.getTime()) / (1000 * 60 * 60);

        if (hoursDiff < 24) {
          try {
            // Update check count and last checked timestamp
            await supabase
              .from("email_verifications")
              .update({
                check_count: verification.check_count + 1,
                last_checked_at: new Date().toISOString(),
              })
              .eq("id", verification.id);
          } catch (updateError) {
            // Log but don't fail if update fails
            console.error("Error updating verification count:", updateError);
          }

          return verification;
        }
      }

      return null;
    } catch (error) {
      console.error("Error checking cached verification:", error);
      return null;
    }
  };

  const saveVerification = async (
    email: string,
    result: EmailVerificationResult
  ) => {
    try {
      // First check if a record already exists
      const { data: existing } = await supabase
        .from("email_verifications")
        .select("id")
        .eq("email", email)
        .single();

      const verificationData = {
        email,
        is_deliverable: result.is_deliverable,
        is_disposable: result.is_disposable,
        is_role_account: result.is_role_account,
        is_safe_to_send: result.is_safe_to_send,
        mx_accepts_mail: result.mx_accepts_mail,
        status: result.status,
        raw_response: result,
        verification_date: new Date().toISOString(),
        last_checked_at: new Date().toISOString(),
      };

      let error;
      if (existing) {
        // Update existing record
        const response = await supabase
          .from("email_verifications")
          .update(verificationData)
          .eq("id", existing.id);
        error = response.error;
      } else {
        // Insert new record
        const response = await supabase
          .from("email_verifications")
          .insert([verificationData]);
        error = response.error;
      }

      if (error) {
        console.error("Error saving verification:", error);
      }
    } catch (error) {
      console.error("Error saving verification:", error);
    }
  };

  const verifyEmail = async (email: string): Promise<boolean> => {
    try {
      setIsVerifyingEmail(true);

      // Check for cached verification first
      const cachedVerification = await checkCachedVerification(email);
      if (cachedVerification) {
        if (!cachedVerification.is_deliverable) {
          setError(
            "This email address appears to be invalid or undeliverable."
          );
          return false;
        }
        if (cachedVerification.is_disposable) {
          setError("Disposable email addresses are not allowed.");
          return false;
        }
        if (cachedVerification.status !== "safe") {
          setError("This email address appears to be risky or invalid.");
          return false;
        }
        return true;
      }

      // If no valid cached verification, perform new verification
      const response = await fetch(
        `/api/reoon?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to verify email");
      }

      const data: EmailVerificationResult = await response.json();

      // Save the verification result
      await saveVerification(email, data);

      // Check if the email is valid and safe to use
      if (!data.is_deliverable) {
        setError("This email address appears to be invalid or undeliverable.");
        return false;
      }

      if (data.is_disposable) {
        setError("Disposable email addresses are not allowed.");
        return false;
      }

      if (data.status !== "safe") {
        setError("This email address appears to be risky or invalid.");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Email verification error:", error);
      setError("Failed to verify email address. Please try again.");
      return false;
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setError(null);

    try {
      // Verify email first
      const isEmailValid = await verifyEmail(data.email);
      if (!isEmailValid) {
        return;
      }

      // Create FormData object
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("name", data.name);

      // Call server action
      const result = await signUp(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      // Store email for verification page
      window.sessionStorage.setItem("verificationEmail", data.email);

      // Redirect to verify page
      router.push("/auth/verify");
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof z.ZodError) {
        setError(error.message);
      } else {
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred during signup, please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-gray-300">
          Name
        </Label>
        <Input
          id="name"
          {...form.register("name")}
          type="text"
          placeholder="John Doe"
          disabled={isLoading || isVerifyingEmail}
          className="border-gray-700 text-white placeholder:text-gray-500"
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-300">
          Email
        </Label>
        <Input
          id="email"
          {...form.register("email")}
          type="email"
          placeholder="name@example.com"
          disabled={isLoading || isVerifyingEmail}
          className="border-gray-700 text-white placeholder:text-gray-500"
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-300">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            {...form.register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="********"
            disabled={isLoading || isVerifyingEmail}
            className="border-gray-700 text-white pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-300"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading || isVerifyingEmail}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>
        <p className="text-sm text-gray-400">
          Password must be at least 8 characters and contain uppercase,
          lowercase, and numbers
        </p>
        {form.formState.errors.password && (
          <p className="text-sm text-red-500">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-gray-300">
          Confirm Password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            {...form.register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="********"
            disabled={isLoading || isVerifyingEmail}
            className="border-gray-700 text-white pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-300"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading || isVerifyingEmail}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="sr-only">
              {showConfirmPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>
      {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
      <div className="flex items-center justify-end">
        <Link
          href="/auth/login"
          className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
        >
          Already have an account? Sign in
        </Link>
      </div>
      <Button
        className="w-full bg-white text-black hover:bg-gray-300"
        type="submit"
        disabled={isLoading || isVerifyingEmail}
      >
        {isLoading || isVerifyingEmail ? (
          <>
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            {isVerifyingEmail ? "Verifying Email..." : "Creating Account..."}
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}
