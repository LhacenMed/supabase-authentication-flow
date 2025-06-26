"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { newPasswordSchema } from "@/lib/utils/validation";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { updatePassword } from "@/lib/utils/auth-helpers";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

type FormData = z.infer<typeof newPasswordSchema>;

const formVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const inputVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.645, 0.045, 0.355, 1],
    },
  },
};

export function NewPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const supabase = createClient();

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setError(error.message);
      }
      if (!data.session) {
        router.push("/auth/reset-password");
        return;
      }

      setUserEmail(data.session.user?.email || null);
    }

    checkSession();
  }, [router]);

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setError(null);

    if (!userEmail) {
      setError("User email not found");
      return;
    }

    try {
      await updatePassword(data.password);

      if (userEmail) {
        await fetch("/api/resend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "password-reset-confirmation",
            email: userEmail,
            origin: window.location.origin,
          }),
        });

        const supabase = createClient();
        await supabase.auth.signOut();

        setIsSuccess(true);

        sessionStorage.removeItem("isPasswordReset");
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-4"
      >
        <div className="text-xl text-green-600 font-bold">Password updated</div>
        <p className="text-gray-300">
          Your password has been successfully updated. You can now login with
          your new password.
        </p>
        <Button
          className="w-full bg-white text-black hover:bg-gray-200"
          onClick={() => router.push("/auth/login")}
        >
          Login
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y4">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-white">New Password</FormLabel>
                <FormControl>
                  <Input className="text-white" type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-white">Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    className="text-white"
                    type="password"
                    placeholder="********"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
