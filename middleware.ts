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

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl.clone()
  const path = url.pathname

  // Check Maintenance Mode (Active by default during 24h window; disable with MAINTENANCE_MODE="false")
  const isMaintenanceMode = process.env.MAINTENANCE_MODE !== "false"

  if (isMaintenanceMode) {
    // 1. Check for admin bypass query param or cookie
    const bypassParam = url.searchParams.get("bypass")
    const exitBypass = url.searchParams.get("exit_bypass")
    const bypassCookie = req.cookies.get("ul0_maintenance_bypass")?.value

    if (exitBypass === "true") {
      const cleanUrl = req.nextUrl.clone()
      cleanUrl.searchParams.delete("exit_bypass")
      const res = NextResponse.redirect(cleanUrl)
      res.cookies.delete("ul0_maintenance_bypass")
      return res
    }

    if (bypassParam === "ul0_admin") {
      const cleanUrl = req.nextUrl.clone()
      cleanUrl.searchParams.delete("bypass")
      const res = NextResponse.redirect(cleanUrl)
      res.cookies.set("ul0_maintenance_bypass", "ul0_admin", {
        path: "/",
        maxAge: 86400,
        sameSite: "lax",
      })
      return res
    }

    const hasBypass = bypassCookie === "ul0_admin"

    if (!hasBypass) {
      // 2. Allow static files, maintenance artwork, and metadata
      const isStaticOrMedia =
        path.startsWith("/_next") ||
        path.includes(".") ||
        path.startsWith("/favicon") ||
        path === "/robots.txt" ||
        path === "/sitemap.xml" ||
        path === "/manifest.webmanifest"

      if (isStaticOrMedia) {
        return NextResponse.next()
      }

      // 3. If already on /maintenance, let it render
      if (path === "/maintenance") {
        const res = NextResponse.next()
        res.headers.set("Retry-After", "86400")
        res.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate")
        return res
      }

      // 4. For API routes, return 503 JSON with Retry-After
      if (path.startsWith("/api/")) {
        return NextResponse.json(
          {
            error: "Service Unavailable: Scheduled database maintenance in progress.",
            maintenance: true,
            estimated_window: "24h",
          },
          {
            status: 503,
            headers: {
              "Retry-After": "86400",
              "Cache-Control": "no-store, max-age=0, must-revalidate",
            },
          }
        )
      }

      // 5. For web routes, rewrite to the maintenance page with HTTP 503
      url.pathname = "/maintenance"
      const res = NextResponse.rewrite(url, {
        status: 503,
      })
      res.headers.set("Retry-After", "86400")
      res.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate")
      Object.entries(securityHeaders).forEach(([key, value]) => {
        res.headers.set(key, value)
      })
      return res
    }
  }

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

    // 3. Allow /r/ and /q/ slug resolution paths to load directly
    if (path.startsWith("/r/") || path.startsWith("/q/")) {
      return NextResponse.next()
    }

    // List of reserved application prefixes that should never be accessed on custom domains
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
