import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-8" role="contentinfo">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Logo & Description */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" aria-label="ul0 Home">
              <Image
                src="/ul0.png"
                alt="ul0 - Free URL Shortener Logo"
                width={80}
                height={28}
                className="h-7 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              Free URL shortener, QR code generator, and expense splitter. No signup required. Fast, reliable, and 100% free.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-3">URL Tools</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground" aria-label="Tools navigation">
              <Link href="/" className="hover:text-foreground transition-colors">URL Shortener</Link>
              <Link href="/qr" className="hover:text-foreground transition-colors">QR Code Generator</Link>
              <Link href="/wifi" className="hover:text-foreground transition-colors">WiFi QR Generator</Link>
              <Link href="/utm" className="hover:text-foreground transition-colors">UTM Link Builder</Link>
              <Link href="/split" className="hover:text-foreground transition-colors">Split Expenses</Link>
              <Link href="/share" className="hover:text-foreground transition-colors font-semibold text-foreground">P2P File Transfer</Link>
              <Link href="/docs" className="hover:text-foreground transition-colors font-semibold text-foreground">Developer API</Link>
            </nav>
          </div>

          {/* Developer & Productivity Tools */}
          <div>
            <h3 className="font-semibold mb-3">Study & Desk Setup</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground" aria-label="Desk setup tools navigation">
              <Link href="/clock" className="hover:text-foreground transition-colors">Aesthetic Clock</Link>
              <Link href="/ambient" className="hover:text-foreground transition-colors">Ambient Sounds</Link>
              <Link href="/countdown" className="hover:text-foreground transition-colors">Countdown Creator</Link>
              <Link href="/quotes" className="hover:text-foreground transition-colors">Motivational Quotes</Link>
              <Link href="/worldclock" className="hover:text-foreground transition-colors">World Clock</Link>
              <Link href="/pomodoro" className="hover:text-foreground transition-colors">Pomodoro Timer</Link>
              <Link href="/json" className="hover:text-foreground transition-colors">JSON Formatter</Link>
              <Link href="/buy" className="hover:text-foreground transition-colors">Should I Buy This?</Link>
            </nav>
          </div>

          {/* Language & Legal Links */}
          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground mb-4" aria-label="Company navigation">
              <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
              <Link href="/about" className="hover:text-foreground transition-colors">About Us</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
              <Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/refund" className="hover:text-foreground transition-colors">Refund &amp; Cancellation</Link>
            </nav>
            <h3 className="font-semibold mb-3">Languages</h3>
            <nav className="flex flex-wrap gap-2 text-sm text-muted-foreground" aria-label="Language selection">
              <Link href="/hi" className="hover:text-foreground transition-colors" hrefLang="hi" title="हिन्दी">🇮🇳</Link>
              <Link href="/id" className="hover:text-foreground transition-colors" hrefLang="id" title="Bahasa Indonesia">🇮🇩</Link>
              <Link href="/pt" className="hover:text-foreground transition-colors" hrefLang="pt" title="Português">🇧🇷</Link>
              <Link href="/vi" className="hover:text-foreground transition-colors" hrefLang="vi" title="Tiếng Việt">🇻🇳</Link>
              <Link href="/th" className="hover:text-foreground transition-colors" hrefLang="th" title="ไทย">🇹🇭</Link>
              <Link href="/es" className="hover:text-foreground transition-colors" hrefLang="es" title="Español">🇪🇸</Link>
              <Link href="/de" className="hover:text-foreground transition-colors" hrefLang="de" title="Deutsch">🇩🇪</Link>
              <Link href="/fr" className="hover:text-foreground transition-colors" hrefLang="fr" title="Français">🇫🇷</Link>
              <Link href="/nl" className="hover:text-foreground transition-colors" hrefLang="nl" title="Nederlands">🇳🇱</Link>
              <Link href="/ja" className="hover:text-foreground transition-colors" hrefLang="ja" title="日本語">🇯🇵</Link>
              <Link href="/ko" className="hover:text-foreground transition-colors" hrefLang="ko" title="한국어">🇰🇷</Link>
              <Link href="/ar" className="hover:text-foreground transition-colors" hrefLang="ar" title="العربية">🇸🇦</Link>
            </nav>
          </div>

          {/* Popular Pages */}
          <div>
            <h3 className="font-semibold mb-3">Popular Pages</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground" aria-label="Popular pages navigation">
              <Link href="/split" className="hover:text-foreground transition-colors">Split Expenses</Link>
              <Link href="/qr" className="hover:text-foreground transition-colors">QR Code Generator</Link>
              <Link href="/utm" className="hover:text-foreground transition-colors">UTM Builder</Link>
              <Link href="/wifi" className="hover:text-foreground transition-colors">WiFi QR Generator</Link>
              <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ul0. All rights reserved. Free URL Shortener & Expense Splitter.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="https://frogdr.com/ul0.site?utm_source=ul0.site" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
              <img src="https://frogdr.com/ul0.site/badge-dark.svg?round=1" alt="Monitor your Domain Rating with FrogDR" width="130" className="h-8 w-auto" />
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
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              Made with <Heart className="h-3 w-3 fill-red-500 text-red-500" aria-label="love" /> by stablersleet
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
