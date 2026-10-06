import Link from "next/link"
import Image from "next/image"
import { ShieldCheck, Flag, ShieldAlert } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-12" role="contentinfo">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Brand & Description & Social Profiles */}
          <div className="space-y-4 sm:col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" aria-label="UL0 Home" className="inline-block">
              <Image
                src="/ul0.png"
                alt="UL0 Logo"
                width={80}
                height={28}
                className="h-7 w-auto object-contain"
                priority
              />
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Enterprise-grade link management, custom domain routing, real-time attribution analytics, and dynamic vector QR codes. Fast edge 301 redirects with instant routing and automated security screening.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Edge 301 Redirects • Anti-Phishing Screened</span>
            </div>

            {/* Verified Social Media Channels (Resolves Semrush 0% Social Media Score) */}
            <div className="pt-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Official Channels
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* X / Twitter */}
                <a
                  href="https://x.com/ul0site"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow UL0 on X (Twitter)"
                  title="Follow UL0 on X (Twitter)"
                  className="h-8 w-8 rounded-lg border border-border/80 bg-background/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/company/ul0"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Connect with UL0 on LinkedIn"
                  title="Connect with UL0 on LinkedIn"
                  className="h-8 w-8 rounded-lg border border-border/80 bg-background/80 flex items-center justify-center text-muted-foreground hover:text-[#0a66c2] hover:border-[#0a66c2]/40 transition-colors"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com/@ul0site"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Subscribe to UL0 on YouTube"
                  title="Subscribe to UL0 on YouTube"
                  className="h-8 w-8 rounded-lg border border-border/80 bg-background/80 flex items-center justify-center text-muted-foreground hover:text-[#ff0000] hover:border-[#ff0000]/40 transition-colors"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/ul0site"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow UL0 on Instagram"
                  title="Follow UL0 on Instagram"
                  className="h-8 w-8 rounded-lg border border-border/80 bg-background/80 flex items-center justify-center text-muted-foreground hover:text-[#e4405f] hover:border-[#e4405f]/40 transition-colors"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com/ul0site"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Connect with UL0 on Facebook"
                  title="Connect with UL0 on Facebook"
                  className="h-8 w-8 rounded-lg border border-border/80 bg-background/80 flex items-center justify-center text-muted-foreground hover:text-[#1877f2] hover:border-[#1877f2]/40 transition-colors"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/Saketkesar/ul0"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Star UL0 on GitHub"
                  title="Star UL0 on GitHub"
                  className="h-8 w-8 rounded-lg border border-border/80 bg-background/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Product & Platform */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 text-sm">Product</h3>
            <nav className="flex flex-col gap-2 text-xs sm:text-sm text-muted-foreground" aria-label="Product navigation">
              <Link href="/features" className="hover:text-foreground transition-colors">Platform Features</Link>
              <Link href="/" className="hover:text-foreground transition-colors">URL Shortener</Link>
              <Link href="/qr" className="hover:text-foreground transition-colors">Vector QR Generator</Link>
              <Link href="/custom-domain-landing" className="hover:text-foreground transition-colors">Branded Custom Domains</Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing &amp; Plans</Link>
              <Link href="/changelog" className="hover:text-foreground transition-colors">Changelog &amp; Updates</Link>
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
              <Link href="/tools/pdf-splitter" className="hover:text-foreground transition-colors font-medium text-emerald-500">PDF Page Splitter</Link>
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
              <Link href="/backlinks" className="hover:text-foreground transition-colors font-medium text-primary">Backlinks &amp; Badges</Link>
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

        {/* Global Languages - Touch-Friendly Accessible Pills for Mobile Usability */}
        <div className="mt-10 pt-6 border-t border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-xs font-semibold text-foreground shrink-0">Global Languages:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { name: "Español", flag: "🇪🇸", href: "/es" },
                { name: "Português", flag: "🇧🇷", href: "/pt" },
                { name: "Deutsch", flag: "🇩🇪", href: "/de" },
                { name: "Français", flag: "🇫🇷", href: "/fr" },
                { name: "Nederlands", flag: "🇳🇱", href: "/nl" },
                { name: "日本語", flag: "🇯🇵", href: "/ja" },
                { name: "한국어", flag: "🇰🇷", href: "/ko" },
                { name: "Tiếng Việt", flag: "🇻🇳", href: "/vi" },
                { name: "Bahasa Indonesia", flag: "🇮🇩", href: "/id" },
                { name: "ไทย", flag: "🇹🇭", href: "/th" },
                { name: "हिन्दी", flag: "🇮🇳", href: "/hi" },
                { name: "العربية", flag: "🇸🇦", href: "/ar" },
              ].map((lang) => (
                <Link
                  key={lang.href}
                  href={lang.href}
                  className="inline-flex items-center gap-1 min-h-[36px] px-2.5 py-1.5 rounded-lg border border-border/60 bg-background/50 hover:bg-accent hover:text-foreground transition-all text-xs font-medium text-muted-foreground shadow-xs"
                >
                  <span>{lang.name}</span>
                  <span className="text-sm">{lang.flag}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright & Badges */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} UL0. All rights reserved. Link Management &amp; Analytics Platform.</p>
          <div className="flex flex-wrap items-center gap-4">
            <a 
              href="https://dashboard.simpleanalytics.com/ul0.site?utm_source=ul0.site&utm_content=badge&affiliate=wobab" 
              referrerPolicy="origin" 
              target="_blank"
              rel="nofollow noopener noreferrer"
              aria-label="Simple Analytics Privacy Badge"
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
                  alt="Simple Analytics Privacy Badge"
                  loading="lazy" 
                  referrerPolicy="no-referrer" 
                  crossOrigin="anonymous"
                  height="20"
                  className="h-5 w-auto"
                />
              </picture>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
