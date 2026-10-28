"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
  Link2,
  QrCode,
  Globe,
  ExternalLink,
  Search,
  TrendingUp,
  Eye,
  MessageCircle,
  Wifi,
  FileText,
  Users,
  FileSpreadsheet,
} from "lucide-react"
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs"

const TOOLS_LIST = [
  { name: "Forms to Google Sheets", href: "/forms", desc: "Zero-DB forms to spreadsheet" },
  { name: "HTTP Redirect Checker", href: "/tools/redirect-checker", desc: "Trace 301/302 chains" },
  { name: "URL Expander", href: "/tools/url-expander", desc: "Unshorten and preview targets" },
  { name: "OpenGraph Previewer", href: "/tools/og-preview", desc: "Test social media cards" },
  { name: "UTM Campaign Builder", href: "/utm", desc: "Standardize GA4 attribution" },
  { name: "WhatsApp Link Generator", href: "/whatsapp", desc: "Click-to-chat links and QR" },
  { name: "WiFi QR Code", href: "/wifi", desc: "Instant network connect QR" },
  { name: "Files & PDF Suite", href: "/files", desc: "100% private browser tools" },
  { name: "Split Bill Online", href: "/split", desc: "Group expense calculator" },
]

export function Header() {
  const pathname = usePathname()
  const { isSignedIn } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  // Initialize theme state
  useEffect(() => {
    try {
      const isDarkMode = document.documentElement.classList.contains("dark")
      setIsDark(isDarkMode)
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

  // Close mobile sheet on path change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-background">
      <div className="container mx-auto flex h-full items-center justify-between px-4 sm:px-6 max-w-7xl">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2" aria-label="UL0 Homepage">
            <Image
              src="/ul0.png"
              alt="UL0"
              width={64}
              height={24}
              className="h-6 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-muted-foreground" aria-label="Main Navigation">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-md hover:text-foreground transition-colors ${
                pathname === "/" ? "text-foreground font-semibold" : ""
              }`}
            >
              Links
            </Link>

            <Link
              href="/qr"
              className={`px-3 py-1.5 rounded-md hover:text-foreground transition-colors ${
                pathname === "/qr" ? "text-foreground font-semibold" : ""
              }`}
            >
              QR Codes
            </Link>

            <Link
              href="/custom-domain-landing"
              className={`px-3 py-1.5 rounded-md hover:text-foreground transition-colors ${
                pathname === "/custom-domain-landing" ? "text-foreground font-semibold" : ""
              }`}
            >
              Domains
            </Link>

            <Link
              href="/pricing"
              className={`px-3 py-1.5 rounded-md hover:text-foreground transition-colors ${
                pathname === "/pricing" ? "text-foreground font-semibold" : ""
              }`}
            >
              Pricing
            </Link>

            <Link
              href="/docs"
              className={`px-3 py-1.5 rounded-md hover:text-foreground transition-colors ${
                pathname.startsWith("/docs") ? "text-foreground font-semibold" : ""
              }`}
            >
              Docs
            </Link>

            {/* Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="px-3 py-1.5 rounded-md hover:text-foreground transition-colors inline-flex items-center gap-1 outline-none">
                <span>Tools</span>
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 p-1.5">
                <DropdownMenuItem asChild>
                  <Link href="/tools" className="font-semibold text-xs py-2 text-foreground">
                    Browse All Tools →
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {TOOLS_LIST.map((tool) => (
                  <DropdownMenuItem key={tool.href} asChild>
                    <Link href={tool.href} className="flex flex-col items-start py-1.5 cursor-pointer">
                      <span className="text-xs font-medium text-foreground">{tool.name}</span>
                      <span className="text-[11px] text-muted-foreground">{tool.desc}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Auth State */}
          {isSignedIn ? (
            <div className="flex items-center gap-2">
              <Button asChild size="sm" variant="ghost" className="h-8 text-xs font-medium">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-7 w-7",
                  },
                }}
              />
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="h-8 text-xs font-medium">
                  Log in
                </Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button size="sm" className="h-8 text-xs font-semibold px-3.5">
                  Sign up
                </Button>
              </SignUpButton>
            </div>
          )}

          {/* Mobile Sheet Trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden h-9 w-9 p-0"
                aria-label="Open mobile menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80 p-6 flex flex-col justify-between">
              <SheetHeader className="text-left border-b border-border pb-4">
                <SheetTitle className="flex items-center gap-2">
                  <Image src="/ul0.png" alt="UL0" width={60} height={22} className="h-5 w-auto" />
                </SheetTitle>
              </SheetHeader>

              {/* Mobile Nav Links (44px min touch targets) */}
              <nav className="flex-1 py-6 flex flex-col gap-1 overflow-y-auto" aria-label="Mobile Navigation">
                <Link
                  href="/"
                  className="min-h-[44px] flex items-center px-3 rounded-md text-sm font-medium hover:bg-muted text-foreground"
                >
                  Links
                </Link>
                <Link
                  href="/qr"
                  className="min-h-[44px] flex items-center px-3 rounded-md text-sm font-medium hover:bg-muted text-foreground"
                >
                  QR Codes
                </Link>
                <Link
                  href="/custom-domain-landing"
                  className="min-h-[44px] flex items-center px-3 rounded-md text-sm font-medium hover:bg-muted text-foreground"
                >
                  Custom Domains
                </Link>
                <Link
                  href="/pricing"
                  className="min-h-[44px] flex items-center px-3 rounded-md text-sm font-medium hover:bg-muted text-foreground"
                >
                  Pricing
                </Link>
                <Link
                  href="/docs"
                  className="min-h-[44px] flex items-center px-3 rounded-md text-sm font-medium hover:bg-muted text-foreground"
                >
                  Developer Docs
                </Link>
                <Link
                  href="/tools"
                  className="min-h-[44px] flex items-center px-3 rounded-md text-sm font-medium hover:bg-muted text-foreground"
                >
                  Tools Hub
                </Link>
                <Link
                  href="/compare"
                  className="min-h-[44px] flex items-center px-3 rounded-md text-sm font-medium hover:bg-muted text-foreground"
                >
                  Compare Alternatives
                </Link>
              </nav>

              {/* Mobile Auth Bottom CTA */}
              <div className="pt-4 border-t border-border space-y-2">
                {isSignedIn ? (
                  <Button asChild className="w-full min-h-[44px] text-xs font-semibold">
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <SignUpButton mode="modal">
                      <Button className="w-full min-h-[44px] text-xs font-semibold">
                        Sign up free
                      </Button>
                    </SignUpButton>
                    <SignInButton mode="modal">
                      <Button variant="outline" className="w-full min-h-[44px] text-xs font-medium">
                        Log in
                      </Button>
                    </SignInButton>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
