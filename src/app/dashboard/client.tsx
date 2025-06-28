"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { NavigationProgress } from "@/components/navigation-progress";
import { User } from "@supabase/supabase-js";

interface DashboardClientProps {
  user: User;
}

export function DashboardClient({ user }: DashboardClientProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="p-4 bg-black text-white min-h-screen">
      <NavigationProgress />
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">
        Welcome{" "}
        {user?.user_metadata.name ? user?.user_metadata.name : user?.email}
      </p>
      <Button
        onClick={handleSignOut}
        className="bg-gray-700 text-white hover:bg-gray-700"
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <>
            Logout
            <Loader2 className="w-4 h-4 animate-spin" />
          </>
        ) : (
          "Logout"
        )}
      </Button>
    </div>
  );
}
