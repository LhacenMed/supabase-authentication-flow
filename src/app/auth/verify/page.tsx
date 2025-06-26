"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { VerifyForm } from "@/components/auth/verify-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const email = sessionStorage.getItem("verificationEmail");
    if (!email) {
      router.replace("/auth/signup");
    } else {
      setIsAuthorized(true);
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
      title="Verification Code"
      description="Enter the verification code sent to your email"
    >
      <VerifyForm />
    </AuthForm>
  );
}
