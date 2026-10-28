"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ShieldCheck, Globe, Moon, Sun } from "lucide-react"

const LANGUAGES = [
  { code: "en", name: "English", href: "/" },
  { code: "es", name: "Español", href: "/es" },
  { code: "pt", name: "Português", href: "/pt" },
  { code: "de", name: "Deutsch", href: "/de" },
  { code: "fr", name: "Français", href: "/fr" },
  { code: "id", name: "Indonesia", href: "/id" },
  { code: "hi", name: "हिन्दी", href: "/hi" },
]

export function Footer() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    try {
      setIsDark(document.documentElement.classList.contains("dark"))
    } catch {}
  }, [])

  const toggleTheme = () => {
    const nextDark = !isDark
    setIsDark(nextDark)
    try {
      if (nextDark) {
        document.documentElement.classList.add("dark")
        localStorage.setItem("theme", "dark")
        document.cookie = "theme=dark; path=/; max-age=31536000; SameSite=Lax"
      } else {
        document.documentElement.classList.remove("dark")
        localStorage.setItem("theme", "light")
        document.cookie = "theme=light; path=/; max-age=31536000; SameSite=Lax"
      }
    } catch {}
  }

  return (
    <footer className="border-t border-border bg-card/50 text-foreground py-14" role="contentinfo">
      <div className="container mx-auto px-4 max-w-7xl space-y-12">
        {/* 5-Column Grid */}
        <div className="grid gap-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {/* Column 1: Product */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-foreground tracking-wider uppercase">Product</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Link Shortener
                </Link>
              </li>
              <li>
                <Link href="/qr" className="hover:text-foreground transition-colors">
                  Vector QR Codes
                </Link>
              </li>
              <li>
                <Link href="/custom-domain-landing" className="hover:text-foreground transition-colors">
                  Branded Domains
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground transition-colors">
                  Pricing &amp; Limits
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-foreground transition-colors">
                  Compare Alternatives
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Developers */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-foreground tracking-wider uppercase">Developers</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/docs" className="hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/dashboard/keys" className="hover:text-foreground transition-colors">
                  API Keys
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="hover:text-foreground transition-colors">
                  Changelog
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/Saketkesar/ul0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <Link href="/status" className="hover:text-foreground transition-colors">
                  System Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Tools */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-foreground tracking-wider uppercase">Tools</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/forms" className="hover:text-foreground transition-colors">
                  Forms to Sheets
                </Link>
              </li>
              <li>
                <Link href="/tools/redirect-checker" className="hover:text-foreground transition-colors">
                  Redirect Checker
                </Link>
              </li>
              <li>
                <Link href="/tools/url-expander" className="hover:text-foreground transition-colors">
                  URL Expander
                </Link>
              </li>
              <li>
                <Link href="/tools/og-preview" className="hover:text-foreground transition-colors">
                  OpenGraph Preview
                </Link>
              </li>
              <li>
                <Link href="/utm" className="hover:text-foreground transition-colors">
                  UTM Campaign Builder
                </Link>
              </li>
              <li>
                <Link href="/whatsapp" className="hover:text-foreground transition-colors">
                  WhatsApp Link
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-foreground transition-colors font-medium text-foreground">
                  View All Tools →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-foreground tracking-wider uppercase">Company</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About UL0
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <a href="mailto:support@ul0.site" className="hover:text-foreground transition-colors">
                  support@ul0.site
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/ul0site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  X (@ul0site)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Legal & Trust */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-foreground tracking-wider uppercase">Legal &amp; Trust</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-foreground transition-colors">
                  Security Overview
                </Link>
              </li>
              <li>
                <Link href="/report-abuse" className="hover:text-foreground transition-colors text-destructive">
                  Report Abuse
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-foreground transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Brand, Trust Line, Language Selector & Theme Toggle */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <Link href="/" aria-label="UL0 Homepage">
              <Image src="/ul0.png" alt="UL0" width={56} height={20} className="h-4 w-auto object-contain" />
            </Link>
            <span className="hidden sm:inline text-muted-foreground/40">•</span>
            <span>Zero-tracking cookies • Client-side private tools</span>
            <span className="hidden sm:inline text-muted-foreground/40">•</span>
            <span>© {new Date().getFullYear()} UL0 Platform</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Status indicator */}
            <Link
              href="/status"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-background hover:bg-muted text-[11px] font-medium text-foreground transition-colors"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>All Systems Operational</span>
            </Link>

            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-background hover:bg-muted text-[11px] font-medium text-foreground outline-none">
                <Globe className="h-3 w-3 text-muted-foreground" />
                <span>Language</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36 p-1">
                {LANGUAGES.map((lang) => (
                  <DropdownMenuItem key={lang.code} asChild>
                    <Link href={lang.href} className="text-xs py-1 cursor-pointer">
                      {lang.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center justify-center h-7 w-7 rounded border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
