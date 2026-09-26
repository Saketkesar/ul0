"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  ChevronDown,
  Link2,
  QrCode,
  Globe,
  BarChart3,
  Building2,
  Briefcase,
  Home,
  UtensilsCrossed,
  Video,
  ShoppingBag,
  Rocket,
  Calendar,
  Compass,
  ArrowRightLeft,
  Maximize2,
  Share2,
  Code,
  LinkIcon,
  FileJson,
  ScanLine,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
  Zap,
} from "lucide-react"
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="UL0 Link Management Home">
          <Image
            src="/ul0.png"
            alt="UL0 Logo"
            width={80}
            height={30}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Shortener
          </Link>

          <Link
            href="/features"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Features
          </Link>

          {/* Use Cases Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground flex items-center gap-1">
              Use Cases
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuItem asChild>
                <Link href="/use-cases" className="flex items-center gap-2 font-semibold text-primary cursor-pointer">
                  <Compass className="h-4 w-4" />
                  View All Solutions
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/use-cases/marketing-agencies" className="flex items-center gap-2 cursor-pointer">
                  <Briefcase className="h-4 w-4 text-purple-500" />
                  Marketing Agencies
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/use-cases/small-business" className="flex items-center gap-2 cursor-pointer">
                  <Building2 className="h-4 w-4 text-blue-500" />
                  Small Businesses
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/use-cases/ecommerce" className="flex items-center gap-2 cursor-pointer">
                  <ShoppingBag className="h-4 w-4 text-emerald-500" />
                  E-Commerce &amp; SMS
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/use-cases/creators" className="flex items-center gap-2 cursor-pointer">
                  <Video className="h-4 w-4 text-pink-500" />
                  Creators &amp; Influencers
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/use-cases/real-estate" className="flex items-center gap-2 cursor-pointer">
                  <Home className="h-4 w-4 text-amber-500" />
                  Real Estate Agents
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/use-cases/restaurants" className="flex items-center gap-2 cursor-pointer">
                  <UtensilsCrossed className="h-4 w-4 text-red-500" />
                  Restaurants &amp; Hospitality
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/use-cases/startups" className="flex items-center gap-2 cursor-pointer">
                  <Rocket className="h-4 w-4 text-indigo-500" />
                  Startups &amp; Developers
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/use-cases/events" className="flex items-center gap-2 cursor-pointer">
                  <Calendar className="h-4 w-4 text-cyan-500" />
                  Events &amp; Conferences
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Free Web & Dev Tools Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground flex items-center gap-1">
              Tools
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuItem asChild>
                <Link href="/tools" className="flex items-center gap-2 font-semibold text-primary cursor-pointer">
                  <Sparkles className="h-4 w-4" />
                  Free Tools Directory
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                Link &amp; SEO Tools
              </DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/tools/redirect-checker" className="flex items-center gap-2 cursor-pointer">
                  <ArrowRightLeft className="h-4 w-4 text-blue-500" />
                  Redirect Checker (301/302)
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tools/url-expander" className="flex items-center gap-2 cursor-pointer">
                  <Maximize2 className="h-4 w-4 text-emerald-500" />
                  URL Expander &amp; Safety
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tools/og-preview" className="flex items-center gap-2 cursor-pointer">
                  <Share2 className="h-4 w-4 text-purple-500" />
                  Social Card Previewer
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tools/meta-tag-generator" className="flex items-center gap-2 cursor-pointer">
                  <Code className="h-4 w-4 text-indigo-500" />
                  Meta Tag Generator
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/utm" className="flex items-center gap-2 cursor-pointer">
                  <LinkIcon className="h-4 w-4 text-cyan-500" />
                  UTM Campaign Builder
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                Developer Utilities
              </DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/qr" className="flex items-center gap-2 cursor-pointer">
                  <QrCode className="h-4 w-4 text-foreground" />
                  Vector QR Generator
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/json" className="flex items-center gap-2 cursor-pointer">
                  <FileJson className="h-4 w-4 text-amber-500" />
                  JSON Formatter
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/pdf" className="flex items-center gap-2 cursor-pointer">
                  <ScanLine className="h-4 w-4 text-red-500" />
                  PDF Tools
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/qr"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            QR Code
          </Link>

          <Link
            href="/pricing"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Pricing
          </Link>

          <Link
            href="/changelog"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Changelog
          </Link>

          {/* Auth Controls */}
          <div className="flex items-center gap-2 ml-2 border-l border-border pl-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  Sign up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                  },
                }}
              />
            </Show>
          </div>
        </nav>

        {/* Mobile Right: Auth + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
          </Show>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-2 max-h-[85vh] overflow-y-auto">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-3 pt-1">
            Product
          </div>
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Link2 className="h-4 w-4" /> Shortener
          </Link>
          <Link
            href="/features"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Zap className="h-4 w-4" /> Features
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <BarChart3 className="h-4 w-4" /> Pricing &amp; Plans
          </Link>
          <Link
            href="/qr"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <QrCode className="h-4 w-4" /> Vector QR Generator
          </Link>

          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-3 pt-3">
            Solutions &amp; Use Cases
          </div>
          <Link
            href="/use-cases"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-accent"
          >
            <Compass className="h-4 w-4" /> All Use Cases Hub
          </Link>
          <Link
            href="/use-cases/marketing-agencies"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Briefcase className="h-4 w-4" /> Marketing Agencies
          </Link>
          <Link
            href="/use-cases/small-business"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Building2 className="h-4 w-4" /> Small Business
          </Link>
          <Link
            href="/use-cases/ecommerce"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <ShoppingBag className="h-4 w-4" /> E-Commerce &amp; SMS
          </Link>
          <Link
            href="/use-cases/creators"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Video className="h-4 w-4" /> Creators &amp; Influencers
          </Link>

          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-3 pt-3">
            Free Web &amp; SEO Tools
          </div>
          <Link
            href="/tools"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-accent"
          >
            <Sparkles className="h-4 w-4" /> Free Tools Directory
          </Link>
          <Link
            href="/tools/redirect-checker"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <ArrowRightLeft className="h-4 w-4" /> Redirect Checker
          </Link>
          <Link
            href="/tools/url-expander"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Maximize2 className="h-4 w-4" /> URL Expander
          </Link>
          <Link
            href="/tools/og-preview"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Share2 className="h-4 w-4" /> Social Card Previewer
          </Link>
          <Link
            href="/tools/meta-tag-generator"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Code className="h-4 w-4" /> Meta Tag Generator
          </Link>

          <div className="pt-3 border-t border-border">
            <Show when="signed-out">
              <div className="flex gap-2">
                <SignInButton mode="modal">
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Sign up
                  </button>
                </SignUpButton>
              </div>
            </Show>
            <Show when="signed-in">
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </Show>
          </div>
        </div>
      )}
    </header>
  )
}
