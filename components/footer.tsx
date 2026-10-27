import Link from "next/link"
import Image from "next/image"
import { ShieldCheck } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-muted/20 py-12 text-foreground" role="contentinfo">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid gap-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand & Statement */}
          <div className="space-y-3 col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-2">
            <Link href="/" aria-label="UL0 Home" className="inline-block">
              <Image
                src="/ul0.png"
                alt="UL0"
                width={70}
                height={24}
                className="h-6 w-auto object-contain"
                priority
              />
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              Simple, fast link shortener, branded custom domains, dynamic vector QR codes, and client-side private file tools.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Zero-tracking cookies • Client-side file privacy</span>
            </div>

            {/* Social channels */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://x.com/ul0site"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="h-7 w-7 rounded border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://github.com/Saketkesar/ul0"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="h-7 w-7 rounded border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/ul0"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="h-7 w-7 rounded border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-foreground">Product</div>
            <nav className="flex flex-col gap-2 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">URL Shortener</Link>
              <Link href="/qr" className="hover:text-foreground transition-colors">Vector QR Generator</Link>
              <Link href="/custom-domain-landing" className="hover:text-foreground transition-colors">Custom Domains</Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing &amp; Plans</Link>
              <Link href="/compare" className="hover:text-foreground transition-colors">Compare vs Bitly</Link>
              <Link href="/docs" className="hover:text-foreground transition-colors">Developer API</Link>
            </nav>
          </div>

          {/* Utilities */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-foreground">Utilities</div>
            <nav className="flex flex-col gap-2 text-xs text-muted-foreground">
              <Link href="/files" className="hover:text-foreground transition-colors font-medium text-foreground">Files &amp; PDF Suite</Link>
              <Link href="/split" className="hover:text-foreground transition-colors">Split Bill Online</Link>
              <Link href="/whatsapp" className="hover:text-foreground transition-colors">WhatsApp Link Generator</Link>
              <Link href="/tools/redirect-checker" className="hover:text-foreground transition-colors">301 Redirect Checker</Link>
              <Link href="/tools/url-expander" className="hover:text-foreground transition-colors">URL Expander</Link>
              <Link href="/utm" className="hover:text-foreground transition-colors">UTM Campaign Builder</Link>
              <Link href="/wifi" className="hover:text-foreground transition-colors">WiFi QR Code</Link>
            </nav>
          </div>

          {/* Legal & Trust */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-foreground">Legal &amp; Trust</div>
            <nav className="flex flex-col gap-2 text-xs text-muted-foreground">
              <Link href="/about" className="hover:text-foreground transition-colors">About UL0</Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="/security" className="hover:text-foreground transition-colors">Security</Link>
              <Link href="/status" className="hover:text-foreground transition-colors">System Status</Link>
              <Link href="/report-abuse" className="hover:text-foreground transition-colors">Report Abuse</Link>
            </nav>
          </div>
        </div>

        {/* Global Languages Strip */}
        <div className="mt-8 pt-6 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="font-medium text-foreground">Languages:</span>
            {[
              { name: "English", href: "/" },
              { name: "Español", href: "/es" },
              { name: "Português", href: "/pt" },
              { name: "Deutsch", href: "/de" },
              { name: "Français", href: "/fr" },
              { name: "Indonesia", href: "/id" },
              { name: "Hindi", href: "/hi" },
            ].map((lang) => (
              <Link
                key={lang.name}
                href={lang.href}
                className="hover:text-foreground transition-colors px-1.5 py-0.5 rounded border border-border/40 hover:bg-muted"
              >
                {lang.name}
              </Link>
            ))}
          </div>

          <div className="text-[11px]">
            © {new Date().getFullYear()} UL0. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
