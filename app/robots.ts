import type { MetadataRoute } from "next"

const BASE_URL = "https://ul0.site"

export default function robots(): MetadataRoute.Robots {
  const disallowPaths = [
    "/api/",
    "/r/",
    "/fight/",
    "/_next/",
    "/dashboard/",
    "/sign-in/",
    "/sign-up/",
    "/split/*/",
  ]

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowPaths,
      },
      {
        userAgent: ["Googlebot", "Bingbot", "Applebot"],
        allow: "/",
        disallow: disallowPaths,
      },
      // Explicitly allow AI search crawlers for GEO/AEO
      {
        userAgent: "ClaudeBot",
        allow: ["/", "/llms.txt"],
        disallow: disallowPaths,
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/", "/llms.txt"],
        disallow: disallowPaths,
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: disallowPaths,
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: disallowPaths,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
