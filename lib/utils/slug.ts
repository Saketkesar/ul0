// Generate a random short slug
export function generateSlug(length = 6): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// ============================================
// URL VALIDATION - SSRF Prevention
// ============================================

// Private IP ranges to block (SSRF prevention)
const PRIVATE_IP_PATTERNS = [
  /^127\./,                          // Loopback
  /^10\./,                           // Private Class A
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,  // Private Class B
  /^192\.168\./,                     // Private Class C
  /^169\.254\./,                     // Link-local
  /^0\./,                            // Current network
  /^224\./,                          // Multicast
  /^240\./,                          // Reserved
  /^255\./,                          // Broadcast
  /^::1$/,                           // IPv6 loopback
  /^fe80:/i,                         // IPv6 link-local
  /^fc00:/i,                         // IPv6 unique local
  /^fd00:/i,                         // IPv6 unique local
]

// Blocked hostnames (SSRF prevention)
const BLOCKED_HOSTNAMES = [
  'localhost',
  'localhost.localdomain',
  '0.0.0.0',
  '[::1]',
  'metadata.google.internal',         // GCP metadata
  '169.254.169.254',                  // AWS/Azure/GCP metadata endpoint
  'metadata.google',
  'kubernetes.default',
  'kubernetes.default.svc',
]

// Only HTTPS is allowed — http:// and protocol-less URLs are rejected
const ALLOWED_PROTOCOLS = ['https:']

// Known malicious TLD/domain pattern heuristics (supplemental layer)
// Full protection requires server-side Google Safe Browsing API
const SUSPICIOUS_PATTERNS = [
  /\.(tk|ml|cf|ga|gq)$/i,           // Commonly abused free TLDs
  /bit\.do\//i,                      // Known spam redirect
  /free.*money/i,                    // Obvious scam patterns
  /click.*here.*prize/i,
]

// Maximum URL length to prevent DoS
const MAX_URL_LENGTH = 2048

// Minimum URL length
const MIN_URL_LENGTH = 10

// Major brand assets to check for brand mimicry attacks
const PROTECTED_BRANDS = [
  { name: "libero", domains: ["libero.it", "liberomail.it"] },
  { name: "facebook", domains: ["facebook.com", "fb.com", "messenger.com"] },
  { name: "instagram", domains: ["instagram.com"] },
  { name: "google", domains: ["google.com", "gmail.com", "youtube.com"] },
  { name: "paypal", domains: ["paypal.com"] },
  { name: "netflix", domains: ["netflix.com"] },
  { name: "microsoft", domains: ["microsoft.com", "outlook.com", "live.com"] },
  { name: "apple", domains: ["apple.com", "icloud.com"] },
  { name: "amazon", domains: ["amazon.com", "amzn.to"] },
  { name: "chase", domains: ["chase.com"] },
  { name: "steam", domains: ["steampowered.com", "steamcommunity.com"] },
  { name: "telegram", domains: ["telegram.org", "t.me"] },
  { name: "whatsapp", domains: ["whatsapp.com", "wa.me"] },
]

// Common keywords scammers append to spoof authentication portals
const PHISHING_KEYWORDS = [
  "verif",
  "expert",
  "secure",
  "login",
  "signin",
  "signup",
  "billing",
  "support",
  "update",
  "safety",
  "portal",
  "redirect",
  "resolve",
]

const HIGH_RISK_TLDS = [
  "click",
  "xyz",
  "top",
  "work",
  "bid",
  "club",
  "site",
  "online",
  "store",
  "link",
]

export function isPhishingAttempt(hostname: string, urlString: string): boolean {
  const normalized = hostname.toLowerCase()

  // 1. Brand Spoofing Check
  // Check if domain contains a protected brand name, but isn't an authorized domain
  for (const brand of PROTECTED_BRANDS) {
    if (normalized.includes(brand.name)) {
      const isAuthorized = brand.domains.some(domain => 
        normalized === domain || normalized.endsWith("." + domain)
      )
      if (!isAuthorized) {
        return true
      }
    }
  }

  // 2. High-Risk TLD + Phishing Keywords Heuristic
  const tld = normalized.split(".").pop() || ""
  if (HIGH_RISK_TLDS.includes(tld)) {
    const containsPhishingWord = PHISHING_KEYWORDS.some(word => normalized.includes(word))
    if (containsPhishingWord) {
      return true
    }
  }

  return false
}

/**
 * Check if a hostname resolves to a private IP
 */
function isPrivateIP(hostname: string): boolean {
  // Check against known private IP patterns
  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(hostname)) {
      return true
    }
  }
  return false
}

/**
 * Check if hostname is blocked
 */
function isBlockedHostname(hostname: string): boolean {
  const normalizedHostname = hostname.toLowerCase().trim()
  
  // Direct match
  if (BLOCKED_HOSTNAMES.includes(normalizedHostname)) {
    return true
  }
  
  // Check if it's a private IP
  if (isPrivateIP(normalizedHostname)) {
    return true
  }
  
  // Block attempts to use IP addresses with unusual formats
  // e.g., 0x7f.0.0.1 (hex), 2130706433 (decimal), 017700000001 (octal)
  if (/^0x[0-9a-f]/i.test(normalizedHostname) || /^\d{10,}$/.test(normalizedHostname)) {
    return true
  }
  
  return false
}

/**
 * Comprehensive URL validation result
 */
export interface UrlValidationResult {
  valid: boolean
  error?: string
}

/**
 * Validate URL with comprehensive security checks
 * Prevents SSRF, XSS, and other injection attacks
 */
export function validateUrl(urlString: string): UrlValidationResult {
  // Check length limits
  if (!urlString || urlString.length < MIN_URL_LENGTH) {
    return { valid: false, error: "URL is too short" }
  }
  
  if (urlString.length > MAX_URL_LENGTH) {
    return { valid: false, error: "URL is too long (max 2048 characters)" }
  }
  
  // Basic sanitization - trim whitespace
  const trimmedUrl = urlString.trim()
  
  // Block data: and javascript: URLs
  const lowerUrl = trimmedUrl.toLowerCase()
  if (lowerUrl.startsWith('data:') || lowerUrl.startsWith('javascript:') || lowerUrl.startsWith('vbscript:')) {
    return { valid: false, error: "Invalid URL scheme" }
  }
  
  let url: URL
  try {
    url = new URL(trimmedUrl)
  } catch {
    return { valid: false, error: "Invalid URL format" }
  }
  
  // Protocol validation - HTTPS only
  if (!ALLOWED_PROTOCOLS.includes(url.protocol)) {
    if (url.protocol === 'http:') {
      return { valid: false, error: "Only HTTPS links are accepted. Please use https:// instead of http://" }
    }
    return { valid: false, error: "Only https:// links are allowed" }
  }
  
  // Hostname validation
  const hostname = url.hostname.toLowerCase()
  
  if (!hostname || hostname.length === 0) {
    return { valid: false, error: "URL must have a valid hostname" }
  }
  
  // Block dangerous hostnames (SSRF prevention)
  if (isBlockedHostname(hostname)) {
    return { valid: false, error: "This URL cannot be shortened" }
  }
  
  // Check for URL obfuscation attempts with userinfo
  if (url.username || url.password) {
    return { valid: false, error: "URLs with credentials are not allowed" }
  }
  
  // Block URLs that look like they're trying to access internal services
  if (hostname.includes('internal') || hostname.includes('intranet') || hostname.includes('corp.')) {
    return { valid: false, error: "Internal URLs cannot be shortened" }
  }
  
  // Validate that hostname has at least one dot
  const isDevelopment = process.env.NODE_ENV === 'development'
  if (!hostname.includes('.') && !(isDevelopment && hostname === 'localhost')) {
    return { valid: false, error: "Invalid hostname" }
  }

  // Automated brand mimicry / Phishing check
  if (isPhishingAttempt(hostname, urlString)) {
    return { valid: false, error: "This URL has been flagged as a security risk (phishing/mimicry detection) and cannot be shortened" }
  }

  // Heuristic phishing/malware check on full URL
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(url.hostname) || pattern.test(urlString)) {
      return { valid: false, error: "This URL has been flagged as potentially unsafe and cannot be shortened" }
    }
  }
  
  return { valid: true }
}

// Simple validation for backward compatibility
export function isValidUrl(string: string): boolean {
  return validateUrl(string).valid
}

// ============================================
// CUSTOM SLUG VALIDATION
// ============================================

// Reserved slugs that cannot be used
const RESERVED_SLUGS = [
  'admin', 'api', 'app', 'auth', 'blog', 'contact',
  'dashboard', 'docs', 'faq', 'help', 'home', 'login',
  'logout', 'privacy', 'profile', 'register', 'settings',
  'signup', 'static', 'terms', 'user', 'users', 'www',
  'about', 'pricing', 'support', 'status', 'legal',
  'assets', 'images', 'css', 'js', 'fonts', 'media',
  'qr', 'wifi', 'split', 'r', 'es', 'hi', 'id', 'pt', 'th', 'vi',
]

// Slug constraints
const SLUG_MIN_LENGTH = 3
const SLUG_MAX_LENGTH = 50
// Slug pattern — written to avoid catastrophic backtracking (ReDoS)
// Uses character class repetition without nested quantifiers
const SLUG_PATTERN = /^[a-z0-9]([a-z0-9_-]{0,48}[a-z0-9])?$/

/**
 * Custom slug validation result
 */
export interface SlugValidationResult {
  valid: boolean
  sanitized?: string
  error?: string
}

/**
 * Validate and sanitize custom slug
 * Prevents path traversal and other injection attacks
 */
export function validateCustomSlug(slug: string | undefined | null): SlugValidationResult {
  // If no slug provided, it's valid (will use auto-generated)
  if (!slug || slug.trim() === '') {
    return { valid: true, sanitized: undefined }
  }
  
  // Sanitize: trim, lowercase, remove dangerous characters
  let sanitized = slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '') // Only allow alphanumeric, dash, underscore
    .replace(/^[-_]+|[-_]+$/g, '') // Remove leading/trailing dashes and underscores
    .replace(/[-_]{2,}/g, '-') // Replace multiple consecutive dashes/underscores with single dash
  
  // Check length after sanitization
  if (sanitized.length < SLUG_MIN_LENGTH) {
    return { valid: false, error: `Custom slug must be at least ${SLUG_MIN_LENGTH} characters` }
  }
  
  if (sanitized.length > SLUG_MAX_LENGTH) {
    return { valid: false, error: `Custom slug must be no more than ${SLUG_MAX_LENGTH} characters` }
  }
  
  // Check pattern
  if (!SLUG_PATTERN.test(sanitized)) {
    return { valid: false, error: "Custom slug must start and end with a letter or number" }
  }
  
  // Check against reserved words
  if (RESERVED_SLUGS.includes(sanitized)) {
    return { valid: false, error: "This slug is reserved and cannot be used" }
  }
  
  // Block path traversal attempts
  if (sanitized.includes('..') || sanitized.includes('//') || sanitized.includes('\\')) {
    return { valid: false, error: "Invalid characters in custom slug" }
  }
  
  return { valid: true, sanitized }
}

// Extract domain from URL
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return ""
  }
}
