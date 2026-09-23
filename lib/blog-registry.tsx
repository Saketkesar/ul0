import React from "react"

// Statically register blog page components for zero-overhead, SSR-safe rendering inside gates
export const BLOG_COMPONENTS: Record<string, () => Promise<{ default: React.ComponentType<any> }>> = {
  "link-shortening-best-practices-2026": () => import("@/app/blog/link-shortening-best-practices-2026/page"),
  "qr-code-generator-security-guide": () => import("@/app/blog/qr-code-generator-security-guide/page"),
  "custom-domain-dns-cname-setup-guide": () => import("@/app/blog/custom-domain-dns-cname-setup-guide/page"),
  "free-link-management-for-companies": () => import("@/app/blog/free-link-management-for-companies/page"),
  "cheapest-custom-domain-link-shortener": () => import("@/app/blog/cheapest-custom-domain-link-shortener/page"),
  "best-url-shorteners-2026": () => import("@/app/blog/best-url-shorteners-2026/page"),
  "bitly-alternative-free": () => import("@/app/blog/bitly-alternative-free/page"),
  "tinyurl-alternative": () => import("@/app/blog/tinyurl-alternative/page"),
  "free-url-shortener-no-signup": () => import("@/app/blog/free-url-shortener-no-signup/page"),
  "how-to-shorten-url-free": () => import("@/app/blog/how-to-shorten-url-free/page"),
  "qr-code-marketing-guide": () => import("@/app/blog/qr-code-marketing-guide/page"),
  "split-expenses-friends-app": () => import("@/app/blog/split-expenses-friends-app/page"),
  "short-links-instagram-bio": () => import("@/app/blog/short-links-instagram-bio/page"),
  "url-shortener-seo-impact": () => import("@/app/blog/url-shortener-seo-impact/page"),
  "how-to-track-link-clicks-free": () => import("@/app/blog/how-to-track-link-clicks-free/page"),
  "wifi-qr-code-business-guide": () => import("@/app/blog/wifi-qr-code-business-guide/page"),
  "custom-domain-short-links-guide": () => import("@/app/blog/custom-domain-short-links-guide/page"),
  "pomodoro-technique-productivity-guide": () => import("@/app/blog/pomodoro-technique-productivity-guide/page"),
  "affiliate-link-shortener-usa": () => import("@/app/blog/affiliate-link-shortener-usa/page"),
  "best-free-url-shortener-australia": () => import("@/app/blog/best-free-url-shortener-australia/page"),
  "best-free-url-shortener-canada": () => import("@/app/blog/best-free-url-shortener-canada/page"),
  "best-free-url-shortener-uk": () => import("@/app/blog/best-free-url-shortener-uk/page"),
  "bitly-alternative-usa": () => import("@/app/blog/bitly-alternative-usa/page"),
  "qr-code-erstellen-kostenlos-deutsch": () => import("@/app/blog/qr-code-erstellen-kostenlos-deutsch/page"),
  "qr-code-generator-australia": () => import("@/app/blog/qr-code-generator-australia/page"),
  "qr-code-generator-canada": () => import("@/app/blog/qr-code-generator-canada/page"),
  "qr-code-generator-uk": () => import("@/app/blog/qr-code-generator-uk/page"),
  "url-kuerzen-kostenlos-deutschland": () => import("@/app/blog/url-kuerzen-kostenlos-deutschland/page"),
}

export async function getBlogComponent(slug: string): Promise<React.ComponentType<any> | null> {
  const loader = BLOG_COMPONENTS[slug]
  if (!loader) return null
  try {
    const mod = await loader()
    return mod.default
  } catch (err) {
    console.error(`Failed to load blog component for ${slug}:`, err)
    return null
  }
}
