import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AuthLoading from "./loading";

async function AuthLayoutInner({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is authenticated and not on new-password page, redirect to dashboard
  if (user) {
    redirect("/dashboard");
  }

  return children;
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<AuthLoading />}>
      <AuthLayoutInner>{children}</AuthLayoutInner>
    </Suspense>
  );
}
