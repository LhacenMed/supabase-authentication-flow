"use client";

import { useState } from "react";
import { motion, Variants } from "motion/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { Link } from "@/components/ui/link";
import { verifyOtpSchema } from "@/lib/utils/validation";
import { toast } from "sonner";
import { z } from "zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

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
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const validatedData = verifyOtpSchema.parse({
        otp: code,
        email: "", // This should be passed from the previous step or URL params
      });

      // TODO: Add your verification logic here
      // For example: await verifyEmail(validatedData)
      toast.success("Email verified successfully");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          zodErrors[path] = err.message;
        });
        setErrors(zodErrors);
        toast.error("Please check the form for errors");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.form
      variants={formVariants}
      initial="hidden"
      animate="visible"
      onSubmit={onSubmit}
      className="space-y-6"
    >
      <motion.div variants={inputVariants} className="space-y-2">
        <Label htmlFor="otp" className="text-gray-300">
          Verification Code
        </Label>
        <InputOTP
          value={code}
          onChange={(value) => setCode(value)}
          maxLength={6}
          disabled={isLoading}
          containerClassName="group flex items-center has-[:disabled]:opacity-50 space-x-2 justify-center"
          className="disabled:cursor-not-allowed"
        >
          <InputOTPGroup>
            <InputOTPSlot
              index={0}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <InputOTPSlot
              index={1}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <InputOTPSlot
              index={2}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </InputOTPGroup>
          <InputOTPGroup>
            <InputOTPSlot
              index={3}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <InputOTPSlot
              index={4}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <InputOTPSlot
              index={5}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </InputOTPGroup>
        </InputOTP>
        {errors.otp && (
          <p className="text-sm text-red-500 text-center">{errors.otp}</p>
        )}
      </motion.div>

      <motion.div variants={inputVariants} className="space-y-4">
        <Button
          className="w-full bg-white text-black hover:bg-gray-200"
          type="submit"
          disabled={isLoading || code.length !== 6}
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Verify Email
        </Button>
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-400">Didn't receive the code?</p>
          <Button
            variant="link"
            className="text-sm text-gray-400 hover:text-gray-300"
            disabled={isLoading}
            onClick={() => {
              // TODO: Add resend code logic
              toast.success("Verification code resent");
            }}
          >
            Click to resend
          </Button>
        </div>
        <div className="text-center">
          <Link
            href="/auth/login"
            className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
          >
            Back to login
          </Link>
        </div>
      </motion.div>
    </motion.form>
  );
}
