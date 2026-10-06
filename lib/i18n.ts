// Centralized internationalization config for ul0.
// Keeping a single source of truth guarantees that every localized page
// emits a complete, reciprocal hreflang set (required for Google to honor it).

export const SITE_URL = "https://ul0.site"

// Tier 1 indexed locales (high-value / fully translated)
export const INDEXED_LOCALES = [
  "es", // Spanish
  "de", // German
  "fr", // French
  "ja", // Japanese
  "ko", // Korean
  "hi", // Hindi
] as const

// Unindexed locales (until fully translated / native quality)
export const NOINDEX_LOCALES = [
  "pt", // Portuguese
  "nl", // Dutch
  "vi", // Vietnamese
  "id", // Indonesian
  "th", // Thai
  "ar", // Arabic
] as const

export const LOCALES = [...INDEXED_LOCALES, ...NOINDEX_LOCALES] as const

export type Locale = (typeof LOCALES)[number]

// Right-to-left locales need dir="rtl" on the page wrapper.
export const RTL_LOCALES: readonly Locale[] = ["ar"]

export const isRtl = (locale: Locale): boolean => RTL_LOCALES.includes(locale)

// Complete reciprocal hreflang map emitted on indexed pages.
// Only indexable pages are included so Google Search Console does not flag noindex hreflang mismatches.
export const hreflangAlternates: Record<string, string> = {
  "x-default": SITE_URL,
  en: SITE_URL,
  ...Object.fromEntries(INDEXED_LOCALES.map((l) => [l, `${SITE_URL}/${l}`])),
}
