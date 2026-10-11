# UL0 Dashboard Redesign — Changes & Route Map

## Overview
Comprehensive redesign of the authenticated UL0 dashboard experience across Free, Pro, and Business tiers. Replaced legacy marketing header/footer wrapping with an app shell, introduced semantic design tokens preserving the teal brand identity (`#168270` light, `#1FA087` dark, `#08100E` background), added server-aggregated analytics cached in Redis, and created full tier-gated experiences.

---

## 1. Route Map & Structure

| Route | Type | Description |
|---|---|---|
| `/dashboard` | Server + Client (`overview-client.tsx`) | Executive overview, greeting row, period filter (today/7d/30d/90d), KPI metrics with deltas, clicks-over-time area chart with accessible table toggle, top links & channels, and new account checklist. |
| `/dashboard/links` | Server + Client (`links-client.tsx`) | Paginated links table with search, domain & status filtering, CSV export, quick QR code dialog, and row actions. |
| `/dashboard/links/[id]` | Server + Client (`link-detail-client.tsx`) | 5-tab detail workspace: Overview, Full Analytics (heatmaps, geo, devices, live stream), Targeting & Rules (passwords, expiry, mobile routing), QR Studio (custom styling & PNG export), and Settings (danger zone). |
| `/dashboard/billing` | Server Component | Active plan status, real usage meters (Domains and Domain short links), single source of truth comparison cards from `lib/plans.ts`, and direct Polar customer portal access. |
| `/dashboard/domains` | Server + Client (`domains-client.tsx`) | Custom domain connection, DNS step-by-step verification, logo branding, and plan limits. |
| `/dashboard/campaigns` | Server + Client (`campaigns-client.tsx`) | UTM campaign builder and grouped link performance reporting (Pro/Business gated). |
| `/dashboard/keys` | Server + Client (`keys-client.tsx`) | Developer API key generation, rate limits, and code integration guides (cURL, JS, Python, Go). |
| `/dashboard/marketing` | Server + Client (`marketing-dashboard-client.tsx`) | Admin-only monetization engine for ad-supported content gates. |
| `/dashboard/seo` | Server + Client (`seo-dashboard-client.tsx`) | Admin-only Google Search Console & indexing health radar. |
| `/api/dashboard/links/[id]/analytics` | API Route (GET) | Server-side click aggregator supporting 24h, 7d, 30d, 90d, and all ranges. Cached in Upstash Redis (60s TTL). |

---

## 2. Components Added & Modified

- **`components/dashboard/dashboard-shell.tsx`**: Responsive application shell with desktop sidebar, mobile navigation drawer, command palette (`cmdk`, `Cmd/Ctrl+K` or `/`), theme toggle (dark/light), shortcuts modal (`?`), Clerk `UserButton`, and persistent usage meter.
- **`components/dashboard/overview-client.tsx`**: Interactive Overview island featuring Recharts area chart, time period selector, sparklines, and dismissable checklist.
- **`components/dashboard/links-client.tsx`**: Links table/card interface with search, status badges, CSV export, and quick QR generator.
- **`components/dashboard/link-detail-client.tsx`**: Unified 5-tab workspace for link analytics, targeting rules, and QR studio.
- **`components/dashboard/plan-gate.tsx`**: Reusable feature gating component displaying sample data previews with compact upgrade cards.
- **`lib/plan-rules.ts` & `lib/plan.server.ts`**: Pure and server-only plan resolution logic evaluating Clerk `has()`, `publicMetadata.plan`, and database records. Supports `DEV_PLAN_OVERRIDE` in development.
- **`lib/analytics/aggregate.ts`**: Click aggregation engine computing period-over-period delta percentages, 7×24 heatmaps, and geographic/device distributions.
- **`scripts/check-contrast.mjs`**: Automated WCAG 2.2 AA contrast verification for light and dark token palettes.

---

## 3. Security & Governance

- Removed hard-coded personal email addresses and developer Clerk user IDs from dashboard pages.
- Established environment allowlists: `MARKETING_ADMIN_CLERK_USER_IDS` and `MARKETING_ADMIN_EMAILS`.
- Preserved Google AdSense meta tag and lazyOnload script in `app/layout.tsx`.
- All routes verified with strict WCAG 2.2 AA contrast standards.
