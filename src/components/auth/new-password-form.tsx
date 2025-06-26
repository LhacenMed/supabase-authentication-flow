"use client";

import { useState } from "react";
import { motion, Variants } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { Eye, EyeOff } from "lucide-react";
import { newPasswordSchema } from "@/lib/utils/validation";
import { toast } from "sonner";
import { z } from "zod";

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
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(event.target as HTMLFormElement);
    const data = {
      currentPassword: formData.get("currentPassword") as string,
      newPassword: formData.get("newPassword") as string,
      confirmNewPassword: formData.get("confirmNewPassword") as string,
    };

    try {
      const validatedData = newPasswordSchema.parse(data);
      // TODO: Add your password update logic here
      // For example: await updatePassword(validatedData)
      toast.success("Password updated successfully");
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
      className="space-y-4"
    >
      <motion.div variants={inputVariants} className="space-y-2">
        <Label htmlFor="currentPassword" className="text-gray-300">
          Current Password
        </Label>
        <div className="relative">
          <Input
            id="currentPassword"
            name="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            required
            disabled={isLoading}
            className="bg-gray-800 border-gray-700 text-white pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-300"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            {showCurrentPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="sr-only">
              {showCurrentPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>
        {errors.currentPassword && (
          <p className="text-sm text-red-500">{errors.currentPassword}</p>
        )}
      </motion.div>

      <motion.div variants={inputVariants} className="space-y-2">
        <Label htmlFor="newPassword" className="text-gray-300">
          New Password
        </Label>
        <div className="relative">
          <Input
            id="newPassword"
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            required
            disabled={isLoading}
            className="bg-gray-800 border-gray-700 text-white pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-300"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="sr-only">
              {showNewPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>
        {errors.newPassword && (
          <p className="text-sm text-red-500">{errors.newPassword}</p>
        )}
      </motion.div>

      <motion.div variants={inputVariants} className="space-y-2">
        <Label htmlFor="confirmNewPassword" className="text-gray-300">
          Confirm New Password
        </Label>
        <div className="relative">
          <Input
            id="confirmNewPassword"
            name="confirmNewPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            disabled={isLoading}
            className="bg-gray-800 border-gray-700 text-white pr-10"
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
        {errors.confirmNewPassword && (
          <p className="text-sm text-red-500">{errors.confirmNewPassword}</p>
        )}
      </motion.div>

      <motion.div variants={inputVariants}>
        <Button
          className="w-full bg-white text-black hover:bg-gray-200"
          type="submit"
          disabled={isLoading}
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Update Password
        </Button>
      </motion.div>
    </motion.form>
  );
}
