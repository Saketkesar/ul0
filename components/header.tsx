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
  Users,
  Timer,
  FileJson,
  LinkIcon,
  Clock,
  Volume2,
  Hourglass,
  Quote,
  Globe,
  ShoppingCart,
  ScanLine,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Wifi,
} from "lucide-react"
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="ul0 - Free URL Shortener Home">
          <Image
            src="/ul0.png"
            alt="ul0 - Free URL Shortener Logo"
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
            href="/qr-code-generator"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            QR Generator
          </Link>
          <Link
            href="/utm-builder"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            UTM Builder
          </Link>
          <Link
            href="/wifi-qr-code-generator"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            WiFi QR
          </Link>
          <Link
            href="/pricing"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Pricing
          </Link>

          {/* More Tools Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground flex items-center gap-1">
              More Tools
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="text-xs text-muted-foreground">Productivity & Utilities</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/split" className="flex items-center gap-2 cursor-pointer">
                  <Users className="h-4 w-4" />
                  Split Expenses
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/pdf" className="flex items-center gap-2 cursor-pointer">
                  <ScanLine className="h-4 w-4" />
                  PDF Document Tools
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/json" className="flex items-center gap-2 cursor-pointer">
                  <FileJson className="h-4 w-4" />
                  JSON Formatter
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/clock" className="flex items-center gap-2 cursor-pointer">
                  <Clock className="h-4 w-4" />
                  Aesthetic Clock
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/pomodoro" className="flex items-center gap-2 cursor-pointer">
                  <Timer className="h-4 w-4" />
                  Pomodoro Timer
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
                afterSignOutUrl="/"
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
              afterSignOutUrl="/"
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
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-1 max-h-[85vh] overflow-y-auto">
          {[
            { href: "/", label: "URL Shortener", icon: <Link2 className="h-4 w-4" /> },
            { href: "/qr-code-generator", label: "QR Code Generator", icon: <QrCode className="h-4 w-4" /> },
            { href: "/utm-builder", label: "UTM Campaign Builder", icon: <LinkIcon className="h-4 w-4" /> },
            { href: "/wifi-qr-code-generator", label: "WiFi QR Generator", icon: <Wifi className="h-4 w-4" /> },
            { href: "/pricing", label: "Pricing & Custom Domains", icon: <ShoppingCart className="h-4 w-4" /> },
            { href: "/split", label: "Split Expenses", icon: <Users className="h-4 w-4" /> },
            { href: "/pdf", label: "PDF Scanner Tools", icon: <ScanLine className="h-4 w-4" /> },
            { href: "/json", label: "JSON Formatter", icon: <FileJson className="h-4 w-4" /> },
            { href: "/blog", label: "Guides & Blog", icon: <Quote className="h-4 w-4" /> },
          ].map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              {icon}
              {label}
            </Link>
          ))}

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
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
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
