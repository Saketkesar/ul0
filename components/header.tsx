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
  Sun,
  Moon,
  Link2,
  QrCode,
  Globe,
  BarChart3,
  BookOpen,
  Newspaper,
  Activity,
  ArrowRight,
} from "lucide-react"
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs"

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
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-background/95 backdrop-blur-xs">
      <div className="container mx-auto flex h-full items-center justify-between px-4 sm:px-6 max-w-7xl">
        {/* Left: Brand Logo (goes home) */}
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

          {/* Desktop Nav - Exactly matches PDF Section 5 */}
          <nav className="hidden md:flex items-center gap-1 text-[15px] font-medium text-muted-foreground" aria-label="Main Navigation">
            {/* Product Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="px-3 py-1.5 rounded-md hover:text-foreground transition-colors inline-flex items-center gap-1 outline-none cursor-pointer">
                <span>Product</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 p-1.5">
                <DropdownMenuItem asChild>
                  <Link href="/#shortener" className="flex items-center gap-2.5 py-2 cursor-pointer">
                    <Link2 className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-xs font-semibold text-foreground">Short Links</div>
                      <div className="text-[11px] text-muted-foreground">307 fast temporary redirects</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/qr" className="flex items-center gap-2.5 py-2 cursor-pointer">
                    <QrCode className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-xs font-semibold text-foreground">Vector QR Codes</div>
                      <div className="text-[11px] text-muted-foreground">Dynamic SVG and PNG</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/custom-domain-landing" className="flex items-center gap-2.5 py-2 cursor-pointer">
                    <Globe className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-xs font-semibold text-foreground">Custom Domains</div>
                      <div className="text-[11px] text-muted-foreground">1 domain included free</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/features" className="flex items-center gap-2.5 py-2 cursor-pointer">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-xs font-semibold text-foreground">Click Analytics</div>
                      <div className="text-[11px] text-muted-foreground">Cookieless privacy metrics</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Compare (Direct main bar link per PDF) */}
            <Link
              href="/compare"
              className={`px-3 py-1.5 rounded-md hover:text-foreground transition-colors ${
                pathname.startsWith("/compare") ? "text-foreground font-semibold" : ""
              }`}
            >
              Compare
            </Link>

            {/* Free tools (Direct main bar link per PDF) */}
            <Link
              href="/tools"
              className={`px-3 py-1.5 rounded-md hover:text-foreground transition-colors ${
                pathname.startsWith("/tools") ? "text-foreground font-semibold" : ""
              }`}
            >
              Free tools
            </Link>

            {/* Pricing */}
            <Link
              href="/pricing"
              className={`px-3 py-1.5 rounded-md hover:text-foreground transition-colors ${
                pathname === "/pricing" ? "text-foreground font-semibold" : ""
              }`}
            >
              Pricing
            </Link>

            {/* Docs and help Dropdown (Blog under Docs per PDF) */}
            <DropdownMenu>
              <DropdownMenuTrigger className="px-3 py-1.5 rounded-md hover:text-foreground transition-colors inline-flex items-center gap-1 outline-none cursor-pointer">
                <span>Docs and help</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 p-1.5">
                <DropdownMenuItem asChild>
                  <Link href="/docs" className="flex items-center gap-2 py-2 cursor-pointer">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-foreground">Developer Docs</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/blog" className="flex items-center gap-2 py-2 cursor-pointer">
                    <Newspaper className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-foreground">Blog &amp; Guides</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/status" className="flex items-center gap-2 py-2 cursor-pointer">
                    <Activity className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-foreground">System Status</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        {/* Right Actions - Sign in as text button, Create free link as filled button */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Auth State */}
          {isSignedIn ? (
            <div className="flex items-center gap-2">
              <Button asChild size="sm" variant="ghost" className="h-9 text-xs font-medium">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                  },
                }}
              />
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="h-9 text-xs font-medium text-foreground hover:bg-muted">
                  Sign in
                </Button>
              </SignInButton>

              <Button asChild size="sm" className="h-9 text-xs font-semibold px-4 bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/#shortener">Create free link</Link>
              </Button>
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

              {/* Mobile Nav Links: EXACT same order as desktop per PDF */}
              <nav className="flex-1 py-6 flex flex-col gap-1 overflow-y-auto" aria-label="Mobile Navigation">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-3 py-1">
                  Product
                </div>
                <Link
                  href="/#shortener"
                  className="min-h-[44px] flex items-center px-3 rounded-md text-[15px] font-medium hover:bg-muted text-foreground"
                >
                  Short Links
                </Link>
                <Link
                  href="/qr"
                  className="min-h-[44px] flex items-center px-3 rounded-md text-[15px] font-medium hover:bg-muted text-foreground"
                >
                  Vector QR Codes
                </Link>
                <Link
                  href="/custom-domain-landing"
                  className="min-h-[44px] flex items-center px-3 rounded-md text-[15px] font-medium hover:bg-muted text-foreground"
                >
                  Custom Domains
                </Link>

                <div className="h-px bg-border my-2" />

                <Link
                  href="/compare"
                  className="min-h-[44px] flex items-center px-3 rounded-md text-[15px] font-medium hover:bg-muted text-foreground"
                >
                  Compare
                </Link>
                <Link
                  href="/tools"
                  className="min-h-[44px] flex items-center px-3 rounded-md text-[15px] font-medium hover:bg-muted text-foreground"
                >
                  Free tools
                </Link>
                <Link
                  href="/pricing"
                  className="min-h-[44px] flex items-center px-3 rounded-md text-[15px] font-medium hover:bg-muted text-foreground"
                >
                  Pricing
                </Link>

                <div className="h-px bg-border my-2" />

                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-3 py-1">
                  Docs &amp; Help
                </div>
                <Link
                  href="/docs"
                  className="min-h-[44px] flex items-center px-3 rounded-md text-[15px] font-medium hover:bg-muted text-foreground"
                >
                  Developer Docs
                </Link>
                <Link
                  href="/blog"
                  className="min-h-[44px] flex items-center px-3 rounded-md text-[15px] font-medium hover:bg-muted text-foreground"
                >
                  Blog &amp; Guides
                </Link>
                <Link
                  href="/status"
                  className="min-h-[44px] flex items-center px-3 rounded-md text-[15px] font-medium hover:bg-muted text-foreground"
                >
                  System Status
                </Link>
              </nav>

              {/* Mobile Auth Bottom CTA */}
              <div className="pt-4 border-t border-border space-y-2">
                {isSignedIn ? (
                  <Button asChild className="w-full min-h-[44px] text-xs font-semibold bg-primary text-primary-foreground">
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild className="w-full min-h-[44px] text-xs font-semibold bg-primary text-primary-foreground">
                      <Link href="/#shortener">Create free link</Link>
                    </Button>
                    <SignInButton mode="modal">
                      <Button variant="outline" className="w-full min-h-[44px] text-xs font-medium">
                        Sign in
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
