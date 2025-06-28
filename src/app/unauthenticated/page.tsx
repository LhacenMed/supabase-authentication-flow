"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function UnauthenticatedPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.replace("/dashboard");
      } else {
        setLoading(false);
      }
    };

    checkSession();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="p-4 bg-black text-white min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 p-4 text-center">
      <h1 className="mb-4 text-3xl font-bold text-white">Welcome to Rihleti</h1>
      <p className="mb-8 text-gray-400">
        Please sign in to access your dashboard
      </p>
      <div className="space-x-4">
        <Button
          onClick={() => router.push("/auth/login")}
          className="bg-white text-black hover:bg-gray-300"
        >
          Sign In
        </Button>
        <Button
          onClick={() => router.push("/auth/signup")}
          variant="outline"
          className="border-gray-700 text-white hover:bg-gray-300 bg-black"
        >
          Create Account
        </Button>
      </div>
    </div>
  );
}
