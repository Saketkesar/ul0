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
} from "lucide-react"
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="ul0 - Free URL Shortener Home">
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
            href="/qr"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            QR Code
          </Link>
          <Link
            href="/split"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Split
          </Link>
          <Link
            href="/claude-hub"
            className="rounded-md px-3 py-2 text-sm font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 transition-all flex items-center gap-1.5"
          >
            <span>Claude Hub</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-sky-500 text-white font-bold">PRO</span>
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
              Tools
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="text-xs text-muted-foreground">Developer Tools</DropdownMenuLabel>

              <DropdownMenuItem asChild>
                <Link href="/utm" className="flex items-center gap-2 cursor-pointer">
                  <LinkIcon className="h-4 w-4" />
                  UTM Builder
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/json" className="flex items-center gap-2 cursor-pointer">
                  <FileJson className="h-4 w-4" />
                  JSON Formatter
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Study & Desk Setup</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/clock" className="flex items-center gap-2 cursor-pointer">
                  <Clock className="h-4 w-4" />
                  Aesthetic Clock
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/ambient" className="flex items-center gap-2 cursor-pointer">
                  <Volume2 className="h-4 w-4" />
                  Ambient Sounds
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/countdown" className="flex items-center gap-2 cursor-pointer">
                  <Hourglass className="h-4 w-4" />
                  Countdown Creator
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/quotes" className="flex items-center gap-2 cursor-pointer">
                  <Quote className="h-4 w-4" />
                  Motivational Quotes
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/worldclock" className="flex items-center gap-2 cursor-pointer">
                  <Globe className="h-4 w-4" />
                  World Clock
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/pomodoro" className="flex items-center gap-2 cursor-pointer">
                  <Timer className="h-4 w-4" />
                  Pomodoro Timer
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Other</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/buy" className="flex items-center gap-2 cursor-pointer">
                  <ShoppingCart className="h-4 w-4" />
                  Should I Buy This?
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/wifi" className="flex items-center gap-2 cursor-pointer">
                  <QrCode className="h-4 w-4" />
                  WiFi QR Generator
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
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-1">
          {[
            { href: "/", label: "Shortener", icon: <Link2 className="h-4 w-4" /> },
            { href: "/qr", label: "QR Code", icon: <QrCode className="h-4 w-4" /> },
            { href: "/split", label: "Split Expenses", icon: <Users className="h-4 w-4" /> },
            { href: "/pricing", label: "Pricing", icon: <ShoppingCart className="h-4 w-4" /> },
            { href: "/utm", label: "UTM Builder", icon: <LinkIcon className="h-4 w-4" /> },
            { href: "/json", label: "JSON Formatter", icon: <FileJson className="h-4 w-4" /> },
            { href: "/clock", label: "Aesthetic Clock", icon: <Clock className="h-4 w-4" /> },
            { href: "/pomodoro", label: "Pomodoro Timer", icon: <Timer className="h-4 w-4" /> },
            { href: "/ambient", label: "Ambient Sounds", icon: <Volume2 className="h-4 w-4" /> },
            { href: "/worldclock", label: "World Clock", icon: <Globe className="h-4 w-4" /> },
            { href: "/wifi", label: "WiFi QR Generator", icon: <QrCode className="h-4 w-4" /> },
          ].map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              {icon}
              {label}
            </Link>
          ))}

          <div className="pt-2 border-t border-border">
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
