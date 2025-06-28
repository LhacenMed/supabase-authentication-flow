import { createAdminClient } from "@/utils/supabase/client";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export async function signUp(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (!email || !password || !name) {
      return { error: "Missing required fields" };
    }

    // Create admin client for generating link
    const adminClient = createAdminClient();

    // Generate signup link with admin client
    const { data: linkData, error: linkError } =
      await adminClient.auth.admin.generateLink({
        type: "signup",
        email,
        password,
        options: {
          data: { name },
        },
      });

    if (linkError) {
      return { error: linkError.message };
    }

    // Send verification email using resend API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/resend`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "verification",
          email,
          isPasswordReset: false,
          origin: process.env.NEXT_PUBLIC_SITE_URL,
        }),
      }
    );

    if (!response.ok) {
      return { error: "Failed to send verification email" };
    }

    return { success: true, email };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
