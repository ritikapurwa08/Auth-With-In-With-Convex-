import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublicPage = createRouteMatcher(["/auth"]);

export default convexAuthNextjsMiddleware((request) => {
  // If the user is not authenticated and not on a public page, redirect to auth
  if (!isAuthenticatedNextjs() && !isPublicPage(request)) {
    return nextjsMiddlewareRedirect(request, "/auth");
  }

  // If the user is authenticated and on the auth page, redirect to home
  if (isAuthenticatedNextjs() && isPublicPage(request)) {
    return nextjsMiddlewareRedirect(request, "/");
  }

  // For all other cases, allow the request to proceed
  return null;
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};