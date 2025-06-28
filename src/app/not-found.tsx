import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-6 text-gray-300">Page Not Found</h2>
      <p className="text-gray-400 text-center mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved to another
        URL.
      </p>
      <Link href="/">
        <Button className="bg-white text-black hover:bg-gray-300">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
