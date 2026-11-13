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
  // Permissions policy - allow camera for document scanner
  "Permissions-Policy": "camera=*, microphone=(), geolocation=(), interest-cohort=()",
}

// List of reserved application prefixes that should never be treated as short slugs
const RESERVED_PATH_PREFIXES = [
  "/dashboard",
  "/settings",
  "/pricing",
  "/sign-in",
  "/sign-up",
  "/split",
  "/qr",
  "/utm",
  "/files",
  "/pdf",
  "/wifi",
  "/whatsapp",
  "/tools",
  "/buy",
  "/privacy",
  "/terms",
  "/contact",
  "/faq",
  "/blog",
  "/api",
  "/security",
  "/threats",
  "/backlinks",
  "/go",
  "/marketing",
  "/changelog",
  "/features",
  "/compare",
  "/about",
  "/refund",
  "/report-abuse",
  "/status",
  "/supporters",
  "/docs",
  "/custom-domain-landing",
  "/forms",
  "/icons",
  "/e",
  "/q",
  "/r",
]

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl.clone()
  const path = url.pathname

  // Protect dashboard and settings routes
  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  const hostname = req.headers.get("host") || ""

  // 301 Redirect legacy/temporary routes to their canonical destinations
  const LEGACY_REDIRECTS: Record<string, string> = {
    "/free-url-shortener": "/",
    "/qr-code-generator": "/qr",
    "/utm-builder": "/utm",
    "/wifi-qr-code-generator": "/wifi",
    "/link-tracker": "/",
    "/link-in-bio": "/",
    "/url-expander": "/",
    "/qr-code-for-business": "/qr",
    "/ads": "/dashboard/marketing",
    "/dashboard/ads": "/dashboard/marketing",
    "/blog/pdf-tools-free-online": "/pdf",
    "/blog/bitly-alternative-usa": "/blog/bitly-alternative-free",
    "/blog/best-free-url-shortener-australia": "/blog/best-url-shorteners-2026",
    "/blog/best-free-url-shortener-canada": "/blog/best-url-shorteners-2026",
    "/blog/best-free-url-shortener-uk": "/blog/best-url-shorteners-2026",
    "/blog/qr-code-generator-australia": "/qr",
    "/blog/qr-code-generator-canada": "/qr",
    "/blog/qr-code-generator-uk": "/qr",
    "/blog/url-kuerzen-kostenlos-deutschland": "/blog/link-kuerzen-ohne-anmeldung-kostenlos",
    "/blog/qr-code-erstellen-kostenlos-deutsch": "/de",
  }
  if (LEGACY_REDIRECTS[path]) {
    return NextResponse.redirect(new URL(LEGACY_REDIRECTS[path], req.url), 301)
  }

  // Redirect legacy /m/:slug to /go/:slug
  if (path.startsWith("/m/")) {
    const slug = path.replace("/m/", "")
    return NextResponse.redirect(new URL(`/go/${slug}`, req.url), 301)
  }

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

    // 3. Allow /r/ and /q/ slug resolution paths to load directly
    if (path.startsWith("/r/") || path.startsWith("/q/")) {
      return NextResponse.next()
    }

    // 4. Check if it's a reserved path
    const isReserved = RESERVED_PATH_PREFIXES.some(
      (prefix) => path === prefix || path.startsWith(prefix + "/"),
    )

    if (isReserved) {
      return NextResponse.redirect(
        new URL(`https://ul0.site${path}${url.search}`, req.url),
      )
    }

    // 5. Otherwise, treat as a short link slug and rewrite to /r/
    const slug = path.substring(1)
    const isValidSlug = /^[a-zA-Z0-9-_]+$/.test(slug) && slug.length <= 50

    if (isValidSlug) {
      url.pathname = `/r${path}`
      const response = NextResponse.rewrite(url)
      
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      
      return response
    }

    return NextResponse.redirect(new URL("https://ul0.site", req.url))
  }

  // Handle Main Site (ul0.site): Support root slugs without /r/ (e.g. ul0.site/mydeal -> /r/mydeal)
  const isRootSlug = /^\/[a-zA-Z0-9-_]{1,50}$/.test(path)
  const isReservedMain =
    RESERVED_PATH_PREFIXES.some((prefix) => path === prefix || path.startsWith(prefix + "/")) ||
    LOCALES.includes(path.substring(1) as any)

  if (isRootSlug && !isReservedMain && path !== "/" && !path.startsWith("/r/")) {
    url.pathname = `/r${path}`
    const response = NextResponse.rewrite(url)
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    response.headers.set("X-Robots-Tag", "noindex, nofollow")
    return response
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

  // Prevent search engines from indexing short redirect links
  if (pathname.startsWith("/r/") || pathname.startsWith("/go/")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow")
  }

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
    // Match all routes except static files and assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|wav|ogg|ico|txt|xml|json)$).*)",
    // API and tRPC routes
    "/(api|trpc)(.*)",
    // Clerk auto-proxy path
    "/__clerk/:path*",
  ],
}
