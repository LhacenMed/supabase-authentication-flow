import { Loader2 } from "lucide-react";

export default function AuthLoading() {
  return (
    <div className="p-4 bg-black text-white min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  );
}
