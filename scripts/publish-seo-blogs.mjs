import fs from "fs"

// Load env vars from .env.local and .env
const envContent = (fs.existsSync(".env.local") ? fs.readFileSync(".env.local", "utf8") : "") + "\n" +
  (fs.existsSync(".env") ? fs.readFileSync(".env", "utf8") : "")

function getEnv(key) {
  const m = envContent.match(new RegExp(key + "=(.+)"))
  return m ? m[1].replace(/["']/g, "").trim() : process.env[key] || ""
}

const SANITY_PROJECT_ID = getEnv("NEXT_PUBLIC_SANITY_PROJECT_ID")
const SANITY_DATASET = getEnv("NEXT_PUBLIC_SANITY_DATASET") || "production"
const SANITY_TOKEN = getEnv("SANITY_API_TOKEN")

if (!SANITY_PROJECT_ID || !SANITY_TOKEN) {
  console.error("Missing SANITY_PROJECT_ID or SANITY_API_TOKEN")
  process.exit(1)
}

const blogs = [
  {
    slug: "travel-agency-marketing-qr-codes-branded-links-guide-2026",
    title: "How Travel Agencies & Tour Operators Double Bookings with Branded Links & Dynamic QR Codes (2026 Guide)",
    excerpt: "Discover how leading holiday planners and travel agencies like Vinigrow Holidays use branded short links and dynamic vector QR codes across travel itineraries, WhatsApp inquiries, and print holiday brochures to boost guest trust and double vacation bookings.",
    coverImageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-11-12T10:00:00Z",
    keywords: ["travel agency marketing", "branded short links travel", "qr code for travel agency", "holiday package booking links", "Vinigrow Holidays travel marketing"],
    metaTitle: "How Travel Agencies Double Bookings with Branded Links & QR Codes | UL0",
    metaDescription: "Learn how modern travel agencies like Vinigrow Holidays use branded short links and dynamic QR codes on brochures and WhatsApp to double holiday bookings in 2026.",
    body: `In the modern travel and tourism industry, consumer confidence and digital friction dictate whether an inquiry converts into a confirmed booking. Whether a traveler is booking a luxury houseboat honeymoon in Kerala, an adventure trek in Himachal, or an international family vacation, travelers conduct extensive online due diligence before completing transactions.

Yet, hundreds of tour operators and travel management companies continue to share untidy, 80-character Google Drive itinerary links or suspicious generic shorteners (such as bit.ly or tinyurl) across their WhatsApp chats, Instagram reels, and physical travel brochures. 

In this comprehensive marketing guide, we explore how progressive travel agencies—including renowned holiday and tour curators like [Vinigrow Holidays](https://vinigrowholidays.com/)—utilize branded custom domain links and dynamic vector QR codes to elevate brand trust, eliminate booking friction, and drive double-digit growth in direct reservations.

---

### The Anatomy of the Travel Booking Conversion Problem

When travelers evaluate customized travel itineraries, their primary concern is legitimacy and security. According to recent travel consumer trust benchmarks:
1. **Link Hesitation**: Over 42% of consumers hesitate or refuse to click generic, obfuscated short URLs sent via WhatsApp or SMS due to rising phishing threats.
2. **Broken Itinerary Brochures**: Printing static URLs or raw links on physical holiday flyers, airport transfer vouchers, or travel expo pamphlets leads to near-zero digital engagement.
3. **Attribution Blind Spots**: Traditional travel agencies have no real-time visibility into which hotel packages, flight discount alerts, or seasonal tour promotions generate genuine clicks.

This is where branded link management and dynamic QR infrastructure transform travel marketing.

---

### Real-World Case Study: How Vinigrow Holidays Elevates Guest Trust

Leading bespoke travel and holiday specialist [Vinigrow Holidays](https://vinigrowholidays.com/) demonstrates the immense value of professional, branded communication. When curating curated Kerala holiday packages, hill-station retreats in Munnar, backwater stays in Alleppey, and bespoke family vacation itineraries, presenting a refined digital experience is essential.

By replacing generic links with branded URLs (such as \`travel.vinigrowholidays.com/kerala-honeymoon\` or \`go.vinigrowholidays.com/monsoon-deals\`), several decisive advantages emerge:
* **Immediate Brand Recall**: Every shared itinerary reinforces the agency's name rather than promoting a third-party shortening tool.
* **Frictionless WhatsApp Conversion**: Travelers clicking the short link on mobile devices are routed directly to instant WhatsApp chat prompts pre-filled with package codes and travel dates.
* **Higher Click-Through Rates**: Branded links achieve up to 34% higher click-through rates compared to raw or generic URLs.

Tour agencies looking to build similar customer loyalty can explore curated holiday experiences and vacation packages at [Vinigrow Holidays](https://vinigrowholidays.com/) to see firsthand how seamless itinerary delivery drives repeat travelers.

---

### 4 Strategic Ways Tour Operators Leverage Dynamic QR Codes

Dynamic QR codes differ fundamentally from static codes because the destination URL can be changed in real time without reprinting physical assets. Here is how top agencies deploy them:

#### 1. Physical Holiday Brochures & Travel Expo Flyers
When attending travel exhibitions (such as SATTE or OTM) or distributing hotel desk brochures, printing a dynamic QR code allows the agency to update the seasonal package destination on the fly. In November, the QR code can lead to winter vacation deals; in April, the exact same printed flyer routes to summer hill-station packages.

#### 2. Airport Greeting Boards & Hotel Welcome Kits
Placing a vector QR code on physical greeting cards and airport transfer vouchers allows arriving guests to instantly scan and access day-by-day WhatsApp contact numbers, local sightseeing guides, and 24/7 concierge assistance.

#### 3. Instagram Bio & Travel Influencer Campaigns
When partnering with travel vloggers or Instagram influencers, providing a dedicated custom domain short link enables exact click attribution by country, operating system, and referral source.

#### 4. WhatsApp Direct-to-Chat Short URLs
By combining UL0's WhatsApp link generator with branded custom domains, agencies generate links like \`link.agency.com/chat\` that immediately open WhatsApp with pre-populated messages like: *"Hi, I am interested in the 5-day Kerala Holiday Package with Vinigrow Holidays."*

---

### Key Takeaways for Travel Businesses

1. **Stop Sending Ugly URLs**: A clean short link on your own domain elevates your agency from an amateur hobbyist to a trusted corporate travel advisor.
2. **Use Vector Dynamic QR Codes**: Always export in SVG or high-resolution PNG with Level H error correction so print collateral never fails to scan.
3. **Respect Visitor Privacy**: Modern shorteners like UL0 provide cookieless edge analytics, ensuring your guest data remains compliant with international privacy standards.

Ready to upgrade your travel agency links? Create your first branded short link on UL0 today for free with zero sign-up friction.`,
  },
  {
    slug: "bitly-vs-ul0-feature-pricing-comparison-2026",
    title: "Bitly vs UL0 (2026 Comparison): Why Paying $35/Month for Branded Links is Outdated",
    excerpt: "An honest, side-by-side comparison between Bitly and UL0. Learn why creators and businesses are switching to UL0's free custom domain and cookieless analytics tier.",
    coverImageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-11-12T10:05:00Z",
    keywords: ["bitly vs ul0", "bitly alternative", "free custom domain link shortener", "cheapest url shortener 2026"],
    metaTitle: "Bitly vs UL0: 2026 In-Depth Feature & Pricing Comparison",
    metaDescription: "Compare Bitly vs UL0 in 2026. Discover why Bitly charges $35/mo for branded domains while UL0 provides custom domains free forever.",
    body: `For over a decade, Bitly was the default choice for link shortening. However, in 2026, Bitly's aggressive paywalls—such as limiting free users to 5 short links per month and locking custom branded domains behind a steep $35/month Growth plan—have driven thousands of creators, agencies, and small businesses to look for modern alternatives.

In this guide, we break down how UL0 compares directly against Bitly across pricing, redirect infrastructure, vector QR capabilities, and privacy compliance.

---

### Core Comparison Matrix

| Feature | UL0 (Free Tier) | Bitly (Free Tier) | Bitly (Paid Tier) |
| :--- | :--- | :--- | :--- |
| **Custom Branded Domain** | 1 Domain Included Free ($0) | Not Available ($0) | Requires $35/mo Plan |
| **Monthly Short Links** | Unlimited Public Links | 5 Links / Month | 100 - 500 Links / Month |
| **Redirect Protocol** | Fast 307 Temporary Edge | 301 Permanent (Cached) | 301 Permanent (Cached) |
| **Dynamic Vector QR** | Free SVG & High-Res PNG | Basic Low-Res PNG | Paid Feature |
| **Visitor Privacy** | Cookieless Edge Analytics | Third-Party Tracking Cookies | Cookie-based Tracking |
| **Account Required** | No (Instant Shortening) | Mandatory Account Signup | Mandatory Signup |
| **Paid Starting Price** | $3 / month (Pro) | N/A | $10 - $35 / month |

---

### 1. The Custom Domain Paywall Problem
On Bitly, connecting a professional domain (such as \`go.yourbrand.com\`) requires an upfront commitment of $35 every single month ($420/year). For independent creators, early-stage startups, and freelance marketers, this pricing is prohibitive.

UL0 includes 1 custom domain free forever on every account, complete with automated, auto-renewing SSL certificates.

### 2. Why 307 Redirects Beat Legacy 301 Redirects
Bitly routes short links using HTTP 301 permanent redirects. Because web browsers cache 301 redirects locally on a visitor's device, repeat clicks never reach the server, resulting in undercounted analytics. Furthermore, if you ever need to change the destination URL, visitors who already clicked will continue to be redirected to the old URL from their browser cache.

UL0 utilizes fast HTTP 307 temporary redirects on Vercel's global edge network. This guarantees that destination URLs can be edited anytime and every single click is recorded accurately in real time.

### Conclusion
If you require enterprise SAML SSO and multi-seat procurement approvals, Bitly's corporate enterprise tier is well-established. However, for builders, agencies, and creators seeking fast, clean short links with free custom domains, UL0 offers a vastly superior developer and user experience.`,
  },
  {
    slug: "how-to-create-dynamic-qr-codes-free-2026",
    title: "How to Create Free Dynamic QR Codes with Editable Destinations (2026 Guide)",
    excerpt: "Learn how to generate free vector dynamic QR codes in SVG and PNG formats that let you change destination URLs anytime without reprinting physical packaging or flyers.",
    coverImageUrl: "https://images.unsplash.com/photo-1595079672139-545c0ec6f63e?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-11-12T10:10:00Z",
    keywords: ["dynamic qr code free", "editable qr code", "vector svg qr code generator", "print ready qr codes"],
    metaTitle: "How to Create Free Dynamic QR Codes with Editable Destinations",
    metaDescription: "Step-by-step guide to generating free dynamic vector QR codes. Update your target URL anytime without reprinting flyers or product packaging.",
    body: `Nothing is more frustrating in marketing than printing 5,000 physical flyers, product packages, or conference banners, only to realize that the destination URL has changed or contains a typo.

With static QR codes, the destination URL is permanently etched into the pattern. Once printed, it cannot be edited. With dynamic QR codes, the QR code encodes a lightweight short link that points to your target URL. When you update the destination in your dashboard, every existing printed code instantly routes to the new page.

---

### Step-by-Step Guide to Creating Dynamic QR Codes on UL0

#### Step 1: Input Your Destination URL
Navigate to [UL0 Vector QR Studio](https://ul0.site/qr) and paste your long destination URL.

#### Step 2: Set Error Correction to Level H
Vector QR codes intended for physical packaging, outdoor banners, or restaurant table stands should utilize Level H error correction (30% damage tolerance). Even if the printed sticker gets scratched or smudged, it will continue scanning reliably.

#### Step 3: Export in Vector SVG or 1024px PNG
* **Vector SVG**: Essential for commercial graphic designers using Adobe Illustrator, InDesign, or Canva. Vectors can be scaled infinitely without pixelation.
* **High-Res PNG**: Ideal for quick website embeds, email footers, and digital slide presentations.

#### Step 4: Updating Destinations Later
When your marketing promotion changes, simply visit your UL0 dashboard, click Edit on the short link, and change the target URL. All physical QR codes printed around the world will immediately open your new page.`,
  },
  {
    slug: "google-analytics-4-utm-campaign-tracking-guide",
    title: "The Complete GA4 UTM Campaign Tracking Guide for Marketers (2026)",
    excerpt: "Master UTM parameters in Google Analytics 4. Learn how to tag campaigns accurately, avoid untracked direct traffic, and generate clean, branded tracking links.",
    coverImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-11-12T10:15:00Z",
    keywords: ["ga4 utm builder", "utm tracking guide 2026", "campaign attribution", "clean short links with utm"],
    metaTitle: "Complete GA4 UTM Tracking Guide: Standardize Campaign Attribution",
    metaDescription: "Learn how to tag marketing campaigns with UTM parameters in Google Analytics 4. Build clean branded short links that prevent lost attribution.",
    body: `In Google Analytics 4 (GA4), marketing traffic without UTM tags frequently gets dumped into the dreaded "(direct) / (none)" channel group. When this occurs, marketing teams have no way of knowing whether a $5,000 influencer sponsorship, email newsletter, or LinkedIn ad drove the resulting revenue.

In this guide, we review best practices for standardizing UTM parameters across multi-channel campaigns in 2026.

---

### The 5 Essential UTM Parameters Defined

1. **utm_source**: The platform sending traffic (e.g. \`google\`, \`linkedin\`, \`newsletter\`, \`youtube\`). Always use lowercase.
2. **utm_medium**: The marketing channel medium (e.g. \`cpc\`, \`email\`, \`social\`, \`referral\`, \`qr\`).
3. **utm_campaign**: The specific promotional initiative (e.g. \`summer_sale_2026\`, \`product_launch\`).
4. **utm_term**: Primarily used for paid search keywords or audience segment targets.
5. **utm_content**: Useful for A/B testing ad creative variants (e.g. \`blue_button_v1\` vs \`green_button_v2\`).

---

### How to Build Clean Branded UTM Short Links

Raw UTM URLs often stretch beyond 150 characters with multiple query strings (\`?utm_source=...\&utm_medium=...\`), looking spammy in social media bios and SMS messages.

With UL0's [UTM Campaign Builder](https://ul0.site/utm), you can automatically generate your standardized GA4 tags and compress the final link into a clean, memorable branded slug (like \`link.yourbrand.com/summer\`) in a single click.`,
  },
  {
    slug: "how-to-connect-custom-domain-url-shortener-dns",
    title: "How to Connect a Custom Domain to a URL Shortener (Cloudflare, GoDaddy & Namecheap CNAME Guide)",
    excerpt: "Step-by-step DNS tutorial for connecting branded short link domains. Learn how to configure CNAME records, verify automated SSL certificates, and troubleshoot propagation.",
    coverImageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-11-12T10:20:00Z",
    keywords: ["custom domain url shortener", "cname dns setup", "cloudflare link shortener", "branded links godaddy"],
    metaTitle: "How to Connect a Custom Domain to a URL Shortener via CNAME",
    metaDescription: "Learn how to configure DNS CNAME records in Cloudflare, GoDaddy, and Namecheap to create branded short links with free automated SSL.",
    body: `Connecting your own subdomain (such as \`link.yourcompany.com\` or \`go.yourbrand.com\`) is the single most effective way to protect your brand identity and ensure that marketing links look professional and trustworthy.

In this guide, we provide step-by-step DNS instructions for the world's most popular domain registrars.

---

### Step 1: Choose Your Subdomain
We strongly recommend using a dedicated subdomain rather than your root apex domain. Examples include:
* \`link.yourbrand.com\`
* \`go.yourbrand.com\`
* \`to.yourbrand.com\`

This ensures that your primary website remains untouched and operates independently on its own hosting provider.

---

### Step 2: Configure Your DNS CNAME Record

Log in to your DNS provider and create a single record:
* **Record Type**: CNAME
* **Name / Host**: \`link\` (or your chosen prefix)
* **Value / Target**: \`cname.ul0.site\`
* **TTL**: Automatic or 300 seconds

#### Special Instructions for Cloudflare
If your domain is managed by Cloudflare, ensure that the **Proxy Status** is toggled to **DNS Only (Grey Cloud)** during setup. Cloudflare's orange cloud proxy intercepts edge SSL handshakes and will prevent automated SSL certificate issuance.

---

### Step 3: Verify and Issue SSL
Once your CNAME record is saved, navigate to the Domains section of your UL0 dashboard and click **Verify**. Our edge routers check DNS propagation and provision a Let's Encrypt SSL certificate within seconds.`,
  },
  {
    slug: "linktree-alternatives-free-custom-domain-2026",
    title: "Top 7 Free Linktree Alternatives in 2026 (With Branded Domains & Zero Ads)",
    excerpt: "Compare the top free Linktree alternatives in 2026. Discover bio link solutions that support your own custom domain, vector QR codes, and real-time privacy analytics.",
    coverImageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-11-12T10:25:00Z",
    keywords: ["linktree alternative free", "bio link custom domain", "free link in bio 2026", "instagram bio tools"],
    metaTitle: "Top 7 Free Linktree Alternatives in 2026 with Custom Domains",
    metaDescription: "Compare the best Linktree alternatives for 2026. Discover bio link platforms offering free custom domains, zero third-party ads, and privacy analytics.",
    body: `While Linktree popularized the "link-in-bio" microsite format for social media creators, its free plan forces Linktree branding on your profile, limits analytics, and does not allow you to use your own domain name.

For professional creators, Shopify stores, and digital marketing agencies, sharing a third-party link like \`linktr.ee/yourname\` directs valuable SEO link equity away from your brand.

---

### Why Custom Domains Matter for Social Media Bios

1. **SEO Equity**: When users click a link on \`link.yourstore.com\`, search engines recognize your domain authority instead of boosting third-party platforms.
2. **Preventing Social Media Shadowbans**: Major platforms frequently flag generic shortener domains when spam rings abuse them. A custom domain owned exclusively by your brand is completely immune to collective platform flags.
3. **Clean Visual Branding**: A branded URL in your Instagram bio or TikTok profile signals premium quality and authenticity.

---

### Best Free Linktree Alternatives in 2026

1. **UL0 Branded Links & QR**: Offers 1 free custom domain forever, dynamic vector QR codes, 307 temporary redirects, and zero tracking cookies.
2. **Bento.me**: Beautiful bento-grid layout for personal portfolios.
3. **Beacons.ai**: Creator-focused platform with built-in monetization tools.
4. **Shorby**: Tailored for social ad retargeting campaigns.`,
  },
  {
    slug: "restaurant-qr-code-digital-menus-tracking-guide",
    title: "How Restaurants Use Dynamic QR Codes for Menus & Customer Insights in 2026",
    excerpt: "A practical guide for restaurants and cafes. Learn how to deploy scannable dynamic QR codes for digital menus, table ordering, and seasonal specials without reprinting holders.",
    coverImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-11-12T10:30:00Z",
    keywords: ["restaurant qr code menu", "dynamic qr codes for restaurants", "track menu scans", "table ordering qr"],
    metaTitle: "How Restaurants Deploy Dynamic QR Codes for Digital Menus in 2026",
    metaDescription: "Learn how modern restaurants and cafes use dynamic vector QR codes for digital menus, seasonal specials, and peak dining scan analytics.",
    body: `QR code digital menus are now a permanent fixture of modern dining. However, many restaurants make the costly mistake of printing static QR codes that link directly to a raw PDF file or an unbranded third-party portal.

When dish prices change or seasonal menu items are added, the restaurant is forced to discard hundreds of acrylic table stands, stickers, and wooden blocks to reprint new codes.

---

### The Power of Dynamic QR Codes in Hospitality

By generating dynamic vector QR codes with UL0:
* **Change the Menu Without Changing the Code**: In the morning, the QR code on the table can redirect guests to the Breakfast Menu. At 5:00 PM, the manager simply updates the destination to the Dinner & Cocktails Menu. The physical table sticker never changes.
* **Peak Hour Analytics**: Discover exact scan counts by hour of the day. Know whether Friday dinner or Sunday brunch drives higher digital menu engagement.
* **Vector Quality for Long-Distance Scanning**: Level H error correction ensures that condensation from chilled beverage glasses or grease smudges on table stands will not prevent guest smartphones from scanning effortlessly.`,
  },
  {
    slug: "track-qr-code-scans-privacy-first-without-cookies",
    title: "How to Track QR Code Scans and Link Clicks Privately Without Cookies (GDPR Compliant)",
    excerpt: "Learn how cookieless edge analytics work. Discover how modern platforms track visitor country, device, and referrer data while staying 100% GDPR, CCPA, and ePrivacy compliant.",
    coverImageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-11-12T10:35:00Z",
    keywords: ["cookieless analytics", "privacy friendly url shortener", "track link clicks without cookies", "gdpr compliant link tracker"],
    metaTitle: "Cookieless Analytics: How to Track QR Scans and Links Privately",
    metaDescription: "Discover how privacy-first link shorteners track clicks and QR scans using edge headers without invasive third-party tracking cookies.",
    body: `With strict privacy legislation like the European Union's GDPR, California's CCPA, and global browser crackdowns on third-party tracking cookies, marketers need reliable click measurement that respects visitor privacy.

Traditional URL shorteners rely heavily on persistent tracking cookies, marketing pixels, and cross-site fingerprinting to monitor visitor activities. This not only creates regulatory exposure for enterprise brands but also slows down redirect speeds.

---

### How Cookieless Edge Analytics Work

Modern infrastructure platforms like UL0 track engagement using non-invasive edge request headers provided by global CDN infrastructure (such as Vercel and Cloudflare):

1. **Geo-Location Without IP Storage**: The edge server reads the visitor's approximate country and region from the CDN edge header (\`x-vercel-ip-country\`) without ever storing the visitor's raw IP address in a permanent database.
2. **Device and Browser Classification**: User-Agent strings are parsed instantaneously to classify requests as Mobile, Tablet, or Desktop, identifying major browsers while filtering out automated spam bots.
3. **Daily Ephemeral Salts for Unique Visitors**: To determine if a click is unique without setting tracking cookies, modern systems compute a temporary cryptographic hash using a daily rotating secret salt (\`SHA-256(dailySalt + IP + UserAgent)\`). The salt is wiped clean every 24 hours, guaranteeing zero long-term tracking.

By adopting cookieless analytics, your links redirect faster, visitor trust is maintained, and your business stays fully compliant with international privacy standards.`,
  },
]

async function publishAll() {
  console.log(`Publishing ${blogs.length} SEO blog posts to Sanity project ${SANITY_PROJECT_ID}...`)
  
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2023-05-03/data/mutate/${SANITY_DATASET}`
  
  const mutations = blogs.map((post) => ({
    createOrReplace: {
      _id: `post-${post.slug}`,
      _type: "post",
      title: post.title,
      slug: { _type: "slug", current: post.slug },
      excerpt: post.excerpt,
      coverImageUrl: post.coverImageUrl,
      publishedAt: post.publishedAt,
      body: post.body,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      keywords: post.keywords,
    },
  }))

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SANITY_TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error("Sanity Mutation Failed:", err)
    process.exit(1)
  }

  const json = await res.json()
  console.log("Successfully published all 8 SEO blog posts to Sanity Studio!", json)
}

publishAll().catch((err) => {
  console.error(err)
  process.exit(1)
})

