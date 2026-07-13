# Requirements Document

## Introduction

This feature converts the existing ul0 product (a Next.js 16 App Router multi-tool app deployed on Vercel, currently using Supabase for auth/data and Upstash Redis for caching) into a SaaS product layered on top of the existing free public tools. The SaaS adds authenticated accounts (Google login via Clerk), subscription billing (Stripe, monthly and annual, priced to be cheapest in market), a custom domain feature where users connect their own domain and create short links served from that domain, and plan-based feature gating. The backend/data layer migrates from Supabase to Appwrite.

The SaaS capabilities are strictly additive: the existing anonymous (no-signup) URL shortener, the ~400+ existing short links, and the other tools (QR, split, PDF scanner, etc.) MUST continue to work during and after the migration. The custom-domain multi-tenant routing, domain verification, and SSL provisioning are the highest-risk areas and are specified in detail.

This document covers requirements only. Technical implementation choices (specific Appwrite collection schemas, Stripe price IDs, exact code structure) are deferred to the design phase, except where a named external system is a fixed constraint from the product owner (Appwrite, Clerk, Stripe, Vercel Domains).

## Glossary

- **Platform**: The overall ul0 SaaS application, including public tools and authenticated SaaS features.
- **Redirect_Service**: The component that resolves a short link slug (optionally scoped to a host) to a destination URL and serves the redirect landing page (`app/r/[slug]` and host-based equivalents).
- **Shorten_Service**: The component that creates short links, both anonymously and for authenticated accounts.
- **Auth_Provider**: Clerk, the external identity provider that authenticates end users (including Google login) and issues a Clerk user identifier (`clerkUserId`).
- **Data_Store**: Appwrite, the backend database that persists links, clicks, accounts, domains, and subscriptions after migration.
- **Cache_Layer**: Upstash Redis, used for slug-to-URL caching and rate limiting.
- **Billing_Provider**: Stripe, the external system that processes subscription payments, hosts checkout, and hosts the customer portal.
- **Subscription_Service**: The component that records and enforces a user's current plan and billing status based on Billing_Provider events.
- **Domain_Service**: The component that manages connection, verification, SSL provisioning, and routing of user-owned custom domains.
- **Hosting_Provider**: Vercel, which serves the application and exposes the Domains API used for custom-domain attachment and SSL.
- **Account**: An authenticated user identity, keyed by `clerkUserId`.
- **Custom_Domain**: A domain name owned by an Account and connected to the Platform for serving that Account's short links.
- **Tenant**: The Account that owns a given Custom_Domain; used to scope link resolution per host.
- **Short_Link**: A record mapping a slug to a destination long URL, optionally owned by an Account and optionally bound to a Custom_Domain.
- **Anonymous_Link**: A Short_Link created without authentication via the free public tool, owned by no Account.
- **Plan**: A named subscription level (Free, or a paid tier) that determines feature limits.
- **Free_Plan**: The default Plan for an Account with no active paid subscription.
- **Paid_Plan**: Any Plan unlocked by an active Stripe subscription.
- **Plan_Limit**: A quantified constraint (for example, maximum number of Short_Links per Custom_Domain) associated with a Plan.
- **Click_Record**: A logged event capturing a single resolution of a Short_Link, used for analytics.
- **Verification_Token**: A DNS record value the user must publish to prove ownership of a Custom_Domain.
- **Safe_Redirect_Validation**: The existing validation that confirms a stored destination URL is allowed before redirecting.

## Requirements

### Requirement 1: Backend Migration to Appwrite

**User Story:** As the product owner, I want the backend migrated from Supabase to Appwrite, so that the Platform runs on the chosen faster backend without losing existing data.

#### Acceptance Criteria

1. THE Data_Store SHALL persist Short_Link records including slug, destination URL, owner identifier, creation timestamp, expiration timestamp, click count, and metadata fields.
2. THE Data_Store SHALL persist Click_Record entries including the associated Short_Link identifier, timestamp, device type, referrer, and user agent.
3. THE Data_Store SHALL persist Account, Custom_Domain, and Subscription records.
4. THE Platform SHALL store and retrieve Short_Link, Click_Record, Account, Custom_Domain, and Subscription data from the Data_Store rather than from Supabase.
5. WHEN the migration is executed, THE Platform SHALL transfer all existing Short_Link records from Supabase into the Data_Store while preserving each slug value unchanged.
6. WHEN the migration is executed, THE Platform SHALL transfer all existing Click_Record data and per-link click counts into the Data_Store.
7. IF any Click_Record or click-count value cannot be transferred, THEN THE Platform SHALL report the click-data migration as failed.
8. WHERE a Short_Link existed before migration, THE Redirect_Service SHALL resolve that Short_Link's slug to the same destination URL after migration.
9. IF a record fails to migrate, THEN THE Platform SHALL record the failed record identifier and the failure reason in a migration report without aborting the remaining record transfers.
10. IF the failed record identifier cannot be recorded, THEN THE Platform SHALL record the failure reason and continue the remaining record transfers.

### Requirement 2: Backward Compatibility of Existing Links and Tools

**User Story:** As an existing visitor, I want all current short links and free tools to keep working, so that the migration and SaaS launch do not break anything I rely on.

#### Acceptance Criteria

1. WHEN a request resolves a slug created before the SaaS launch on the default Platform host, THE Redirect_Service SHALL return the same destination URL that the slug resolved to before launch.
2. THE Shorten_Service SHALL allow link creation without authentication through the existing free public tool.
3. WHEN an Anonymous_Link is created, THE Shorten_Service SHALL store the Short_Link with no owner Account.
4. THE Redirect_Service SHALL continue to serve the redirect landing page with advertising for resolved links.
5. IF Safe_Redirect_Validation fails for a stored destination URL, THEN THE Redirect_Service SHALL return a not-found response.
6. IF a resolved Short_Link cannot be served for a reason other than Safe_Redirect_Validation failure (for example, the slug is unknown or the link is expired), THEN THE Redirect_Service SHALL return a response distinct from the validation not-found response.
7. WHEN a destination URL is flagged as suspicious by Safe_Redirect_Validation, THE Redirect_Service SHALL present a warning interstitial before forwarding the visitor to the destination.
8. THE Platform SHALL keep the non-SaaS tools (URL shortener, QR, split, PDF scanner, and other existing tools) operational across all 13 supported locales after migration.
9. WHILE a redirect is being served, THE Redirect_Service SHALL record a Click_Record and increment the Short_Link click count.

### Requirement 3: Identity and Google Login via Clerk

**User Story:** As a visitor, I want to sign in with Google through Clerk, so that I can access account features for the SaaS.

#### Acceptance Criteria

1. WHEN a visitor initiates sign-in, THE Auth_Provider SHALL offer Google as a login method.
2. WHEN a visitor completes authentication, THE Platform SHALL associate the session with the visitor's `clerkUserId`.
3. WHEN an authenticated user has no Account record in the Data_Store, THE Platform SHALL create an Account keyed by the `clerkUserId`.
4. IF a request to an account-scoped API route has no authenticated Clerk session, THEN THE Platform SHALL reject the request with an unauthorized response before executing any ownership or authorization logic.
5. WHEN an authenticated user accesses a resource owned by an Account, THE Platform SHALL authorize the request only when the request's `clerkUserId` matches the resource's owner identifier.
6. THE Platform SHALL enforce ownership checks using the `clerkUserId` from the verified Clerk session for every account-scoped create, read, update, and delete operation.

### Requirement 4: Subscription Billing via Stripe

**User Story:** As an account holder, I want to subscribe to a paid plan with monthly or annual billing through Stripe, so that I can unlock higher limits.

#### Acceptance Criteria

1. THE Subscription_Service SHALL offer each Paid_Plan with both a monthly billing option and an annual billing option.
2. WHEN an authenticated user selects a Paid_Plan and billing interval, THE Subscription_Service SHALL create a Billing_Provider checkout session and redirect the user to it.
3. WHEN the Billing_Provider sends a subscription event indicating an active paid subscription, THE Subscription_Service SHALL set the corresponding Account's Plan to the purchased Paid_Plan.
4. WHEN the Billing_Provider sends a subscription event indicating cancellation or expiration, THE Subscription_Service SHALL set the corresponding Account's Plan to Free_Plan at the end of the paid period.
5. WHEN the Billing_Provider sends a subscription event indicating a failed payment, THE Subscription_Service SHALL record the Account's billing status as past-due.
6. IF a received Billing_Provider webhook fails signature verification, THEN THE Subscription_Service SHALL reject the webhook with an error response and SHALL NOT change any Account's Plan.
7. WHEN an authenticated subscriber requests subscription management, THE Subscription_Service SHALL redirect the subscriber to the Billing_Provider customer portal.
8. THE Subscription_Service SHALL record the Billing_Provider customer identifier and subscription identifier on the Account.
9. WHERE a webhook event has already been processed, THE Subscription_Service SHALL ignore the duplicate event without changing Account state.

### Requirement 5: Pricing and Plan Presentation

**User Story:** As a prospective customer, I want to see clear, low pricing for monthly and annual billing, so that I can choose the cheapest option that fits my needs.

#### Acceptance Criteria

1. THE Platform SHALL present a pricing page listing the Free_Plan and each Paid_Plan with the monthly price and the annual price.
2. THE Platform SHALL display the Free_Plan with a monthly price of $0 and an annual price of $0.
3. THE Platform SHALL display each Plan's Plan_Limits, including the maximum number of Short_Links per Custom_Domain.
4. WHERE the annual billing option is shown on the pricing page, THE Platform SHALL display the annual option with its effective per-month equivalent price.
5. WHEN a Plan's price is configured in the Billing_Provider, THE Platform SHALL display the price value that matches the Billing_Provider configuration.

### Requirement 6: Connect a Custom Domain

**User Story:** As an account holder, I want to connect my own domain, so that I can create short links served from my domain.

#### Acceptance Criteria

1. WHEN an authenticated user submits a domain name to connect, THE Domain_Service SHALL validate that the submitted value is a syntactically valid domain name.
2. IF the submitted domain name is already connected to any Account, THEN THE Domain_Service SHALL reject the connection with a conflict response.
3. WHEN a Custom_Domain connection completes, THE Domain_Service SHALL store the Custom_Domain record in an unverified state owned by the requesting Account.
4. WHEN a Custom_Domain is connected, THE Domain_Service SHALL generate a Verification_Token and the DNS record instructions required to verify ownership.
5. WHEN a Custom_Domain is connected, THE Domain_Service SHALL register the domain with the Hosting_Provider via the Vercel Domains API.
6. IF Verification_Token generation, DNS instruction creation, or Hosting_Provider registration fails during connection, THEN THE Domain_Service SHALL reject the connection and SHALL NOT persist a Custom_Domain record.
7. THE Domain_Service SHALL associate every Custom_Domain with exactly one owning Account.

### Requirement 7: Verify Custom Domain Ownership and Provision SSL

**User Story:** As an account holder, I want my connected domain verified and secured with HTTPS, so that my short links work safely on my domain.

#### Acceptance Criteria

1. WHEN an authenticated owner requests verification of a Custom_Domain, THE Domain_Service SHALL query the Hosting_Provider for the domain's verification and configuration status.
2. WHEN the Hosting_Provider confirms the required DNS record matches the Verification_Token, THE Domain_Service SHALL set the Custom_Domain state to verified.
3. IF the required DNS record is absent or does not match the Verification_Token, THEN THE Domain_Service SHALL keep the Custom_Domain in an unverified state and SHALL return the unmet DNS requirements.
4. WHEN a Custom_Domain becomes verified, THE Domain_Service SHALL provision an SSL certificate for the domain through the Hosting_Provider.
5. WHILE a Custom_Domain is unverified, THE Redirect_Service SHALL NOT resolve Short_Links for that Custom_Domain.
6. IF the Hosting_Provider reports that a previously verified Custom_Domain's DNS configuration is no longer valid, THEN THE Domain_Service SHALL set the Custom_Domain state to unverified and THE Redirect_Service SHALL stop resolving Short_Links for that Custom_Domain.
7. WHEN an owner removes a Custom_Domain, THE Domain_Service SHALL deregister the domain from the Hosting_Provider and remove the Custom_Domain association from the Account as a single atomic operation.
8. IF either deregistration from the Hosting_Provider or removal of the Account association fails during Custom_Domain removal, THEN THE Domain_Service SHALL roll back the removal so that the Custom_Domain remains fully connected.

### Requirement 8: Host-Based Multi-Tenant Link Resolution

**User Story:** As a visitor following a short link on a connected custom domain, I want it to resolve to the correct destination, so that tenant links work reliably and in isolation.

#### Acceptance Criteria

1. WHEN a redirect request arrives on a verified Custom_Domain host, THE Redirect_Service SHALL resolve the slug only against Short_Links bound to the Tenant that owns that Custom_Domain.
2. IF a slug on a Custom_Domain host has no matching Short_Link for that Tenant, THEN THE Redirect_Service SHALL return a not-found response.
3. WHEN a redirect request arrives on the default Platform host, THE Redirect_Service SHALL resolve the slug against Short_Links on the default host and SHALL NOT return Short_Links bound to a Custom_Domain.
4. WHEN the Cache_Layer is used to resolve a slug, THE Redirect_Service SHALL key the cache entry by the combination of host and slug so that one Tenant's cached entry cannot satisfy a request for a different host.
5. THE Redirect_Service SHALL apply Safe_Redirect_Validation to a Custom_Domain Short_Link destination before redirecting.
6. WHILE serving a redirect on a Custom_Domain, THE Redirect_Service SHALL record a Click_Record attributed to the Tenant's Short_Link.

### Requirement 9: Plan-Based Feature Gating for Custom Domain Links

**User Story:** As a free-tier account holder, I want to create and monitor one short link on my connected domain, so that I can try the product before paying.

#### Acceptance Criteria

1. WHERE an Account is on the Free_Plan, THE Shorten_Service SHALL require that Account to connect a Custom_Domain before creating any Custom_Domain Short_Link, and SHALL allow at most one Short_Link bound to that Custom_Domain.
2. IF an Account on the Free_Plan attempts to create a Short_Link on a Custom_Domain that already has one Short_Link, THEN THE Shorten_Service SHALL reject the request with a limit-reached response that states the applicable Plan_Limit.
3. THE Free_Plan Plan_Limit SHALL restrict only Custom_Domain Short_Links and SHALL NOT restrict Anonymous_Links created through the free public tool.
4. WHERE an Account is on the Free_Plan, THE Platform SHALL allow that Account to view analytics and monitoring for the Account's Custom_Domain Short_Link.
5. WHERE an Account is on the Free_Plan, THE Platform SHALL reject any request by that Account to delete a Custom_Domain Short_Link.
6. WHERE an Account is on a Paid_Plan and has an active Custom_Domain connection, THE Shorten_Service SHALL allow that Account to create Short_Links bound to the Custom_Domain up to that Paid_Plan's Plan_Limit.
7. WHERE an Account is on a Paid_Plan, THE Platform SHALL allow that Account to delete the Account's Custom_Domain Short_Links.
8. WHEN an Account's Plan changes, THE Platform SHALL apply the new Plan's Plan_Limits to subsequent create and delete operations.
9. IF an Account on a Paid_Plan downgrades to the Free_Plan while holding more Short_Links than the Free_Plan allows, THEN THE Platform SHALL retain the existing Short_Links and SHALL reject creation of additional Short_Links while the Short_Link count exceeds the Free_Plan limit.

### Requirement 10: Account Dashboard and Analytics

**User Story:** As an account holder, I want a dashboard showing my domains, links, and their analytics, so that I can monitor performance.

#### Acceptance Criteria

1. WHEN an authenticated user opens the dashboard, THE Platform SHALL display only the Custom_Domains and Short_Links owned by that user's Account.
2. WHEN an authenticated user views a Short_Link the Account owns, THE Platform SHALL display that Short_Link's click count and Click_Record-derived analytics.
3. IF an authenticated user requests analytics for a Short_Link the Account does not own, THEN THE Platform SHALL reject the request with a forbidden response regardless of the Short_Link's visibility setting.
4. THE Platform SHALL display each Custom_Domain's verification state and SSL status on the dashboard.

### Requirement 11: Abuse Prevention and Tenant Isolation

**User Story:** As the product owner, I want abuse prevention and strict tenant isolation, so that free-tier limits cannot be gamed and tenants cannot access each other's data.

#### Acceptance Criteria

1. THE Platform SHALL scope every account-scoped data query by the requesting Account's `clerkUserId` so that responses exclude data owned by other Accounts.
2. WHEN the Shorten_Service creates a Short_Link bound to a Custom_Domain, THE Shorten_Service SHALL verify that the requesting Account owns that Custom_Domain before creating the Short_Link.
3. IF a request attempts to bind a Short_Link to a Custom_Domain the requesting Account does not own, THEN THE Shorten_Service SHALL reject the request with a forbidden response.
4. IF the requesting Account owns the target Custom_Domain but another validation fails, THEN THE Shorten_Service SHALL respond with an error code distinct from the forbidden ownership response.
5. THE Shorten_Service SHALL apply rate limiting to anonymous link creation using the Cache_Layer.
6. THE Shorten_Service SHALL apply Safe_Redirect_Validation to every submitted destination URL before creating a Short_Link.
7. WHEN counting an Account's Custom_Domain Short_Links for Plan_Limit enforcement, THE Shorten_Service SHALL count by the owning Account so that creating links under multiple Custom_Domains does not bypass a single Custom_Domain's limit.
