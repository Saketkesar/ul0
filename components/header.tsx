"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
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
import {
  ChevronDown,
  Menu,
  BarChart3,
  ExternalLink,
  MessageCircle,
  Scissors,
  Users,
  QrCode,
  Globe,
  ArrowRightLeft,
  LinkIcon,
  Maximize2,
  FileText,
  Share2,
  Code,
  Wifi,
} from "lucide-react"
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  // Ensure clean light mode for public site
  useEffect(() => {
    try {
      if (!window.location.pathname.startsWith("/dashboard")) {
        document.documentElement.classList.remove("dark")
      }
    } catch {}
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-xs">
      <div className="container mx-auto flex h-13 items-center justify-between px-4 sm:px-6">
        {/* Left: Minimal Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group" aria-label="UL0 Home">
            <Image
              src="/ul0.png"
              alt="UL0"
              width={64}
              height={24}
              className="h-6 w-auto object-contain"
              priority
            />
            <span className="text-[11px] font-mono text-muted-foreground px-1.5 py-0.5 rounded border border-border/60 bg-muted/40 hidden sm:inline-block">
              tools
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Bar (Notion Minimalist) */}
        <nav
          className="hidden md:flex items-center gap-1 text-xs font-medium text-muted-foreground"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            className="rounded-md px-3 py-1.5 transition-colors hover:bg-muted hover:text-foreground"
          >
            Shorten
          </Link>

          <Link
            href="/qr"
            className="rounded-md px-3 py-1.5 transition-colors hover:bg-muted hover:text-foreground"
          >
            QR Codes
          </Link>

          <Link
            href="/files"
            className="rounded-md px-3 py-1.5 transition-colors hover:bg-muted hover:text-foreground font-semibold text-foreground flex items-center gap-1.5"
          >
            <span>Files &amp; PDF</span>
            <span className="text-[10px] bg-foreground text-background font-mono px-1.5 py-0.2 rounded font-bold">
              App
            </span>
          </Link>

          <Link
            href="/split"
            className="rounded-md px-3 py-1.5 transition-colors hover:bg-muted hover:text-foreground"
          >
            Split Bill
          </Link>

          <Link
            href="/custom-domain-landing"
            className="rounded-md px-3 py-1.5 transition-colors hover:bg-muted hover:text-foreground"
          >
            Domains
          </Link>

          <Link
            href="/pricing"
            className="rounded-md px-3 py-1.5 transition-colors hover:bg-muted hover:text-foreground"
          >
            Pricing
          </Link>

          {/* More Tools Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-3 py-1.5 transition-colors hover:bg-muted hover:text-foreground outline-none cursor-pointer">
              <span>More</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 p-1.5 shadow-md">
              <DropdownMenuItem asChild>
                <Link href="/whatsapp" className="flex items-center gap-2 p-2 rounded text-xs cursor-pointer">
                  <MessageCircle className="h-3.5 w-3.5 text-foreground/70" />
                  <div>
                    <div className="font-medium text-foreground">WhatsApp Link &amp; QR</div>
                    <div className="text-[10px] text-muted-foreground">wa.me chat links with message</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tools/redirect-checker" className="flex items-center gap-2 p-2 rounded text-xs cursor-pointer">
                  <ArrowRightLeft className="h-3.5 w-3.5 text-foreground/70" />
                  <div>
                    <div className="font-medium text-foreground">301 Redirect Checker</div>
                    <div className="text-[10px] text-muted-foreground">Audit HTTP redirect chains</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tools/url-expander" className="flex items-center gap-2 p-2 rounded text-xs cursor-pointer">
                  <Maximize2 className="h-3.5 w-3.5 text-foreground/70" />
                  <div>
                    <div className="font-medium text-foreground">URL Expander</div>
                    <div className="text-[10px] text-muted-foreground">Inspect destination behind short links</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/utm" className="flex items-center gap-2 p-2 rounded text-xs cursor-pointer">
                  <LinkIcon className="h-3.5 w-3.5 text-foreground/70" />
                  <div>
                    <div className="font-medium text-foreground">UTM Builder</div>
                    <div className="text-[10px] text-muted-foreground">Campaign tracking attribution</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/wifi" className="flex items-center gap-2 p-2 rounded text-xs cursor-pointer">
                  <Wifi className="h-3.5 w-3.5 text-foreground/70" />
                  <div>
                    <div className="font-medium text-foreground">WiFi QR Code</div>
                    <div className="text-[10px] text-muted-foreground">One-scan Wi-Fi access code</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/docs" className="flex items-center gap-2 p-2 rounded text-xs cursor-pointer">
                  <FileText className="h-3.5 w-3.5 text-foreground/70" />
                  <span>Developer API Docs</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/compare" className="flex items-center gap-2 p-2 rounded text-xs cursor-pointer">
                  <Globe className="h-3.5 w-3.5 text-foreground/70" />
                  <span>Compare vs Bitly &amp; TinyURL</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right: Auth Controls & Mobile Menu */}
        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <button className="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-md bg-foreground px-3 py-1 text-xs font-medium text-background hover:bg-foreground/90 transition-colors cursor-pointer">
                  Get Started
                </button>
              </SignUpButton>
            </div>
          </Show>

          <Show when="signed-in">
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium hover:bg-muted transition-colors text-foreground"
              >
                <BarChart3 className="h-3 w-3" />
                <span>Dashboard</span>
              </Link>
              <UserButton />
            </div>
          </Show>

          {/* Mobile Sheet Trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                className="md:hidden p-1.5 rounded-md hover:bg-muted text-foreground transition-colors cursor-pointer"
                aria-label="Open Navigation Menu"
              >
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-5 space-y-6">
              <SheetHeader>
                <SheetTitle className="text-left flex items-center gap-2 text-sm font-semibold">
                  <Image src="/ul0.png" alt="UL0" width={56} height={20} className="h-5 w-auto" />
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-1 text-xs font-medium text-foreground">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="px-2.5 py-2 rounded-md hover:bg-muted"
                >
                  URL Shortener
                </Link>
                <Link
                  href="/qr"
                  onClick={() => setMobileOpen(false)}
                  className="px-2.5 py-2 rounded-md hover:bg-muted"
                >
                  Vector QR Codes
                </Link>
                <Link
                  href="/files"
                  onClick={() => setMobileOpen(false)}
                  className="px-2.5 py-2 rounded-md hover:bg-muted font-semibold flex items-center justify-between"
                >
                  <span>Files &amp; PDF Tools</span>
                  <span className="text-[10px] bg-foreground text-background px-1.5 py-0.2 rounded font-mono">
                    PWA App
                  </span>
                </Link>
                <Link
                  href="/split"
                  onClick={() => setMobileOpen(false)}
                  className="px-2.5 py-2 rounded-md hover:bg-muted"
                >
                  Split Bill
                </Link>
                <Link
                  href="/custom-domain-landing"
                  onClick={() => setMobileOpen(false)}
                  className="px-2.5 py-2 rounded-md hover:bg-muted"
                >
                  Custom Domains
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setMobileOpen(false)}
                  className="px-2.5 py-2 rounded-md hover:bg-muted"
                >
                  Pricing
                </Link>

                <div className="pt-2 mt-2 border-t border-border/60">
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider px-2.5 mb-1">
                    Utilities
                  </div>
                  <Link
                    href="/whatsapp"
                    onClick={() => setMobileOpen(false)}
                    className="px-2.5 py-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground block"
                  >
                    WhatsApp Link &amp; QR
                  </Link>
                  <Link
                    href="/tools/redirect-checker"
                    onClick={() => setMobileOpen(false)}
                    className="px-2.5 py-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground block"
                  >
                    301 Redirect Checker
                  </Link>
                  <Link
                    href="/utm"
                    onClick={() => setMobileOpen(false)}
                    className="px-2.5 py-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground block"
                  >
                    UTM Campaign Builder
                  </Link>
                  <Link
                    href="/wifi"
                    onClick={() => setMobileOpen(false)}
                    className="px-2.5 py-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground block"
                  >
                    WiFi QR Code
                  </Link>
                  <Link
                    href="/docs"
                    onClick={() => setMobileOpen(false)}
                    className="px-2.5 py-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground block"
                  >
                    API Documentation
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
