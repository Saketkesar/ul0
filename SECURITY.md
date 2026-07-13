# Security Policy

We take the security of **ul0.site** seriously. If you believe you have found a security vulnerability, please report it responsibly by following the guidelines below.

## Reporting a Vulnerability

Please do **NOT** report security vulnerabilities via public GitHub issues. Instead, report them directly to our security response team:

*   **Email**: [getul0site@gmail.com](mailto:getul0site@gmail.com)

We aim to acknowledge receipt of your report within **10 hours** and provide a detailed response with a resolution plan as quickly as possible.

Please include the following details in your report:
*   A description of the vulnerability and its potential impact.
*   Step-by-step instructions (or a proof-of-concept script) to reproduce the issue.
*   Any details about the environment, browser, or tools used.

## Supported Versions

Only the current main deployment version is actively supported with security patches:

| Version | Supported | Notes |
| :--- | :--- | :--- |
| `0.1.x` | ✅ Yes | Current Active SaaS Release |
| `< 0.1.0` | ❌ No | Legacy Supabase Beta (Deprecating) |

## Standard Security Controls

The `ul0` platform implements the following built-in security layers:

1.  **Phishing & Spam Verification**: Every shortened URL is programmatically validated against safety lists and verified for spam, phishing, or malware redirects before storage.
2.  **Strict Multi-Tenant Isolation**: Database queries are scoped securely using the authenticated `clerkUserId` from verified Clerk sessions. Cross-tenant access is strictly blocked at the backend schema layer.
3.  **Dynamic Rate Limiting**: Caching and rate limiting are enforced via **Upstash Redis** on public shortening endpoints to mitigate brute force attacks and denial-of-service (DoS) attempts.
4.  **No Hardcoded Secrets**: All backend APIs (Vercel, Appwrite, Clerk, and Stripe) resolve configurations strictly through environment variables. Git exclude checks prevent local configurations from being committed.
5.  **HTTPS Enforcement**: Connected custom domains must complete DNS verification checks before SSL certificates are auto-provisioned. Resolvers reject any unverified custom domains.
