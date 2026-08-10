import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, User, Server, Globe, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Custom Domain DNS & CNAME Setup Guide for Short Links (2026) | ul0 Blog",
  description: "Step-by-step technical guide to configuring CNAME DNS records, SSL/TLS certificates, and Cloudflare/Route53 settings for custom branded short links.",
  keywords: [
    "cname setup link shortener",
    "custom domain short links dns",
    "how to connect custom domain url shortener",
    "cloudflare cname shortener",
    "route53 short link setup 2026",
  ],
  alternates: {
    canonical: "https://ul0.site/blog/custom-domain-dns-cname-setup-guide",
  },
  openGraph: {
    title: "Custom Domain DNS & CNAME Setup Guide | ul0 Blog",
    description: "Step-by-step technical guide to configuring CNAME DNS records and SSL for custom branded short links.",
    url: "https://ul0.site/blog/custom-domain-dns-cname-setup-guide",
    type: "article",
    publishedTime: "2026-08-10",
  },
}

export default function CustomDomainDnsSetupGuidePage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Custom Domain DNS & CNAME Setup Guide for Short Links",
    description: "Step-by-step technical guide to configuring CNAME DNS records, SSL/TLS certificates, and Cloudflare settings for custom branded short links.",
    image: "https://ul0.site/ul0.png",
    author: {
      "@type": "Person",
      name: "Saket Kesar",
      jobTitle: "Senior Performance Engineer",
    },
    publisher: {
      "@type": "Organization",
      name: "ul0",
      logo: {
        "@type": "ImageObject",
        url: "https://ul0.site/ul0.png",
      },
    },
    datePublished: "2026-08-10",
    dateModified: "2026-08-10",
    mainEntityOfPage: "https://ul0.site/blog/custom-domain-dns-cname-setup-guide",
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>

          <header className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">DNS & Infrastructure</Badge>
              <Badge variant="outline">Technical Guide</Badge>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl mb-6 leading-tight">
              How to Configure Custom Domain CNAME DNS & SSL for Branded Short Links
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y py-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span>Saket Kesar</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>August 10, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>7 min read</span>
              </div>
            </div>
          </header>

          <article className="prose prose-slate dark:prose-invert max-w-none space-y-6 leading-relaxed">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Connecting a custom domain (e.g. <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">link.yourbrand.com</code>) to your URL shortening engine elevates brand recognition and improves CTR. This technical guide outlines the DNS record configuration, CNAME mapping, and automatic Let's Encrypt SSL/TLS provisioning process.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8">Step 1: Choose Your Subdomain or Root Domain</h2>
            <p>
              We recommend using a dedicated subdomain (such as <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">go.yourdomain.com</code> or <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">link.yourdomain.com</code>) to avoid conflicts with your main web server's A records.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8">Step 2: Add CNAME Record in your DNS Provider</h2>
            <p>
              Log into your DNS management portal (Cloudflare, Namecheap, GoDaddy, AWS Route 53) and create the following DNS record:
            </p>
            <div className="bg-muted p-4 rounded-xl font-mono text-sm space-y-2 border">
              <div><strong>Type:</strong> CNAME</div>
              <div><strong>Host / Name:</strong> go (or link)</div>
              <div><strong>Value / Target:</strong> cname.ul0.site</div>
              <div><strong>TTL:</strong> Auto / 300 seconds</div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mt-8">Step 3: Cloudflare Proxy (Orange Cloud) Consideration</h2>
            <p>
              If using Cloudflare DNS, set the Proxy status to <strong>DNS Only (Grey Cloud)</strong> during initial SSL handshake verification. Once Let's Encrypt issues the certificate, you may safely enable Cloudflare Proxying for Edge DDoS mitigation.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8">Step 4: Automated SSL/TLS Handshake & Verification</h2>
            <p>
              Once your DNS propagates (typically 1–15 minutes), our Vercel Edge routing network automatically provisions a dedicated 2048-bit RSA Let's Encrypt SSL certificate for your custom domain, guaranteeing zero security warnings for your audience.
            </p>
          </article>

          <div className="mt-12 p-6 rounded-2xl border bg-muted/30 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xl shrink-0">
              SK
            </div>
            <div>
              <h3 className="font-bold text-foreground">Written by Saket Kesar</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Senior Performance Engineer at ul0.site specializing in DNS architecture, SSL automation, and cloud edge routing.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
