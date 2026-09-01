import Link from "next/link"
import Image from "next/image"
import { Heart, ShieldCheck, Flag } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-10" role="contentinfo">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Brand & Description */}
          <div className="space-y-4 sm:col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" aria-label="ul0 Home">
              <Image
                src="/ul0.png"
                alt="ul0 - Free URL Shortener Logo"
                width={80}
                height={28}
                className="h-7 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Free link management and QR code tools for creators, marketers, and small businesses. Fast permanent redirects, click analytics, and custom domain short links.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>HTTPS Encrypted • Anti-Phishing Filtered</span>
            </div>
          </div>

          {/* Core Tools */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 text-sm">Core Link Tools</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground" aria-label="Core tools navigation">
              <Link href="/free-url-shortener" className="hover:text-foreground transition-colors">Free URL Shortener</Link>
              <Link href="/qr-code-generator" className="hover:text-foreground transition-colors">QR Code Generator</Link>
              <Link href="/utm-builder" className="hover:text-foreground transition-colors">UTM Campaign Builder</Link>
              <Link href="/link-tracker" className="hover:text-foreground transition-colors">Link Tracker &amp; Stats</Link>
              <Link href="/link-in-bio" className="hover:text-foreground transition-colors">Link in Bio Creator</Link>
              <Link href="/url-expander" className="hover:text-foreground transition-colors">URL Expander &amp; Safety</Link>
              <Link href="/wifi-qr-code-generator" className="hover:text-foreground transition-colors">WiFi QR Generator</Link>
            </nav>
          </div>

          {/* Marketing & Business */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 text-sm">Marketing &amp; Business</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground" aria-label="Business tools navigation">
              <Link href="/pricing" className="hover:text-foreground transition-colors">Custom Branded Domains</Link>
              <Link href="/qr-code-for-business" className="hover:text-foreground transition-colors">QR for Business Cards &amp; Flyers</Link>
              <Link href="/docs" className="hover:text-foreground transition-colors">Developer REST API</Link>
              <Link href="/custom-domain-landing" className="hover:text-foreground transition-colors">Custom Domain Setup</Link>
              <Link href="/blog" className="hover:text-foreground transition-colors">Link Strategy &amp; Guides</Link>
            </nav>
          </div>

          {/* Productivity & Utilities */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 text-sm">Utilities</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground" aria-label="Utility navigation">
              <Link href="/split" className="hover:text-foreground transition-colors">Split Expenses &amp; Bills</Link>
              <Link href="/pdf" className="hover:text-foreground transition-colors">PDF Document Scanner</Link>
              <Link href="/json" className="hover:text-foreground transition-colors">JSON Formatter</Link>
              <Link href="/share" className="hover:text-foreground transition-colors">P2P File Transfer</Link>
              <Link href="/pomodoro" className="hover:text-foreground transition-colors">Pomodoro Timer</Link>
              <Link href="/clock" className="hover:text-foreground transition-colors">Aesthetic Clock</Link>
            </nav>
          </div>

          {/* Company, Trust & Security */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 text-sm">Company &amp; Trust</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground" aria-label="Company navigation">
              <Link href="/about" className="hover:text-foreground transition-colors">About Us</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">Contact Support</Link>
              <Link href="/security" className="hover:text-foreground transition-colors text-emerald-500 font-medium">Security &amp; Safety</Link>
              <Link href="/report-abuse" className="hover:text-foreground transition-colors text-rose-500 font-medium flex items-center gap-1">
                <Flag className="h-3.5 w-3.5" />
                Report Abuse
              </Link>
              <Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="/refund" className="hover:text-foreground transition-colors">Refund Policy</Link>
            </nav>
          </div>
        </div>

        {/* Global Languages */}
        <div className="mt-8 pt-6 border-t border-border/60">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground mr-1">Languages:</span>
              <Link href="/es" className="hover:text-foreground transition-colors">Español</Link> •
              <Link href="/pt" className="hover:text-foreground transition-colors">Português</Link> •
              <Link href="/de" className="hover:text-foreground transition-colors">Deutsch</Link> •
              <Link href="/fr" className="hover:text-foreground transition-colors">Français</Link> •
              <Link href="/nl" className="hover:text-foreground transition-colors">Nederlands</Link> •
              <Link href="/ja" className="hover:text-foreground transition-colors">日本語</Link> •
              <Link href="/ko" className="hover:text-foreground transition-colors">한국어</Link> •
              <Link href="/vi" className="hover:text-foreground transition-colors">Tiếng Việt</Link> •
              <Link href="/id" className="hover:text-foreground transition-colors">Bahasa Indonesia</Link> •
              <Link href="/th" className="hover:text-foreground transition-colors">ไทย</Link> •
              <Link href="/hi" className="hover:text-foreground transition-colors">हिन्दी</Link> •
              <Link href="/ar" className="hover:text-foreground transition-colors">العربية</Link>
            </div>
          </div>
        </div>

        {/* Copyright & Badges */}
        <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} ul0.site. All rights reserved. Free URL Shortener &amp; QR Code Platform.</p>
          <div className="flex flex-wrap items-center gap-4">
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
            <p className="flex items-center gap-1">
              Made with <Heart className="h-3 w-3 fill-red-500 text-red-500" aria-label="love" /> for creators &amp; small businesses
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
