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
  "how-to-split-expenses-group-bills-online": () => import("@/app/blog/how-to-split-expenses-group-bills-online/page"),
  "acortar-link-gratis-guia-completa": () => import("@/app/blog/acortar-link-gratis-guia-completa/page"),
  "link-kuerzen-ohne-anmeldung-kostenlos": () => import("@/app/blog/link-kuerzen-ohne-anmeldung-kostenlos/page"),
  "tiktok-bio-link-tools-guide-2026": () => import("@/app/blog/tiktok-bio-link-tools-guide-2026/page"),
  "utm-builder-tracking-guide-2026": () => import("@/app/blog/utm-builder-tracking-guide-2026/page"),
  "branded-short-links-roi-case-study": () => import("@/app/blog/branded-short-links-roi-case-study/page"),
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
