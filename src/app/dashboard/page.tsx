import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardClient } from "./client";

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("user: ", user);

  if (!user) {
    redirect("/unauthenticated");
  }

  return <DashboardClient user={user} />;
}
