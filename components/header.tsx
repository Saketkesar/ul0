"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { BrandLogo } from "@/components/brand-logo"
import { UL0Icon } from "@/components/ul0-icon"
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
    <header className="sticky top-0 z-50 h-16 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex h-full items-center justify-between px-4 sm:px-6 max-w-7xl">
        {/* Left: Brand Logo (goes home) */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2" aria-label="UL0 Homepage">
            <BrandLogo height={28} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 text-[14px] font-medium text-muted-foreground" aria-label="Main Navigation">
            {/* Product Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors inline-flex items-center gap-1.5 outline-none cursor-pointer">
                <span>Product</span>
                <UL0Icon name="arrowdown" size={10} className="opacity-70" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 p-1.5 rounded-xl border border-border shadow-md">
                <DropdownMenuItem asChild>
                  <Link href="/#shortener" className="flex items-center gap-2.5 py-2 cursor-pointer rounded-lg">
                    <UL0Icon name="link" size={18} />
                    <div>
                      <div className="text-xs font-semibold text-foreground">Short Links</div>
                      <div className="text-[11px] text-muted-foreground">307 fast temporary redirects</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/qr" className="flex items-center gap-2.5 py-2 cursor-pointer rounded-lg">
                    <UL0Icon name="qr" size={18} />
                    <div>
                      <div className="text-xs font-semibold text-foreground">Vector QR Codes</div>
                      <div className="text-[11px] text-muted-foreground">Dynamic SVG and PNG</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/custom-domain-landing" className="flex items-center gap-2.5 py-2 cursor-pointer rounded-lg">
                    <UL0Icon name="domain" size={18} />
                    <div>
                      <div className="text-xs font-semibold text-foreground">Custom Domains</div>
                      <div className="text-[11px] text-muted-foreground">1 domain included free</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/features" className="flex items-center gap-2.5 py-2 cursor-pointer rounded-lg">
                    <UL0Icon name="analytics" size={18} />
                    <div>
                      <div className="text-xs font-semibold text-foreground">Click Analytics</div>
                      <div className="text-[11px] text-muted-foreground">Cookieless privacy metrics</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Compare */}
            <Link
              href="/compare"
              className={`px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors ${
                pathname.startsWith("/compare") ? "text-foreground font-semibold" : ""
              }`}
            >
              Compare
            </Link>

            {/* Free tools */}
            <Link
              href="/tools"
              className={`px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors ${
                pathname.startsWith("/tools") ? "text-foreground font-semibold" : ""
              }`}
            >
              Free tools
            </Link>

            {/* Pricing */}
            <Link
              href="/pricing"
              className={`px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors ${
                pathname === "/pricing" ? "text-foreground font-semibold" : ""
              }`}
            >
              Pricing
            </Link>

            {/* Docs and help Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors inline-flex items-center gap-1.5 outline-none cursor-pointer">
                <span>Docs &amp; Help</span>
                <UL0Icon name="arrowdown" size={10} className="opacity-70" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 p-1.5 rounded-xl border border-border shadow-md">
                <DropdownMenuItem asChild>
                  <Link href="/docs" className="flex items-center gap-2 py-2 cursor-pointer rounded-lg">
                    <UL0Icon name="docs" size={16} />
                    <span className="text-xs font-medium text-foreground">Developer Docs</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/blog" className="flex items-center gap-2 py-2 cursor-pointer rounded-lg">
                    <UL0Icon name="blog" size={16} />
                    <span className="text-xs font-medium text-foreground">Blog &amp; Guides</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/status" className="flex items-center gap-2 py-2 cursor-pointer rounded-lg">
                    <UL0Icon name="status" size={16} />
                    <span className="text-xs font-medium text-foreground">System Status</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/icons" className="flex items-center gap-2 py-2 cursor-pointer rounded-lg">
                    <UL0Icon name="palette" size={16} />
                    <span className="text-xs font-medium text-foreground">Our Icons</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="h-9 w-9 p-0 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
          >
            <UL0Icon name="palette" size={18} />
          </button>

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
                <Button variant="ghost" size="sm" className="h-9 text-xs font-medium text-foreground hover:bg-muted/60 rounded-full">
                  Log in
                </Button>
              </SignInButton>

              <Button asChild size="sm" className="h-9 text-xs font-semibold px-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs">
                <Link href="/sign-up">Get started</Link>
              </Button>
            </div>
          )}

          {/* Mobile Sheet Trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="md:hidden h-9 w-9 p-0 flex items-center justify-center rounded-lg text-foreground hover:bg-muted cursor-pointer"
                aria-label="Open mobile menu"
              >
                <UL0Icon name="tools" size={20} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80 p-6 flex flex-col justify-between">
              <SheetHeader className="text-left border-b border-border pb-4">
                <SheetTitle className="flex items-center gap-2">
                  <BrandLogo height={24} />
                </SheetTitle>
              </SheetHeader>

              {/* Mobile Nav Links */}
              <nav className="flex-1 py-6 flex flex-col gap-1 overflow-y-auto" aria-label="Mobile Navigation">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-3 py-1">
                  Product
                </div>
                <Link
                  href="/#shortener"
                  className="min-h-[44px] flex items-center gap-2.5 px-3 rounded-lg text-[15px] font-medium hover:bg-muted text-foreground"
                >
                  <UL0Icon name="link" size={18} />
                  <span>Short Links</span>
                </Link>
                <Link
                  href="/qr"
                  className="min-h-[44px] flex items-center gap-2.5 px-3 rounded-lg text-[15px] font-medium hover:bg-muted text-foreground"
                >
                  <UL0Icon name="qr" size={18} />
                  <span>Vector QR Codes</span>
                </Link>
                <Link
                  href="/custom-domain-landing"
                  className="min-h-[44px] flex items-center gap-2.5 px-3 rounded-lg text-[15px] font-medium hover:bg-muted text-foreground"
                >
                  <UL0Icon name="domain" size={18} />
                  <span>Custom Domains</span>
                </Link>

                <div className="h-px bg-border my-2" />

                <Link
                  href="/compare"
                  className="min-h-[44px] flex items-center gap-2.5 px-3 rounded-lg text-[15px] font-medium hover:bg-muted text-foreground"
                >
                  <UL0Icon name="compare" size={18} />
                  <span>Compare</span>
                </Link>
                <Link
                  href="/tools"
                  className="min-h-[44px] flex items-center gap-2.5 px-3 rounded-lg text-[15px] font-medium hover:bg-muted text-foreground"
                >
                  <UL0Icon name="tools" size={18} />
                  <span>Free tools</span>
                </Link>
                <Link
                  href="/pricing"
                  className="min-h-[44px] flex items-center gap-2.5 px-3 rounded-lg text-[15px] font-medium hover:bg-muted text-foreground"
                >
                  <UL0Icon name="pricing" size={18} />
                  <span>Pricing</span>
                </Link>

                <div className="h-px bg-border my-2" />

                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-3 py-1">
                  Docs &amp; Help
                </div>
                <Link
                  href="/docs"
                  className="min-h-[44px] flex items-center gap-2.5 px-3 rounded-lg text-[15px] font-medium hover:bg-muted text-foreground"
                >
                  <UL0Icon name="docs" size={18} />
                  <span>Developer Docs</span>
                </Link>
                <Link
                  href="/blog"
                  className="min-h-[44px] flex items-center gap-2.5 px-3 rounded-lg text-[15px] font-medium hover:bg-muted text-foreground"
                >
                  <UL0Icon name="blog" size={18} />
                  <span>Blog &amp; Guides</span>
                </Link>
                <Link
                  href="/status"
                  className="min-h-[44px] flex items-center gap-2.5 px-3 rounded-lg text-[15px] font-medium hover:bg-muted text-foreground"
                >
                  <UL0Icon name="status" size={18} />
                  <span>System Status</span>
                </Link>
                <Link
                  href="/icons"
                  className="min-h-[44px] flex items-center gap-2.5 px-3 rounded-lg text-[15px] font-medium hover:bg-muted text-foreground"
                >
                  <UL0Icon name="palette" size={18} />
                  <span>Our Icons &amp; Colors</span>
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
