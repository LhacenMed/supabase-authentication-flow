"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { NavigationProgress } from "@/components/navigation-progress";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        return router.push("/auth/login");
      }
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, [router]);

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

  if (loading) {
    return (
      <div className="p-4 bg-black text-white min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

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
