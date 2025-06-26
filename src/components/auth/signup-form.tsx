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

type FormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setError(null);
    console.log("Starting signup process...");

    try {
      console.log("Making API request...");
      const response = await fetch("/api/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "verification",
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();
      console.log("API response:", result);

      if (result.error) {
        throw new Error(result.error);
      }

      console.log("Setting session storage...");
      // Set session storage before redirect
      window.sessionStorage.setItem("verificationEmail", data.email);
      window.sessionStorage.setItem("signupPassword", data.password);

      console.log("Checking session storage:", {
        email: window.sessionStorage.getItem("verificationEmail"),
        hasPassword: !!window.sessionStorage.getItem("signupPassword"),
      });

      // Use window.location for navigation instead of Next.js router
      console.log("Redirecting to verify page...");
      router.push("/auth/verify");
      // window.location.href = "/auth/verify";
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
          disabled={isLoading}
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
          disabled={isLoading}
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
            disabled={isLoading}
            className="border-gray-700 text-white pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-300"
            onClick={() => setShowPassword(!showPassword)}
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
            disabled={isLoading}
            className="border-gray-700 text-white pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-300"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
        disabled={isLoading}
      >
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Create Account
      </Button>
    </form>
  );
}
