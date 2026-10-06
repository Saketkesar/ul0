import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Server,
  Globe,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Copy,
  Terminal,
  HelpCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Custom Domain DNS & CNAME Setup Guide for Short Links | UL0",
  description:
    "Complete step-by-step technical guide to configuring CNAME DNS records, Let's Encrypt SSL certificates, and Cloudflare/GoDaddy/Route53 settings for branded short links.",
  alternates: {
    canonical: "https://ul0.site/blog/custom-domain-dns-cname-setup-guide",
  },
  openGraph: {
    title: "Custom Domain DNS & CNAME Setup Guide for Short Links | UL0",
    description:
      "Configure CNAME records, SSL/TLS automation, and registrar settings across Cloudflare, GoDaddy, Namecheap, and AWS Route 53 for custom short links.",
    url: "https://ul0.site/blog/custom-domain-dns-cname-setup-guide",
    type: "article",
    publishedTime: "2026-08-10",
    modifiedTime: "2026-10-06",
  },
}

export default function CustomDomainDnsSetupGuidePage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Custom Domain DNS & CNAME Setup Guide for Branded Short Links",
    description:
      "Complete step-by-step technical guide to configuring CNAME DNS records, Let's Encrypt SSL certificates, and registrar settings for branded short links.",
    image: "https://ul0.site/social-card.png",
    author: {
      "@type": "Person",
      name: "Saket Kesar",
      jobTitle: "Founder & Developer",
      url: "https://ul0.site/about",
      sameAs: "https://github.com/Saketkesar",
    },
    publisher: {
      "@type": "Organization",
      name: "UL0",
      logo: {
        "@type": "ImageObject",
        url: "https://ul0.site/ul0.png",
      },
    },
    datePublished: "2026-08-10",
    dateModified: "2026-10-06",
    mainEntityOfPage: "https://ul0.site/blog/custom-domain-dns-cname-setup-guide",
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://ul0.site",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://ul0.site/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Custom Domain DNS Setup Guide",
        item: "https://ul0.site/blog/custom-domain-dns-cname-setup-guide",
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog Guides
          </Link>

          <header className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">Infrastructure &amp; DNS</Badge>
              <Badge variant="outline">Updated October 2026</Badge>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl mb-6 leading-tight">
              The Complete Custom Domain DNS &amp; CNAME Setup Guide for Branded Short Links
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y py-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <Link href="/about" className="hover:underline text-foreground font-medium">
                  Saket Kesar
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Updated Oct 6, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>9 min read (1,600+ words)</span>
              </div>
            </div>
          </header>

          <article className="prose prose-slate dark:prose-invert max-w-none space-y-8 leading-relaxed">
            {/* Quick Context Callout */}
            <div className="not-prose rounded-2xl border border-primary/20 bg-primary/5 p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-primary">
                <Globe className="h-4 w-4" />
                <span>Why Branded Custom Domains Matter in 2026</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Generic shorteners (<code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">bit.ly</code>, <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">tinyurl.com</code>) are shared by millions of users, including spammers and phishers. Consequently, mobile carriers enforce aggressive 10DLC SMS spam blocks against shared links, and enterprise spam firewalls flag them. By connecting a dedicated subdomain (like <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs font-semibold text-foreground">go.yourbrand.com</code>) through <Link href="/custom-domain-landing" className="text-primary hover:underline font-semibold">UL0&apos;s free custom domain engine</Link>, you own your sender reputation and boost click confidence.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-bold text-foreground">1. DNS Architecture: Understanding CNAME Records</h2>
              <p className="text-muted-foreground">
                A <strong>Canonical Name (CNAME)</strong> record is an alias record in the Domain Name System (DNS) defined in RFC 1034. When a browser resolves your shortened domain alias (e.g., <code className="bg-muted px-1 rounded font-mono text-sm">go.yourbrand.com</code>), the DNS server consults the CNAME record and redirects the resolver query to the authoritative hostname of the service provider (<code className="bg-muted px-1 rounded font-mono text-sm">cname.ul0.site</code>).
              </p>
              <p className="text-muted-foreground mt-3">
                This decoupled architecture provides two massive infrastructure benefits:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-muted-foreground mt-2">
                <li>
                  <strong className="text-foreground">Zero Maintenance:</strong> You never need to hardcode server IP addresses. If our edge proxy routing IPs change or scale, your domain automatically follows our global routing network.
                </li>
                <li>
                  <strong className="text-foreground">Edge Routing:</strong> DNS resolvers route requests to the nearest Point of Presence (POP) across global edge data centers, ensuring your HTTP 301 redirects execute in under 15 milliseconds.
                </li>
              </ul>
            </section>

            {/* Standard DNS Values Box */}
            <section>
              <h2 className="text-2xl font-bold text-foreground">2. Standard DNS Values for UL0</h2>
              <p className="text-muted-foreground">
                Before opening your domain registrar, note the exact values required to configure your branded shortener:
              </p>
              <div className="not-prose mt-4 overflow-x-auto rounded-xl border bg-card p-5 font-mono text-xs shadow-xs space-y-3">
                <div className="grid grid-cols-3 gap-2 border-b pb-2 font-bold text-muted-foreground text-[11px]">
                  <span>RECORD FIELD</span>
                  <span>RECOMMENDED VALUE</span>
                  <span>NOTES</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 items-center">
                  <span className="font-semibold text-primary">Record Type</span>
                  <span className="font-bold text-foreground">CNAME</span>
                  <span className="text-muted-foreground">Alias record for subdomains</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 items-center border-t">
                  <span className="font-semibold text-primary">Host / Name</span>
                  <span className="font-bold text-foreground">go (or link, to, click)</span>
                  <span className="text-muted-foreground">Your preferred subdomain prefix</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 items-center border-t">
                  <span className="font-semibold text-primary">Target / Value</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">cname.ul0.site</span>
                  <span className="text-muted-foreground">Authoritative UL0 edge endpoint</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 items-center border-t">
                  <span className="font-semibold text-primary">TTL</span>
                  <span className="font-bold text-foreground">300 seconds (or Auto)</span>
                  <span className="text-muted-foreground">Lower TTL enables faster initial verification</span>
                </div>
              </div>
            </section>

            {/* Registrar Walkthroughs */}
            <section>
              <h2 className="text-2xl font-bold text-foreground">3. Step-by-Step Registrar Guides</h2>
              <p className="text-muted-foreground">
                Below are explicit instructions for the most popular domain registrars and DNS hosting providers.
              </p>

              {/* Cloudflare */}
              <div className="mt-6 rounded-2xl border bg-card p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-foreground">A. Cloudflare DNS (Critical Settings)</h3>
                  <Badge variant="outline">Most Popular</Badge>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Log in to your <strong>Cloudflare Dashboard</strong> and select your domain zone.</li>
                  <li>In the sidebar, navigate to <strong>DNS &gt; Records</strong>.</li>
                  <li>Click the blue <strong>Add record</strong> button.</li>
                  <li>Select <strong>Type: CNAME</strong>.</li>
                  <li>Set <strong>Name:</strong> <code className="bg-muted px-1.5 py-0.5 rounded font-mono font-bold">go</code> (or your chosen subdomain).</li>
                  <li>Set <strong>Target:</strong> <code className="bg-muted px-1.5 py-0.5 rounded font-mono font-bold">cname.ul0.site</code>.</li>
                  <li>
                    <strong className="text-rose-600 dark:text-rose-400">CRITICAL STEP — Proxy Status:</strong> Set the toggle to <strong>DNS Only (Gray Cloud)</strong>.
                  </li>
                  <li>Click <strong>Save</strong>.</li>
                </ol>
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <strong>Why Gray Cloud (DNS Only) Matters:</strong>
                  <p>
                    If you leave the Cloudflare Orange Cloud (Proxied) enabled during initial domain verification, Cloudflare intercepts the automated Let&apos;s Encrypt HTTP-01 challenge handshake. Setting it to Gray Cloud allows our edge proxy to provision your SSL certificate directly. Once your certificate is active, you can re-enable the Orange Cloud if desired.
                  </p>
                </div>
              </div>

              {/* Namecheap */}
              <div className="mt-6 rounded-2xl border bg-card p-6 shadow-xs space-y-4">
                <h3 className="text-xl font-bold text-foreground">B. Namecheap</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Log in to your <strong>Namecheap Account</strong> and go to your <strong>Domain List</strong>.</li>
                  <li>Click <strong>Manage</strong> next to your domain name.</li>
                  <li>Click the <strong>Advanced DNS</strong> tab at the top.</li>
                  <li>Under the <strong>Host Records</strong> section, click <strong>Add New Record</strong>.</li>
                  <li>Select <strong>CNAME Record</strong> from the dropdown menu.</li>
                  <li>Enter <strong>Host:</strong> <code className="bg-muted px-1.5 py-0.5 rounded font-mono font-bold">go</code>.</li>
                  <li>Enter <strong>Target:</strong> <code className="bg-muted px-1.5 py-0.5 rounded font-mono font-bold">cname.ul0.site</code>.</li>
                  <li>Set <strong>TTL:</strong> <strong>Automatic</strong> or <strong>1 min</strong>.</li>
                  <li>Click the green checkmark icon to save the record.</li>
                </ol>
              </div>

              {/* GoDaddy */}
              <div className="mt-6 rounded-2xl border bg-card p-6 shadow-xs space-y-4">
                <h3 className="text-xl font-bold text-foreground">C. GoDaddy</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Log in to your <strong>GoDaddy Domain Portfolio</strong>.</li>
                  <li>Select your domain and navigate to the <strong>DNS</strong> management screen.</li>
                  <li>Click <strong>Add New Record</strong>.</li>
                  <li>Choose <strong>Type: CNAME</strong>.</li>
                  <li>Enter <strong>Name:</strong> <code className="bg-muted px-1.5 py-0.5 rounded font-mono font-bold">go</code>.</li>
                  <li>Enter <strong>Value:</strong> <code className="bg-muted px-1.5 py-0.5 rounded font-mono font-bold">cname.ul0.site</code>.</li>
                  <li>Set <strong>TTL:</strong> <strong>1/2 Hour (1800 seconds)</strong>.</li>
                  <li>Click <strong>Save</strong>.</li>
                </ol>
              </div>

              {/* AWS Route 53 */}
              <div className="mt-6 rounded-2xl border bg-card p-6 shadow-xs space-y-4">
                <h3 className="text-xl font-bold text-foreground">D. Amazon Web Services (AWS Route 53)</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Open the <strong>AWS Route 53 Console</strong> and select <strong>Hosted zones</strong>.</li>
                  <li>Click your domain&apos;s hosted zone.</li>
                  <li>Click <strong>Create record</strong>.</li>
                  <li>In <strong>Record name</strong>, type your subdomain prefix (e.g. <code className="bg-muted px-1.5 py-0.5 rounded font-mono font-bold">go</code>).</li>
                  <li>In <strong>Record type</strong>, choose <strong>CNAME</strong>.</li>
                  <li>In <strong>Value</strong>, paste <code className="bg-muted px-1.5 py-0.5 rounded font-mono font-bold">cname.ul0.site</code>.</li>
                  <li>Set <strong>TTL (seconds):</strong> <code className="bg-muted px-1.5 py-0.5 rounded font-mono font-bold">300</code>.</li>
                  <li>Click <strong>Create records</strong>.</li>
                </ol>
              </div>
            </section>

            {/* Troubleshooting Matrix */}
            <section>
              <h2 className="text-2xl font-bold text-foreground">4. Deep DNS Troubleshooting Matrix</h2>
              <p className="text-muted-foreground">
                Encountering an issue? Here are the 5 most common DNS pitfalls and their exact resolutions:
              </p>

              <div className="not-prose mt-6 space-y-4">
                {/* Issue 1 */}
                <div className="rounded-xl border p-5 bg-card space-y-2">
                  <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>Issue 1: SSL Certificate Pending / Cipher Mismatch Error</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong>Cause:</strong> Your DNS was recently updated, but the SSL handshake certificate has not yet been issued by Let&apos;s Encrypt. Alternatively, Cloudflare proxying (orange cloud) is preventing direct verification.
                  </p>
                  <p className="text-xs text-foreground font-medium">
                    <strong>Fix:</strong> Switch Cloudflare to Gray Cloud (DNS Only). Wait 5 minutes, then trigger verification in your <Link href="/dashboard/domains" className="text-primary hover:underline">UL0 Domains Dashboard</Link>.
                  </p>
                </div>

                {/* Issue 2 */}
                <div className="rounded-xl border p-5 bg-card space-y-2">
                  <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>Issue 2: DNS_PROBE_FINISHED_NXDOMAIN</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong>Cause:</strong> Your registrar has not yet propagated the record, or there is a typo in the host name field (e.g. accidentally entering <code className="bg-muted px-1 rounded font-mono">go.yourdomain.com</code> into GoDaddy instead of just <code className="bg-muted px-1 rounded font-mono">go</code>).
                  </p>
                  <p className="text-xs text-foreground font-medium">
                    <strong>Fix:</strong> Check that the host field only contains the subdomain prefix. Test global propagation using terminal command: <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-primary font-bold">dig +short CNAME go.yourdomain.com</code>. It should output <code className="bg-muted px-1.5 py-0.5 rounded font-mono">cname.ul0.site</code>.
                  </p>
                </div>

                {/* Issue 3 */}
                <div className="rounded-xl border p-5 bg-card space-y-2">
                  <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>Issue 3: CAA Record Restrictions</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong>Cause:</strong> Your domain zone has strict Certification Authority Authorization (CAA) records that restrict which certificate authorities are allowed to issue SSL certificates for your domain.
                  </p>
                  <p className="text-xs text-foreground font-medium">
                    <strong>Fix:</strong> If you use CAA records, add a CAA record permitting Let&apos;s Encrypt: Type: <code className="bg-muted px-1 rounded font-mono">CAA</code>, Name: <code className="bg-muted px-1 rounded font-mono">@</code>, Flag: <code className="bg-muted px-1 rounded font-mono">0</code>, Tag: <code className="bg-muted px-1 rounded font-mono">issue</code>, Value: <code className="bg-muted px-1 rounded font-mono">&quot;letsencrypt.org&quot;</code>.
                  </p>
                </div>

                {/* Issue 4 */}
                <div className="rounded-xl border p-5 bg-card space-y-2">
                  <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>Issue 4: Conflicting A Records on the Same Hostname</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong>Cause:</strong> In the DNS specification (RFC 1912), a CNAME record cannot coexist with any other record type on the exact same label. If an existing A or TXT record exists for <code className="bg-muted px-1 rounded font-mono">go</code>, the CNAME will be ignored.
                  </p>
                  <p className="text-xs text-foreground font-medium">
                    <strong>Fix:</strong> Delete any legacy A, AAAA, or parked domain records on the specific subdomain before adding your CNAME record.
                  </p>
                </div>
              </div>
            </section>

            {/* Verification Checklist */}
            <section>
              <h2 className="text-2xl font-bold text-foreground">5. Verifying Your Setup with Terminal Tools</h2>
              <p className="text-muted-foreground">
                Before sharing your first branded short link, run this quick 5-second CLI check from your terminal:
              </p>
              <div className="not-prose rounded-xl border bg-muted/60 p-4 font-mono text-xs space-y-2">
                <div className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                  <Terminal className="h-3.5 w-3.5 text-primary" />
                  <span>Terminal command:</span>
                </div>
                <div className="bg-background p-3 rounded-lg border text-foreground font-bold flex justify-between items-center">
                  <code>curl -I https://go.yourbrand.com/test</code>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Expected response: An immediate <code className="text-emerald-600 dark:text-emerald-400 font-bold">HTTP/2 301</code> or <code className="text-emerald-600 dark:text-emerald-400 font-bold">HTTP/2 200</code> header confirming your edge routing is active.
                </p>
              </div>
            </section>

            {/* Next Steps CTA */}
            <div className="not-prose rounded-2xl border bg-gradient-to-r from-primary/10 via-background to-background p-8 text-center space-y-4 my-10">
              <h3 className="text-2xl font-bold text-foreground">Ready to Connect Your Custom Domain?</h3>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                UL0 provides custom domain support completely free. No subscription required, no credit card required.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link href="/dashboard/domains">
                  <Button className="rounded-xl px-6 font-semibold shadow-xs">
                    Connect Domain in Dashboard
                  </Button>
                </Link>
                <Link href="/custom-domain-landing">
                  <Button variant="outline" className="rounded-xl px-6 font-semibold">
                    Explore Custom Domain Features
                  </Button>
                </Link>
              </div>
            </div>
          </article>

          {/* Author Card */}
          <div className="mt-12 p-6 rounded-2xl border bg-muted/30 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xl shrink-0">
              SK
            </div>
            <div>
              <h3 className="font-bold text-foreground">
                Written by <Link href="/about" className="hover:underline text-primary">Saket Kesar</Link>
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Founder &amp; Developer at UL0. Focused on custom domain routing architectures, edge DNS optimization, and Let&apos;s Encrypt automation. Connect on <a href="https://github.com/Saketkesar" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
