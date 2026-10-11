import { DEFAULT_HOST } from "@/lib/appwrite/config"

/**
 * Returns the canonical clickable URL for a short link.
 * On ul0.site (and local dev), routes use /r/[slug] to avoid collision with app pages.
 * On verified custom domains, middleware rewrites /[slug] to /r/[slug] directly.
 */
export function getShortUrl(host: string = DEFAULT_HOST, slug: string): string {
  const cleanHost = (host || DEFAULT_HOST).toLowerCase().trim()
  const isDefault =
    cleanHost === "ul0.site" ||
    cleanHost === DEFAULT_HOST ||
    cleanHost.includes("localhost") ||
    cleanHost.includes("127.0.0.1")

  if (isDefault) {
    return `https://${cleanHost}/r/${slug}`
  }
  return `https://${cleanHost}/${slug}`
}

/**
 * Returns the visual prefix for short links in tables and cards.
 * E.g. "ul0.site/r/" for public shortener, or "go.brand.com/" for custom domains.
 */
export function getShortDisplayPrefix(host: string = DEFAULT_HOST): string {
  const cleanHost = (host || DEFAULT_HOST).toLowerCase().trim()
  const isDefault =
    cleanHost === "ul0.site" ||
    cleanHost === DEFAULT_HOST ||
    cleanHost.includes("localhost") ||
    cleanHost.includes("127.0.0.1")

  if (isDefault) {
    return `${cleanHost}/r/`
  }
  return `${cleanHost}/`
}
