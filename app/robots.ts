import type { MetadataRoute } from "next"

const BASE_URL = "https://ul0.site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/r/",
          "/fight/",
          "/_next/",
          "/dashboard/",
          "/sign-in/",
          "/sign-up/",
          "/split/*/",
        ],
      },
      // Explicitly allow AI search crawlers for GEO/AEO
      {
        userAgent: "ClaudeBot",
        allow: ["/", "/llms.txt"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/", "/llms.txt"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
