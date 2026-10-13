/**
 * Slug validation and reserved keyword list for public forms (/e/[slug]).
 */

export const RESERVED_FORM_SLUGS = new Set([
  "api",
  "new",
  "admin",
  "login",
  "signup",
  "sign-in",
  "sign-up",
  "dashboard",
  "settings",
  "billing",
  "help",
  "docs",
  "terms",
  "privacy",
  "report",
  "e",
  "r",
  "q",
  "s",
  "c",
  "u",
  "blog",
  "about",
  "contact",
  "support",
  "auth",
  "webhooks",
  "forms",
  "pricing",
  "features",
  "status",
  "explore",
  "security",
  "appwrite",
  "vercel",
  "google",
])

export interface SlugValidationResult {
  valid: boolean
  error?: string
  sanitized?: string
}

/**
 * Validates a form slug against length, character set, and reserved keywords.
 */
export function validateFormSlug(rawSlug: string): SlugValidationResult {
  if (!rawSlug || typeof rawSlug !== "string") {
    return { valid: false, error: "Slug is required." }
  }

  const slug = rawSlug.trim().toLowerCase()

  if (slug.length < 3) {
    return { valid: false, error: "Slug must be at least 3 characters long." }
  }

  if (slug.length > 40) {
    return { valid: false, error: "Slug must not exceed 40 characters." }
  }

  if (slug.startsWith("-") || slug.endsWith("-")) {
    return { valid: false, error: "Slug cannot start or end with a hyphen." }
  }

  if (slug.includes("--")) {
    return { valid: false, error: "Slug cannot contain consecutive hyphens." }
  }

  // Only lowercase letters, digits, and hyphens allowed
  const validCharsRegex = /^[a-z0-9-]+$/
  if (!validCharsRegex.test(slug)) {
    return { valid: false, error: "Slug may only contain lowercase letters, numbers, and hyphens." }
  }

  if (RESERVED_FORM_SLUGS.has(slug)) {
    return { valid: false, error: `The slug "${slug}" is reserved for system use. Please choose another.` }
  }

  return { valid: true, sanitized: slug }
}
