"use client";

import { CardFooter } from "@/components/ui/card";
import { NavigationProgress } from "@/components/navigation-progress";
import { motion, Variants } from "motion/react";
import { useEffect } from "react";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AuthFormProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.645, 0.045, 0.355, 1],
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

// const childVariants: Variants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.3,
//       ease: [0.645, 0.045, 0.355, 1],
//     },
//   },
// };

export function AuthForm({
  title,
  description,
  children,
  footer,
}: AuthFormProps) {
  // const [loading, setLoading] = useState(true);
  // const router = useRouter();
  // const supabase = createClient();

  // useEffect(() => {
  //   const getUser = async () => {
  //     const {
  //       data: { user },
  //       error,
  //     } = await supabase.auth.getUser();
  //     if (user) {
  //       return router.push("/dashboard");
  //     }
  //     setLoading(false);
  //   };

  //   getUser();
  // }, [router]);

  // if (loading) {
  //   return (
  //     <div className="p-4 bg-black text-white min-h-screen flex items-center justify-center">
  //       <Loader2 className="w-10 h-10 animate-spin" />
  //     </div>
  //   );
  // }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-950">
      <NavigationProgress />
      <motion.div
        className="w-full max-w-md mx-auto space-y-6 p-6 bg-gray-950 rounded-2xl shadow-xl border border-gray-700"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="text-gray-400">{description}</p>
        </motion.div>
        <motion.div>{children}</motion.div>
        {footer && (
          <CardFooter className="flex flex-col space-y-2">{footer}</CardFooter>
        )}
      </motion.div>
    </div>
  );
}
