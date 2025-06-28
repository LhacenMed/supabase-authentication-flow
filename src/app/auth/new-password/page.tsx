"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { NewPasswordForm } from "@/components/auth/new-password-form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// isPasswordReset;

export default function NewPasswordPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const isPasswordReset = sessionStorage.getItem("isPasswordReset");
    if (isPasswordReset === "true") {
      setIsAuthorized(true);
    } else {
      router.replace("/auth/verify");
    }

    setIsLoading(false);
  }, [router]);

  // Show nothing while checking authorization
  if (isLoading) {
    return null;
  }

  // Only show the form if authorized
  if (!isAuthorized) {
    return null;
  }

  return (
    <AuthForm
      title="Set New Password"
      description="Create a new password for your account"
    >
      <NewPasswordForm />
    </AuthForm>
  );
}
