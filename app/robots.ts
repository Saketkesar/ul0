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
          "/sign-up/"
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
