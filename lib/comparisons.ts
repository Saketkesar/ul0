export interface CompetitorData {
  slug: string
  name: string
  tagline: string
  freePlan: string
  paidStartPrice: string
  customDomainOnFree: boolean
  signupRequiredForBasic: boolean
  privacyAnalytics: string
  verifiedDate: string
  sourceUrl: string
  whoItsFor: string
  bestFor: string
  whenCompetitorBetter: string[]
  whenUl0Better: string[]
  featuresTable: {
    feature: string
    ul0: string
    competitor: string
  }[]
  migrationSteps: string[]
  faqs: {
    q: string
    a: string
  }[]
}

export const COMPETITORS: Record<string, CompetitorData> = {
  bitly: {
    slug: "bitly",
    name: "Bitly",
    tagline: "The traditional corporate link management standard",
    freePlan: "5 short links / month, 3 custom back-halves",
    paidStartPrice: "$10–$35 / month",
    customDomainOnFree: false,
    signupRequiredForBasic: true,
    privacyAnalytics: "Cookie-based tracking",
    verifiedDate: "2026-10-11",
    sourceUrl: "https://bitly.com/pages/pricing",
    whoItsFor: "Enterprise marketing teams requiring SSO, vendor procurement reviews, and legacy CRM integrations.",
    bestFor: "Corporate enterprises with strict IT procurement requirements",
    whenCompetitorBetter: [
      "You require SAML SSO authentication across thousands of corporate seats.",
      "Your IT team requires pre-existing SOC 2 Type II or HIPAA enterprise agreements.",
      "You have existing enterprise integrations tied to Bitly's legacy webhooks.",
    ],
    whenUl0Better: [
      "You want to shorten links instantly with zero signup or email verification.",
      "You want branded short links on your own domain without paying $35/month.",
      "You value cookieless, GDPR-compliant privacy analytics that do not track personal visitor data.",
      "You want an open-source, affordable platform starting at $0 for 1 domain and $3/mo for Pro.",
    ],
    featuresTable: [
      { feature: "Free Short Links", ul0: "Unlimited (no signup)", competitor: "5 per month" },
      { feature: "Branded Custom Domain (Free)", ul0: "1 domain included free", competitor: "Not available on free" },
      { feature: "Custom Slugs", ul0: "Included free", competitor: "3 per month on free" },
      { feature: "Dynamic Vector QR Codes", ul0: "Free SVG & PNG with logo", competitor: "Limited or add-on" },
      { feature: "Click Analytics", ul0: "Cookieless (Device, Country, Referrer)", competitor: "Standard (Cookie-based)" },
      { feature: "Starting Paid Price", ul0: "$3 / mo (Pro)", competitor: "$10–$35 / mo" },
    ],
    migrationSteps: [
      "Export your existing links from Bitly via Settings → CSV Export.",
      "Connect your custom domain (e.g. go.yourbrand.com) in UL0 dashboard using a standard CNAME record.",
      "Recreate active campaigns in UL0 with custom slugs and UTM parameters.",
      "Update your campaign URLs in ads and social bios.",
    ],
    faqs: [
      {
        q: "How does UL0 compare to Bitly's free plan?",
        a: "Bitly restricts free accounts to 5 links per month and does not allow custom domains. UL0 provides unlimited public short links without signup and includes 1 custom domain free on every account.",
      },
      {
        q: "Can I transfer my existing Bitly branded links to UL0?",
        a: "Yes. Once you point your domain's CNAME record to cname.ul0.site, you can recreate identical slugs in your UL0 dashboard so existing links never break.",
      },
    ],
  },
  tinyurl: {
    slug: "tinyurl",
    name: "TinyURL",
    tagline: "The original 2002 URL shortener",
    freePlan: "Basic short links with redirect ads",
    paidStartPrice: "$9.99–$12.99 / month",
    customDomainOnFree: false,
    signupRequiredForBasic: false,
    privacyAnalytics: "Basic click counts",
    verifiedDate: "2026-10-11",
    sourceUrl: "https://tinyurl.com/app/pricing",
    whoItsFor: "Quick one-off links when brand appearance and advanced click metrics are not required.",
    bestFor: "Basic personal links without custom branding",
    whenCompetitorBetter: [
      "You have legacy bookmarks from the 2000s that you still manage.",
      "You only need a simple, disposable link and don't care about analytics or domain branding.",
    ],
    whenUl0Better: [
      "You want zero interstitial or banner ads on your redirect page.",
      "You want your own domain name (e.g. link.yourcompany.com) instead of tinyurl.com.",
      "You want high-res vector QR codes that link directly to your destination.",
      "You want real-time country, device, and browser analytics.",
    ],
    featuresTable: [
      { feature: "Branded Custom Domains", ul0: "1 included free", competitor: "Paid plans only ($9.99+/mo)" },
      { feature: "User Experience", ul0: "Clean, ad-free redirection", competitor: "Ad-supported redirect experience" },
      { feature: "Dynamic QR Codes", ul0: "Vector SVG & high-res PNG", competitor: "Basic PNG only" },
      { feature: "Analytics Quality", ul0: "Real-time geo & referrer tracking", competitor: "Basic click counter" },
      { feature: "API Access", ul0: "Free REST API with rate limits", competitor: "Paid tier required" },
    ],
    migrationSteps: [
      "Identify the destination URLs currently using TinyURL.",
      "Paste each URL into UL0 to generate clean, permanent short links.",
      "Download dynamic QR codes for print or packaging.",
    ],
    faqs: [
      {
        q: "Does UL0 display ads on shortened links like TinyURL?",
        a: "No. UL0 links redirect visitors directly to the target destination without interstitial wait screens or third-party ad networks on branded links.",
      },
    ],
  },
  rebrandly: {
    slug: "rebrandly",
    name: "Rebrandly",
    tagline: "Branded link management for marketing departments",
    freePlan: "25 links / month, 250 clicks tracked / month",
    paidStartPrice: "$13 / month",
    customDomainOnFree: true,
    signupRequiredForBasic: true,
    privacyAnalytics: "Cookie & pixel tracking",
    verifiedDate: "2026-10-11",
    sourceUrl: "https://rebrandly.com/pricing",
    whoItsFor: "Mid-market marketing teams managing complex multi-brand campaigns.",
    bestFor: "Enterprise marketing agencies managing dozens of client sub-accounts",
    whenCompetitorBetter: [
      "You need complex retargeting pixel injection (e.g. Meta Pixel, Google Ads tags) embedded on redirect pages.",
      "You require multi-workspace billing for distinct agency client accounts.",
    ],
    whenUl0Better: [
      "You do not want your links to stop tracking when you exceed 250 clicks in a month.",
      "You want a modern, fast UI without enterprise sales calls.",
      "You want affordable pricing: $3/mo Pro vs $13/mo Rebrandly.",
    ],
    featuresTable: [
      { feature: "Free Click Tracking Limit", ul0: "Unlimited clicks", competitor: "250 clicks / month cap" },
      { feature: "Free Domain Allowance", ul0: "1 custom domain", competitor: "1 custom domain" },
      { feature: "Paid Starting Tier", ul0: "$3 / month", competitor: "$13 / month" },
      { feature: "Anonymous Shortener", ul0: "Available without account", competitor: "Signup required" },
      { feature: "Open Source", ul0: "AGPL-3.0 public repository", competitor: "Proprietary SaaS" },
    ],
    migrationSteps: [
      "Export your branded links from Rebrandly via the Links menu.",
      "Update your DNS CNAME record to point to cname.ul0.site.",
      "Re-import or configure your primary marketing slugs in UL0.",
    ],
    faqs: [
      {
        q: "Does UL0 shut down links when traffic spikes?",
        a: "No. UL0 does not cut off your links or lock your analytics when you go viral. Paid plans start at just $3/mo for extended domain allowances.",
      },
    ],
  },
  "short-io": {
    slug: "short-io",
    name: "Short.io",
    tagline: "Developer-friendly custom domain shortener",
    freePlan: "1,000 links total, 5 custom domains",
    paidStartPrice: "$17 / month",
    customDomainOnFree: true,
    signupRequiredForBasic: true,
    privacyAnalytics: "Basic analytics",
    verifiedDate: "2026-10-11",
    sourceUrl: "https://short.io/pricing",
    whoItsFor: "Developers and product managers managing multiple branded domains.",
    bestFor: "Multi-domain management on a single dashboard",
    whenCompetitorBetter: [
      "You manage 4–5 different domains and want all of them connected on a free plan.",
      "You require built-in team permissions and member role assignment.",
    ],
    whenUl0Better: [
      "You want to shorten quick links without creating an account.",
      "You want lower paid pricing: $3 Pro and $9 Business vs $17 and $48 on Short.io.",
      "You want privacy-first analytics with Simple Analytics integration.",
    ],
    featuresTable: [
      { feature: "No-Signup Tool", ul0: "Yes, instant homepage shortener", competitor: "No, signup mandatory" },
      { feature: "Free Custom Domains", ul0: "1 included free", competitor: "Up to 5 domains" },
      { feature: "Pro Plan Price", ul0: "$3 / month", competitor: "$17 / month" },
      { feature: "Business Plan Price", ul0: "$9 / month", competitor: "$48 / month" },
      { feature: "Vector QR Engine", ul0: "SVG + PNG with logo", competitor: "Standard QR" },
    ],
    migrationSteps: [
      "Point your DNS CNAME record to cname.ul0.site.",
      "Verify the domain in the UL0 dashboard.",
      "Recreate your active links and configure custom destination fallbacks.",
    ],
    faqs: [
      {
        q: "How does UL0 pricing compare to Short.io?",
        a: "UL0 Pro is $3/mo ($24/year) compared to Short.io's $17/mo ($168/year), saving over 80% on link management costs.",
      },
    ],
  },
  dub: {
    slug: "dub",
    name: "Dub.co",
    tagline: "Open-source link infrastructure for modern companies",
    freePlan: "25 links / month, 1,000 clicks tracked",
    paidStartPrice: "$19–$24 / month",
    customDomainOnFree: true,
    signupRequiredForBasic: true,
    privacyAnalytics: "Privacy-friendly analytics",
    verifiedDate: "2026-10-11",
    sourceUrl: "https://dub.co/pricing",
    whoItsFor: "VC-backed tech startups and engineering teams wanting modern open-source link infra.",
    bestFor: "TypeScript-native teams wanting official SDK packages",
    whenCompetitorBetter: [
      "You need extensive SDK libraries (Dub TypeScript SDK) and direct npm packages.",
      "You are a venture-funded company with a $300+/year link infrastructure budget.",
    ],
    whenUl0Better: [
      "You don't want a 25 links/month or 1,000 clicks/month ceiling on your free account.",
      "You want affordable pro pricing: $3/mo vs $24/mo.",
      "You want an immediate public shortener without mandatory OAuth sign-in.",
    ],
    featuresTable: [
      { feature: "Free Monthly Link Limit", ul0: "Unlimited public short links", competitor: "25 links / month" },
      { feature: "Free Click Quota", ul0: "Unlimited clicks", competitor: "1,000 clicks / month" },
      { feature: "Pro Plan Price", ul0: "$3 / month", competitor: "$24 / month" },
      { feature: "Business Plan Price", ul0: "$9 / month", competitor: "$99 / month" },
      { feature: "Public No-Signup Shortener", ul0: "Instant on homepage", competitor: "Not available" },
    ],
    migrationSteps: [
      "Export your links from Dub via Workspace Settings.",
      "Add your custom domain CNAME in UL0.",
      "Import your slugs to UL0 for seamless edge redirection.",
    ],
    faqs: [
      {
        q: "Why choose UL0 over Dub.co?",
        a: "Dub.co is a great developer tool but caps free accounts at 25 links/mo and charges $24/mo for Pro. UL0 offers generous free link creation and a $3/mo Pro tier.",
      },
    ],
  },
  "t-ly": {
    slug: "t-ly",
    name: "T.ly",
    tagline: "Simple URL shortener with popular browser extension",
    freePlan: "Basic short links, 0 custom domains",
    paidStartPrice: "$8–$10 / month",
    customDomainOnFree: false,
    signupRequiredForBasic: false,
    privacyAnalytics: "Standard tracking",
    verifiedDate: "2026-10-11",
    sourceUrl: "https://t.ly/pricing",
    whoItsFor: "Everyday web users looking for one-click shortening from their browser toolbar.",
    bestFor: "Users primarily shortening links via Chrome/Firefox extensions",
    whenCompetitorBetter: [
      "You rely exclusively on a browser extension for your workflow.",
    ],
    whenUl0Better: [
      "You want 1 custom domain included free without paying $10/month.",
      "You want transparent, cookieless privacy analytics.",
      "You want $3/mo Pro pricing with multiple domain support.",
    ],
    featuresTable: [
      { feature: "Custom Domain on Free", ul0: "1 domain included free", competitor: "Paid plans only" },
      { feature: "Paid Starting Price", ul0: "$3 / month", competitor: "$10 / month" },
      { feature: "QR Code Capabilities", ul0: "Dynamic vector SVG + PNG", competitor: "Standard QR" },
      { feature: "Developer REST API", ul0: "Included free", competitor: "Requires API token tier" },
    ],
    migrationSteps: [
      "Connect your custom domain to UL0.",
      "Create your branded links using UL0's web dashboard or API.",
    ],
    faqs: [
      {
        q: "Does T.ly support free custom domains?",
        a: "No. T.ly requires a paid subscription starting at $10/mo for custom domain support. UL0 includes 1 custom domain free.",
      },
    ],
  },
  cuttly: {
    slug: "cuttly",
    name: "Cutt.ly",
    tagline: "Link management platform with link-in-bio features",
    freePlan: "30 links / month, 0 custom domains",
    paidStartPrice: "$12–$15 / month",
    customDomainOnFree: false,
    signupRequiredForBasic: true,
    privacyAnalytics: "Basic stats",
    verifiedDate: "2026-10-11",
    sourceUrl: "https://cutt.ly/pricing",
    whoItsFor: "Marketers wanting simple link-in-bio aggregators alongside short links.",
    bestFor: "Bundled link-in-bio pages and basic shortening",
    whenCompetitorBetter: [
      "You need built-in link-in-bio microsite templates bundled into the same subscription.",
    ],
    whenUl0Better: [
      "You want free custom domain support without upgrading to a $12/month plan.",
      "You want instant no-signup link shortening.",
      "You want high-speed global edge 301 redirects without ads or tracking scripts.",
    ],
    featuresTable: [
      { feature: "Free Domain Support", ul0: "1 custom domain free", competitor: "Not included on free" },
      { feature: "Monthly Free Links", ul0: "Unlimited public short links", competitor: "30 links / month" },
      { feature: "Pro Plan Price", ul0: "$3 / month", competitor: "$12 / month" },
      { feature: "No-Signup Shortening", ul0: "Instant on homepage", competitor: "Requires registration" },
    ],
    migrationSteps: [
      "Copy your active Cutt.ly link destinations.",
      "Generate clean branded short URLs on your own domain with UL0.",
    ],
    faqs: [
      {
        q: "Can I connect a custom domain on Cutt.ly for free?",
        a: "No. Cutt.ly restricts custom domains to paid tiers starting at $12/month. UL0 offers 1 custom domain free.",
      },
    ],
  },
}
