# UL0 Dashboard Redesign — Owner Input & Security Notes

## 1. Security & Git History Note (Admin Emails & IDs)
Hard-coded admin Clerk User IDs and personal email addresses have been completely removed from application code (`app/dashboard/page.tsx` and related routes) and replaced with environment-driven allowlists:
- `MARKETING_ADMIN_CLERK_USER_IDS`: comma-separated list of Clerk User IDs (e.g., `user_2xxx,user_3yyy`).
- `MARKETING_ADMIN_EMAILS`: comma-separated list of admin email addresses (e.g., `admin@example.com`).

> [!WARNING]
> While current codebase files no longer expose these credentials or personal email addresses, previous commits in the git history still contain the earlier commits with those strings. If you need complete privacy from public repository history, consider rewriting history using tools like `git-filter-repo` or BFG Repo-Cleaner:
> ```bash
> git-filter-repo --replace-text <(echo "target_email==>REDACTED")
> ```
> Be sure to rotate any exposed API keys or tokens accordingly.

## 2. Polar Customer Portal & Billing Integration
- Polar customer portal link is set to `POLAR_PORTAL_URL` in `.env`.
- Ensure Clerk Billing webhook or Polar customer webhook syncs the `plan` attribute on the Appwrite `accounts` collection if webhooks are received outside of Clerk Billing.

## 3. Plan Limits & Features Source of Truth
- `lib/plans.ts` is the single source of truth for:
  - Free: 1 custom domain, 1 domain link with analytics, unlimited ul0.site links (no analytics), no link deletion.
  - Pro ($3/mo): 3 custom domains, 100 domain links, analytics on all links, link deletion.
  - Business ($9/mo): 10 custom domains, unlimited domain links, analytics on all links, link deletion.
- The UI now strictly respects these limits across all pages.
