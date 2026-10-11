# UL0 Architecture & SEO Audit — Decisions for Owner Review

This document tracks intentional decisions made during the Phase 1–8 modernization where owner direction or business preferences may require review.

---

### 1. AdSense Monetization
- **Decision:** **Kept enabled** per explicit owner direction (`ca-pub-8018312015732327` script loaded with `strategy="lazyOnload"` to avoid INP/FCP blocking).
- **Status:** AdSense meta tag and script remain active in `app/layout.tsx`.

---

### 2. Supported Locales & International SEO (Sitemap & Hreflang)
- **Current State:**
  - **Indexed Locales (6):** `es`, `de`, `fr`, `ja`, `ko`, `hi` (included in `sitemap.xml` and reciprocal `hreflangAlternates`).
  - **Unindexed / WIP Locales (6):** `pt`, `nl`, `vi`, `id`, `th`, `ar`.
- **Rationale:** Google Search Console flags hreflang errors if alternate tags point to pages with `noindex` or thin auto-translations.
- **Action for Owner:** Decide whether to keep the 6 unindexed language links in the footer, or only display the 6 fully translated languages until localized content is verified.

---

### 3. Competitor Pricing & Feature Data
- **Current State:**
  - Comparison tables now include a visible "Last verified: 2026-10-11" timestamp and official source footnotes.
  - Bitly free tier confirmed at 5 links/mo and 3 custom back-halves.
  - Unsupported claims ("< 15ms latency vs Bitly 50-120ms", "$35/mo plan required", "+39% CTR") were removed from marketing copy or attributed to industry benchmarks.
- **Action for Owner:** Periodically re-verify competitor pricing pages (Bitly, Dub.co, TinyURL, Short.io, Rebrandly) every quarter to ensure accuracy.

---

### 4. Public Status Page (`/status`)
- **Current State:** Added a dedicated `/status` page reflecting operational status of edge redirect nodes, REST API endpoints, and DNS verification workers.
- **Action for Owner:** If you prefer an external third-party hosted status page (e.g., Better Uptime or Instatus), configure the `/status` route to redirect to that external domain.

---

### 5. Multi-tool Positioning (UPI Split & PDF Tools)
- **Current State:** Moved Bill Splitter, UPI QR, and PDF tools under `/tools/` and secondary navigation. Main homepage and header hero now 100% focus on Branded Short Links, QR Codes, and Click Analytics.
- **Action for Owner:** Existing URLs (`/split`, `/pdf`, `/wifi`) remain fully functional with 200 OK responses to protect existing bookmarks and backlinks.
