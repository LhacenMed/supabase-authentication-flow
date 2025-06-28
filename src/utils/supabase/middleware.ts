import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, type NextRequest } from "next/server";

// Define protected and auth routes
const protectedRoutes = ["/dashboard"];
const authRoutes = ["/auth/login", "/auth/signup", "/auth/reset-password"];

export async function updateSession(request: NextRequest) {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create client with response/request
  const supabase = createMiddlewareClient({ req: request, res: response });

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAuthPage = authRoutes.includes(path);
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isNewPasswordPage = path === "/auth/new-password";

  // Handle protected routes
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL("/unauthenticated", request.url));
  }

  // Handle auth pages
  if (user && isAuthPage && !isNewPasswordPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Handle unauthenticated page
  if (user && path === "/unauthenticated") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}
