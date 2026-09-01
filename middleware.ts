import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { LOCALES } from "@/lib/i18n"

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/settings(.*)",
  "/api/private(.*)",
])

// Security headers to add to all responses
const securityHeaders: Record<string, string> = {
  // Prevent clickjacking
  "X-Frame-Options": "SAMEORIGIN",
  // Prevent MIME type sniffing
  "X-Content-Type-Options": "nosniff",
  // Enable XSS protection in older browsers
  "X-XSS-Protection": "1; mode=block",
  // Control referrer information
  "Referrer-Policy": "strict-origin-when-cross-origin",
  // Permissions policy - restrict sensitive features
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
}

export default clerkMiddleware(async (auth, req) => {
  // Protect dashboard and settings routes
  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  const url = req.nextUrl.clone()
  const hostname = req.headers.get("host") || ""
  const path = url.pathname

  // Determine if it is a custom domain request (not local or main site)
  const isCustomDomain =
    hostname &&
    hostname !== "ul0.site" &&
    !hostname.endsWith(".ul0.site") &&
    !hostname.includes("localhost") &&
    !hostname.includes("127.0.0.1")

  if (isCustomDomain) {
    // 1. Root domain landing page
    if (path === "/" || path === "") {
      url.pathname = "/custom-domain-landing"
      const response = NextResponse.rewrite(url)
      
      // Add security headers to rewritten request
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      
      return response
    }

    // 2. Allow static assets and Next.js internal files to load normally
    const isStaticOrInternal =
      path.startsWith("/_next") ||
      path.includes(".") ||
      path.startsWith("/favicon")

    if (isStaticOrInternal) {
      return NextResponse.next()
    }

    // 3. Allow /r/ slug resolution paths to load directly
    if (path.startsWith("/r/")) {
      return NextResponse.next()
    }

    // List of reserved application prefixes that should never be accessed on custom domains
    const RESERVED_PATH_PREFIXES = [
      "/dashboard",
      "/settings",
      "/pricing",
      "/sign-in",
      "/sign-up",
      "/free-url-shortener",
      "/qr-code-generator",
      "/utm-builder",
      "/wifi-qr-code-generator",
      "/security",
      "/report-abuse",
      "/split",
      "/qr",
      "/utm",
      "/json",
      "/pdf",
      "/pomodoro",
      "/quotes",
      "/wifi",
      "/worldclock",
      "/clock",
      "/countdown",
      "/ambient",
      "/buy",
      "/privacy",
      "/terms",
      "/contact",
      "/faq",
      "/blog",
      "/api",
    ]

    // 3. Check if it's a reserved path
    const isReserved = RESERVED_PATH_PREFIXES.some(
      (prefix) => path === prefix || path.startsWith(prefix + "/"),
    )

    if (isReserved) {
      // Securely redirect to the canonical main site to prevent dashboard/account leaks
      return NextResponse.redirect(
        new URL(`https://ul0.site${path}${url.search}`, req.url),
      )
    }

    // 4. Otherwise, treat as a short link slug
    const slug = path.substring(1)
    const isValidSlug = /^[a-zA-Z0-9-_]+$/.test(slug) && slug.length <= 50

    if (isValidSlug) {
      url.pathname = `/r${path}`
      const response = NextResponse.rewrite(url)
      
      // Add security headers to rewritten request
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      
      return response
    }

    // 5. Fallback for any other path: redirect to main site home
    return NextResponse.redirect(new URL("https://ul0.site", req.url))
  }

  // Determine the locale of the request based on URL pathname
  const requestHeaders = new Headers(req.headers)
  const pathname = req.nextUrl.pathname
  const firstSegment = pathname.split("/")[1]
  const isLocale = LOCALES.includes(firstSegment as any)
  const locale = isLocale ? firstSegment : "en"
  requestHeaders.set("x-locale", locale)

  // Build response with modified request headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Add HSTS header for HTTPS connections (only in production)
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    )
  }

  return response
})

export const config = {
  matcher: [
    // Match all routes except static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|wav|ogg|ico|txt|xml|json)$).*)",
    // API and tRPC routes
    "/(api|trpc)(.*)",
    // Clerk auto-proxy path
    "/__clerk/:path*",
  ],
}
