"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "motion/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { verifyOtpSchema } from "@/lib/utils/validation";
import { verifyOtp } from "@/lib/utils/auth-helpers";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";

type FormData = z.infer<typeof verifyOtpSchema>;

const formVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const inputVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.645, 0.045, 0.355, 1],
    },
  },
};

export function VerifyForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: "",
      otp: "",
    },
    mode: "onChange",
  });

  // Watch OTP value for debugging
  const otpValue = form.watch("otp");
  const emailValue = form.watch("email");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("verificationEmail");
    console.log("Verify form mounted, checking session storage:", {
      storedEmail,
      hasPassword: !!sessionStorage.getItem("signupPassword"),
    });

    if (storedEmail) {
      setEmail(storedEmail);
      // Set both the email state and form value
      form.setValue("email", storedEmail, { shouldValidate: true });

      const passwordResetFlag = sessionStorage.getItem("isPasswordReset");
      setIsPasswordReset(passwordResetFlag === "true");
    }

    return () => {
      console.log("Verify form unmounting...");
    };
  }, [form]);

  // Debug effect to track form state
  // useEffect(() => {
  //   const currentEmail = sessionStorage.getItem("verificationEmail");
  //   const buttonDisabled = isLoading || !otpValue || otpValue.length !== 6;

  //   setDebugInfo({
  //     isLoading,
  //     otpValue,
  //     otpLength: otpValue?.length || 0,
  //     emailValue,
  //     sessionEmail: currentEmail,
  //     buttonDisabled,
  //     formValid: form.formState.isValid,
  //     formErrors: form.formState.errors,
  //   });

  //   console.log("Form Debug Info:", {
  //     isLoading,
  //     otpValue,
  //     otpLength: otpValue?.length || 0,
  //     emailValue,
  //     sessionEmail: currentEmail,
  //     buttonDisabled,
  //     formValid: form.formState.isValid,
  //     formErrors: form.formState.errors,
  //   });
  // }, [isLoading, otpValue, emailValue, form.formState]);

  async function onSubmit(data: FormData) {

    // Validate data before proceeding
    if (!data.email) {
      const sessionEmail = sessionStorage.getItem("verificationEmail");
      if (sessionEmail) {
        data.email = sessionEmail;
        console.log("Using session email:", sessionEmail);
      } else {
        console.error("No email available");
        setError("Email is required. Please try again.");
        return;
      }
    }

    if (!data.otp) {
      console.error("No OTP provided");
      setError("Please enter the verification code.");
      return;
    }

    if (data.otp.length !== 6) {
      console.error("Invalid OTP length:", data.otp.length);
      setError("Verification code must be 6 digits.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Attempting to verify OTP...");
      await verifyOtp(data.email, data.otp);
      console.log("OTP verification successful");

      sessionStorage.removeItem("verificationEmail");

      if (isPasswordReset) {
        console.log("Redirecting to new password page");
        router.push("/auth/new-password");
      } else {
        sessionStorage.removeItem("isPasswordReset");

        console.log("Sending welcome email...");
        try {
          await fetch("/api/resend", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "welcome",
              email: data.email,
              origin: window.location.origin,
            }),
          });
          console.log("Welcome email sent successfully");
        } catch (emailError) {
          console.warn("Failed to send welcome email:", emailError);
          // Don't block the flow if welcome email fails
        }

        console.log("Redirecting to dashboard");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during verification, please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function resendOTP() {
    setIsLoading(true);
    setError(null);

    if (!email) {
      setError("Email is required. Please try again.");
      return;
    }

    try {
      await fetch("/api/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "verification",
          email: email,
          origin: window.location.origin,
        }),
      });
    } catch (error) {
      console.error("Resend OTP error:", error);
      setError("Failed to resend OTP. Please try again.");
    }
  }

  // Add manual form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Manual form submit triggered");

    const currentData = {
      email: emailValue || sessionStorage.getItem("verificationEmail") || "",
      otp: otpValue || "",
    };

    console.log("Current form data:", currentData);

    // Trigger form validation and submission
    form.handleSubmit(onSubmit)(e);
  };

  if (!email) {
    return null;
  }

  // Check if button should be disabled
  const isButtonDisabled = isLoading || !otpValue || otpValue.length !== 6;

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Debug Info (remove in production) */}
      {/* {process.env.NODE_ENV === "development" && debugInfo && (
        <div className="p-4 bg-gray-800 rounded text-xs text-gray-300">
          <details>
            <summary>Debug Info (Dev Only)</summary>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </details>
        </div>
      )} */}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert
            variant={
              error.includes("has been sent") ? "default" : "destructive"
            }
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {error.includes("has been sent") ? "Success" : "Error"}
            </AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <motion.div variants={inputVariants} className="space-y-2">
        <Label htmlFor="otp" className="text-gray-300">
          Verification Code
        </Label>
        <p className="text-sm text-gray-400">
          We&apos;ve sent a verification code to{" "}
          <span className="font-bold">{email}</span>.
        </p>
        <p className="text-sm text-gray-400">
          {isPasswordReset
            ? "Please enter the code to reset your password."
            : "Please enter the code to verify your email."}
        </p>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" {...form.register("email")} value={email} />
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-gray-800 border-gray-700 text-white"
                      maxLength={6}
                      disabled={isLoading}
                      placeholder="Enter your verification code"
                      autoComplete="one-time-code"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full bg-white text-black hover:bg-gray-200"
              type="submit"
              disabled={isButtonDisabled}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : isPasswordReset ? (
                "Reset Password"
              ) : (
                "Verify Email"
              )}
            </Button>

            {/* Debug button info */}
            {/* {process.env.NODE_ENV === "development" && (
              <p className="text-xs text-gray-500">
                Button disabled: {isButtonDisabled.toString()}
                (Loading: {isLoading.toString()}, OTP: "{otpValue}", Length:{" "}
                {otpValue?.length || 0})
              </p>
            )} */}
          </form>
        </Form>
      </motion.div>

      <motion.div variants={inputVariants} className="space-y-4">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-400">Didn&apos;t receive the code?</p>
          <Button
            variant="link"
            className="text-sm text-gray-400 hover:text-gray-300"
            disabled={isLoading}
            onClick={resendOTP}
          >
            Resend
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
