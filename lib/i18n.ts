// Centralized internationalization config for ul0.
// Keeping a single source of truth guarantees that every localized page
// emits a complete, reciprocal hreflang set (required for Google to honor it).

export const SITE_URL = "https://ul0.site"

// Localized homepages (excluding the default English homepage at "/").
// Targeted toward high-CPM / lower-competition markets.
export const LOCALES = [
  "es", // Spanish  - Spain, LATAM
  "pt", // Portuguese - Brazil, Portugal
  "hi", // Hindi - India
  "id", // Indonesian - Indonesia
  "vi", // Vietnamese - Vietnam
  "th", // Thai - Thailand
  "de", // German - Germany, Austria, Switzerland (high CPM)
  "fr", // French - France, Belgium, Switzerland, Canada (high CPM)
  "nl", // Dutch - Netherlands, Belgium (high CPM, low competition)
  "ja", // Japanese - Japan (high CPM)
  "ko", // Korean - South Korea
  "ar", // Arabic - Gulf states (high CPM)
] as const

export type Locale = (typeof LOCALES)[number]

// Right-to-left locales need dir="rtl" on the page wrapper.
export const RTL_LOCALES: readonly Locale[] = ["ar"]

export const isRtl = (locale: Locale): boolean => RTL_LOCALES.includes(locale)

// Complete reciprocal hreflang map emitted on every page.
// Includes x-default + English + every localized homepage.
export const hreflangAlternates: Record<string, string> = {
  "x-default": SITE_URL,
  en: SITE_URL,
  ...Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}`])),
}
