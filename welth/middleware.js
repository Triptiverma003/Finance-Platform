export const runtime = "experimental-edge";

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (!userId && isProtectedRoute(req)) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all pages except static files
    "/((?!_next|.*\\.(?:html?|css|js|json|jpg|jpeg|png|gif|svg|webp|ico|woff2?|ttf)).*)",
    // API routes should still get Clerk
    "/(api|trpc)(.*)",
  ],
};
