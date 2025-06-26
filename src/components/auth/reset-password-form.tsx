"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { Link } from "@/components/ui/link";

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email") as string;

    try {
      // TODO: Add your password reset logic here
      // For example: await sendPasswordResetEmail(email)
      setIsSubmitted(true);
    } catch (error) {
      // Handle error
      setIsSubmitted(false);
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center">
        <Icons.spinner className="mx-auto h-6 w-6 animate-spin text-gray-300" />
        <p className="mt-4 text-gray-300">
          If an account exists with that email address, we've sent password
          reset instructions.
        </p>
        <Button
          variant="link"
          className="mt-4 text-gray-400 hover:text-gray-300"
          onClick={() => setIsSubmitted(false)}
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-300">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          required
          disabled={isLoading}
          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
        />
      </div>
      <div className="flex items-center justify-between">
        <Link
          href="/auth/login"
          className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
        >
          Back to login
        </Link>
      </div>
      <Button
        className="w-full bg-white text-black hover:bg-gray-300"
        type="submit"
        disabled={isLoading}
      >
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Send Reset Link
      </Button>
    </form>
  );
}
