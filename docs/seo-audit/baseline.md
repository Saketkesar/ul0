# UL0 SEO & Performance Baseline Audit

**Date:** 2026-10-11  
**Auditor / Scope:** ul0.site audit & modernization plan  
**Target Repo:** Saketkesar/ul0  

---

## 1. Build & Architecture Baseline

### Route Generation Status (Pre-Optimization)
- **Engine:** Next.js 16.3.0 (Webpack fallback on macOS arm64 due to missing native SWC binaries)
- **Status:** **100% of marketing routes dynamically rendered (`ƒ Dynamic`)**
- **Cause:**
  1. `app/layout.tsx` wraps the entire application in `<ClerkProvider dynamic>`
  2. `app/layout.tsx` invokes `const headersList = await headers()` to inspect `x-locale`
- **Impact:**
  - Zero static page pre-generation (`SSG` / `ISR`) for marketing, blog, tools, and pricing pages
  - Suboptimal TTFB (Time to First Byte) and cache misses on Vercel Edge / CDN
  - Unnecessary compute invocation on every anonymous homepage visit

### Total Routes Audited
- 118 total app routes
- 0 static HTML routes (except `robots.txt` and `manifest.webmanifest`)
- All 25 blog posts, 16 tools, and 9 use-case pages dynamically evaluated per request

---

## 2. Technical & Performance Baseline (Pre-Optimization)

| Area | Baseline State | Issue Identified |
|---|---|---|
| **Root Clerk Provider** | Wrapped across root layout with `dynamic` | Forces all static content to server-render dynamically |
| **Fonts** | `Geist` & `Geist_Mono` declared but not bound to `<html>` CSS variables; Google Fonts preconnect tags present | Redundant DNS/preconnect roundtrips, system font fallback fallback mismatch |
| **Analytics & Scripts** | 3 scripts loaded: Vercel Analytics, Simple Analytics, Google AdSense (`ca-pub-8018312015732327`) | Google AdSense adds external blocking JS & conflicts with "zero ads / privacy-first" messaging |
| **Double Brand Titles** | Layout template `%s \| UL0` + individual page titles with `\| UL0` / `— ul0` | Every title in SERP displays duplicate branding (e.g. `Pricing — ul0 \| UL0`) |
| **Image Meta (`og:image`)** | Missing on `/qr`, `/features`; `/blog` declares 512px icon as 1200x630 | Broken social previews, wrong aspect ratio in social cards |
| **Sitemap & `lastmod`** | All static URLs emitted `new Date()` (build timestamp); unindexed locales missing in hreflang | Google ignores static URLs whose `lastmod` is always "now" |
| **Claims & Trust** | Unsupported competitor numbers (e.g., `< 15ms latency`, `$35/mo required`, `+39% CTR`) | Credibility risk and legal exposure |

---

## 3. Plan Truth & Pricing Baseline

- **Current config in `lib/plans.ts`:**
  - Free: 1 custom domain, 1 domain short link, basic click count analytics, link deletion disabled.
  - Pro: $3/mo ($24/yr), 3 custom domains, 100 links/domain, full analytics, link deletion enabled.
  - Business: $9/mo ($72/yr), 10 custom domains, unlimited links/domain, full analytics, targeting, link deletion enabled.
- **Discrepancies identified on live site:**
  - Homepage previously stated "completely free with no restrictions" and "unlimited" while pricing enforced strict domain link limits.
  - Pricing feature cards listed A/B testing and password protection on Free that the comparison table marked as absent.
