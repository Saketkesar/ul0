import Link from "next/link"
import Image from "next/image"
import { ShieldCheck, Flag, ShieldAlert, Sparkles, ArrowRight } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-12" role="contentinfo">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Brand & Description */}
          <div className="space-y-4 sm:col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" aria-label="UL0 Home">
              <Image
                src="/ul0.png"
                alt="UL0 Link Management Logo"
                width={80}
                height={28}
                className="h-7 w-auto object-contain"
              />
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Enterprise-grade link management, custom domain routing, real-time attribution analytics, and dynamic vector QR codes. Fast edge 301 redirects with zero interstitial ads.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Edge 301 Redirects • Anti-Phishing Screened</span>
            </div>
          </div>

          {/* Product & Platform */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 text-sm">Product</h3>
            <nav className="flex flex-col gap-2 text-xs sm:text-sm text-muted-foreground" aria-label="Product navigation">
              <Link href="/features" className="hover:text-foreground transition-colors">Platform Features</Link>
              <Link href="/" className="hover:text-foreground transition-colors">URL Shortener</Link>
              <Link href="/qr" className="hover:text-foreground transition-colors">Vector QR Generator</Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">Branded Custom Domains</Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing &amp; Plans</Link>
              <Link href="/changelog" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                <span>Changelog</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary/10 text-primary">v2.4</span>
              </Link>
              <Link href="/docs" className="hover:text-foreground transition-colors">Developer REST API</Link>
            </nav>
          </div>

          {/* Industry Solutions / Use Cases */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 text-sm">Solutions</h3>
            <nav className="flex flex-col gap-2 text-xs sm:text-sm text-muted-foreground" aria-label="Solutions navigation">
              <Link href="/use-cases" className="hover:text-foreground transition-colors font-medium text-primary">All Solutions Hub</Link>
              <Link href="/use-cases/marketing-agencies" className="hover:text-foreground transition-colors">Marketing Agencies</Link>
              <Link href="/use-cases/small-business" className="hover:text-foreground transition-colors">Small Businesses</Link>
              <Link href="/use-cases/ecommerce" className="hover:text-foreground transition-colors">E-Commerce &amp; SMS</Link>
              <Link href="/use-cases/creators" className="hover:text-foreground transition-colors">Creators &amp; Bio Links</Link>
              <Link href="/use-cases/real-estate" className="hover:text-foreground transition-colors">Real Estate Signs</Link>
              <Link href="/use-cases/restaurants" className="hover:text-foreground transition-colors">Restaurant Menus</Link>
              <Link href="/use-cases/startups" className="hover:text-foreground transition-colors">Startups &amp; SaaS</Link>
              <Link href="/use-cases/events" className="hover:text-foreground transition-colors">Events &amp; Badges</Link>
            </nav>
          </div>

          {/* Free Web & SEO Tools */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 text-sm">Free Tools</h3>
            <nav className="flex flex-col gap-2 text-xs sm:text-sm text-muted-foreground" aria-label="Tools navigation">
              <Link href="/tools" className="hover:text-foreground transition-colors font-medium text-primary">Free Tools Directory</Link>
              <Link href="/tools/redirect-checker" className="hover:text-foreground transition-colors">HTTP Redirect Checker</Link>
              <Link href="/tools/url-expander" className="hover:text-foreground transition-colors">URL Expander &amp; Safety</Link>
              <Link href="/tools/og-preview" className="hover:text-foreground transition-colors">OpenGraph Previewer</Link>
              <Link href="/tools/meta-tag-generator" className="hover:text-foreground transition-colors">Meta Tag Generator</Link>
              <Link href="/utm" className="hover:text-foreground transition-colors">UTM Campaign Builder</Link>
              <Link href="/json" className="hover:text-foreground transition-colors">JSON Formatter</Link>
              <Link href="/pdf" className="hover:text-foreground transition-colors">PDF Document Tools</Link>
              <Link href="/wifi" className="hover:text-foreground transition-colors">WiFi QR Code Maker</Link>
            </nav>
          </div>

          {/* Trust, Security & Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 text-sm">Trust &amp; Legal</h3>
            <nav className="flex flex-col gap-2 text-xs sm:text-sm text-muted-foreground" aria-label="Company navigation">
              <Link href="/about" className="hover:text-foreground transition-colors">About UL0</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">Contact Support</Link>
              <Link href="/security" className="hover:text-foreground transition-colors text-emerald-500 font-medium">Security &amp; Safety</Link>
              <Link href="/threats" className="hover:text-foreground transition-colors text-rose-500 font-medium flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5" />
                Threat Radar
              </Link>
              <Link href="/report-abuse" className="hover:text-foreground transition-colors text-rose-500 font-medium flex items-center gap-1">
                <Flag className="h-3.5 w-3.5" />
                Report Abuse
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="/refund" className="hover:text-foreground transition-colors">Refund Policy</Link>
            </nav>
          </div>
        </div>

        {/* Global Languages */}
        <div className="mt-8 pt-6 border-t border-border/60">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground mr-1">Global Languages:</span>
            <Link href="/es" className="hover:text-foreground transition-colors">Español 🇪🇸</Link> •
            <Link href="/pt" className="hover:text-foreground transition-colors">Português 🇧🇷</Link> •
            <Link href="/de" className="hover:text-foreground transition-colors">Deutsch 🇩🇪</Link> •
            <Link href="/fr" className="hover:text-foreground transition-colors">Français 🇫🇷</Link> •
            <Link href="/nl" className="hover:text-foreground transition-colors">Nederlands 🇳🇱</Link> •
            <Link href="/ja" className="hover:text-foreground transition-colors">日本語 🇯🇵</Link> •
            <Link href="/ko" className="hover:text-foreground transition-colors">한국어 🇰🇷</Link> •
            <Link href="/vi" className="hover:text-foreground transition-colors">Tiếng Việt 🇻🇳</Link> •
            <Link href="/id" className="hover:text-foreground transition-colors">Bahasa Indonesia 🇮🇩</Link> •
            <Link href="/th" className="hover:text-foreground transition-colors">ไทย 🇹🇭</Link> •
            <Link href="/hi" className="hover:text-foreground transition-colors">हिन्दी 🇮🇳</Link> •
            <Link href="/ar" className="hover:text-foreground transition-colors">العربية 🇸🇦</Link>
          </div>
        </div>

        {/* Copyright & Badges */}
        <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} UL0. All rights reserved. Link Management &amp; Analytics Platform.</p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="https://frogdr.com/ul0.site?utm_source=ul0.site" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://frogdr.com/ul0.site/badge-dark.svg?round=1" alt="Monitor your Domain Rating with FrogDR" width="130" className="h-7 w-auto" />
            </a>
            <a 
              href="https://dashboard.simpleanalytics.com/ul0.site?utm_source=ul0.site&utm_content=badge&affiliate=wobab" 
              referrerPolicy="origin" 
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <picture>
                <source 
                  srcSet="https://simpleanalyticsbadges.com/ul0.site?mode=dark" 
                  media="(prefers-color-scheme: dark)" 
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://simpleanalyticsbadges.com/ul0.site?mode=light" 
                  alt="Simple Analytics"
                  loading="lazy" 
                  referrerPolicy="no-referrer" 
                  crossOrigin="anonymous"
                  className="h-5"
                />
              </picture>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
