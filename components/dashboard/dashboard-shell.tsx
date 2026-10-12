"use client"

import React, { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { UserButton } from "@clerk/nextjs"
import {
  LayoutDashboard,
  Link2,
  Globe,
  BarChart3,
  QrCode,
  Megaphone,
  Key,
  CreditCard,
  Settings,
  ShieldCheck,
  Search,
  Plus,
  Moon,
  Sun,
  Menu,
  X,
  Command,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  FolderOpen,
} from "lucide-react"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { CreateLinkButton } from "@/app/dashboard/create-link-button"
import type { PlanSlug, PlanLimits } from "@/lib/plans"

interface DomainItem {
  $id: string
  domain: string
  status: "unverified" | "verified" | "failed"
}

interface DashboardShellProps {
  children: React.ReactNode
  user: {
    firstName?: string | null
    email?: string | null
    imageUrl?: string | null
  }
  plan: {
    slug: PlanSlug
    limits: PlanLimits
    label: string
  }
  domainsUsage: {
    count: number
    max: number
  }
  domainLinksUsage: {
    count: number
    max: number
  }
  isAdmin: boolean
  verifiedDomains: DomainItem[]
}

export function DashboardShell({
  children,
  user,
  plan,
  domainsUsage,
  domainLinksUsage,
  isAdmin,
  verifiedDomains,
}: DashboardShellProps) {
  const pathname = usePathname()
  const router = useRouter()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  // Initialize theme from localStorage, cookies, or system preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme")
      const cookieMatch = document.cookie.match(/(?:^|; )theme=([^;]*)/)
      const cookieTheme = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null
      const theme = stored || cookieTheme
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      const isDarkMode = theme === "dark" || (!theme && prefersDark) || document.documentElement.classList.contains("dark")
      setIsDark(isDarkMode)
      if (isDarkMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    } catch {
      setIsDark(document.documentElement.classList.contains("dark"))
    }

    return () => {
      // If user navigates away from the dashboard, ensure dark mode is stripped from public pages
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/dashboard")) {
        document.documentElement.classList.remove("dark")
      }
    }
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
      window.dispatchEvent(new CustomEvent("theme-change", { detail: { theme: nextDark ? "dark" : "light" } }))
    } catch (e) {
      console.error("Theme toggle error:", e)
    }
  }

  // Keyboard shortcuts handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      const target = e.target as HTMLElement
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return
      }

      // Cmd+K or Ctrl+K or '/' -> Command palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setCommandOpen((prev) => !prev)
        return
      }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setCommandOpen(true)
        return
      }

      // '?' -> Shortcuts dialog
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setShortcutsOpen((prev) => !prev)
        return
      }

      // 'c' -> Create Link
      if (e.key === "c" && !e.metaKey && !e.ctrlKey) {
        // Trigger create button dialog
        const createBtn = document.getElementById("dashboard-create-link-trigger")
        if (createBtn) {
          e.preventDefault()
          createBtn.click()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Close mobile menu upon route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  interface NavItem {
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    external?: boolean
    badge?: string
  }

  interface NavGroup {
    group: string
    items: NavItem[]
  }

  const navigation: NavGroup[] = [
    {
      group: "Main",
      items: [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Links", href: "/dashboard/links", icon: Link2 },
        { name: "Domains", href: "/dashboard/domains", icon: Globe },
        { name: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
      ],
    },
    {
      group: "Developers",
      items: [
        { name: "API Keys", href: "/dashboard/keys", icon: Key },
        { name: "REST API Docs", href: "/docs", icon: ExternalLink, external: true },
      ],
    },
    {
      group: "Account",
      items: [
        { name: "Billing & Plans", href: "/dashboard/billing", icon: CreditCard },
      ],
    },
    ...(isAdmin
      ? [
          {
            group: "Exclusive",
            items: [
              { name: "Dynamic QR Studio", href: "/dashboard/qr-studio", icon: QrCode, badge: "No Ads" },
              { name: "Marketing Engine", href: "/dashboard/marketing", icon: ShieldCheck, badge: "Admin" },
              { name: "SEO & Radar", href: "/dashboard/seo", icon: BarChart3, badge: "Admin" },
            ],
          },
        ]
      : []),
  ]

  // Calculate usage percentages
  const domainsPercent =
    domainsUsage.max === Infinity || domainsUsage.max === 0
      ? 0
      : Math.min(100, Math.round((domainsUsage.count / domainsUsage.max) * 100))

  const linksPercent =
    domainLinksUsage.max === Infinity || domainLinksUsage.max === 0
      ? 0
      : Math.min(100, Math.round((domainLinksUsage.count / domainLinksUsage.max) * 100))

  const isHighUsage = domainsPercent >= 80 || linksPercent >= 80

  const planBadgeStyle =
    plan.slug === "business_user"
      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 border-slate-700"
      : plan.slug === "pro_user"
      ? "bg-primary/10 text-primary border-primary/20"
      : "bg-muted text-muted-foreground border-border"

  const renderNavItems = () => (
    <div className="space-y-6">
      {navigation.map((section) => (
        <div key={section.group}>
          <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            {section.group}
          </div>
          <div className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`)

              return item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span>{item.name}</span>
                  </div>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-primary/20 text-primary">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-surface-1 text-foreground flex flex-col antialiased selection:bg-primary/20 selection:text-primary">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 h-14 border-b border-border bg-surface-1/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open sidebar menu"
            className="md:hidden h-9 w-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Desktop UL0 Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 mr-2">
            <Image
              src="/ul0.png"
              alt="UL0 Logo"
              width={64}
              height={22}
              className="h-6 w-auto object-contain dark:brightness-110"
              priority
            />
          </Link>

          {/* Plan badge */}
          <span
            className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${planBadgeStyle}`}
          >
            {plan.label} Plan
          </span>
        </div>

        {/* Global Search / Command Bar Trigger */}
        <div className="flex-1 max-w-md hidden sm:block">
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="w-full flex items-center justify-between gap-3 px-3 py-1.5 rounded-lg border border-border bg-surface-2 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5" />
              <span>Search links, domains, or commands...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-border bg-surface-3 text-[10px] font-mono text-muted-foreground">
              <Command className="h-2.5 w-2.5" /> K
            </kbd>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Primary Create Link button */}
          <div id="dashboard-create-link-wrapper">
            <CreateLinkButton verifiedDomains={verifiedDomains} />
          </div>

          {/* Theme switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle light and dark mode"
            className="h-9 w-9 rounded-lg border border-border bg-surface-2 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shadow-2xs"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Keyboard shortcuts trigger */}
          <button
            type="button"
            onClick={() => setShortcutsOpen(true)}
            aria-label="Keyboard shortcuts"
            className="hidden sm:flex h-9 w-9 rounded-lg border border-border bg-surface-2 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shadow-2xs"
            title="Keyboard shortcuts (?)"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* Clerk Profile */}
          <div className="shrink-0 flex items-center">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8 rounded-lg border border-border",
                },
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Left Sidebar */}
        <aside className="hidden md:flex w-60 shrink-0 flex-col justify-between border-r border-border bg-surface-1 p-4 overflow-y-auto">
          {renderNavItems()}

          {/* Persistent Usage & Upgrade Chip */}
          <div className="mt-8 pt-4 border-t border-border/80">
            <div className="rounded-xl border border-border bg-surface-2 p-3 space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Usage &amp; Limits</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-medium border ${planBadgeStyle}`}>
                  {plan.label}
                </span>
              </div>

              {/* Domains meter */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Custom Domains</span>
                  <span>
                    {domainsUsage.count} / {domainsUsage.max === Infinity ? "∞" : domainsUsage.max}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      domainsPercent >= 80 ? "bg-amber-500" : "bg-primary"
                    }`}
                    style={{ width: `${domainsUsage.max === Infinity ? 10 : Math.max(5, domainsPercent)}%` }}
                  />
                </div>
              </div>

              {/* Domain Links meter */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Domain Short Links</span>
                  <span>
                    {domainLinksUsage.count} / {domainLinksUsage.max === Infinity ? "∞" : domainLinksUsage.max}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      linksPercent >= 80 ? "bg-amber-500" : "bg-primary"
                    }`}
                    style={{ width: `${domainLinksUsage.max === Infinity ? 10 : Math.max(5, linksPercent)}%` }}
                  />
                </div>
              </div>

              {/* Contextual Upgrade Action */}
              {plan.slug === "free_user" && (
                <Link
                  href="/dashboard/billing"
                  className="w-full mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-all"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Upgrade to Pro ($3)</span>
                </Link>
              )}

              {plan.slug === "pro_user" && isHighUsage && (
                <Link
                  href="/dashboard/billing"
                  className="w-full mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white transition-all"
                >
                  <AlertTriangle className="h-3 w-3" />
                  <span>Upgrade to Business</span>
                </Link>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-background/80 backdrop-blur-sm flex">
            <div className="w-[80vw] max-w-xs bg-surface-1 border-r border-border p-5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <Image
                      src="/ul0.png"
                      alt="UL0 Logo"
                      width={64}
                      height={22}
                      className="h-6 w-auto object-contain dark:brightness-110"
                    />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {renderNavItems()}
              </div>

              <div className="pt-4 border-t border-border text-xs text-muted-foreground">
                <p>Plan: <span className="font-semibold text-foreground">{plan.label}</span></p>
                <Link href="/dashboard/billing" className="text-primary hover:underline font-medium mt-1 inline-block">
                  Manage plan &amp; billing →
                </Link>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto bg-surface-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>

      {/* Global Command Palette Dialog */}
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() => {
                router.push("/dashboard")
                setCommandOpen(false)
              }}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Overview</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/dashboard/links")
                setCommandOpen(false)
              }}
            >
              <Link2 className="mr-2 h-4 w-4" />
              <span>All Short Links</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/dashboard/domains")
                setCommandOpen(false)
              }}
            >
              <Globe className="mr-2 h-4 w-4" />
              <span>Custom Domains</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/dashboard/campaigns")
                setCommandOpen(false)
              }}
            >
              <Megaphone className="mr-2 h-4 w-4" />
              <span>Campaigns &amp; UTM</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/dashboard/keys")
                setCommandOpen(false)
              }}
            >
              <Key className="mr-2 h-4 w-4" />
              <span>Developer API Keys</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/dashboard/billing")
                setCommandOpen(false)
              }}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing &amp; Subscription</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Quick Actions">
            <CommandItem
              onSelect={() => {
                setCommandOpen(false)
                toggleTheme()
              }}
            >
              {isDark ? <Sun className="mr-2 h-4 w-4 text-amber-400" /> : <Moon className="mr-2 h-4 w-4" />}
              <span>Toggle Light / Dark Theme</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setCommandOpen(false)
                const createBtn = document.getElementById("dashboard-create-link-trigger")
                if (createBtn) createBtn.click()
              }}
            >
              <Plus className="mr-2 h-4 w-4 text-primary" />
              <span>Create New Short Link</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Keyboard Shortcuts Dialog */}
      <Dialog open={shortcutsOpen} onOpenChange={setShortcutsOpen}>
        <DialogContent className="max-w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Keyboard Shortcuts</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Speed up your workflow using these standard shortcuts.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-border">
              <span className="text-muted-foreground">Open Command Palette</span>
              <kbd className="px-2 py-0.5 rounded bg-muted font-mono font-bold text-foreground">⌘ K or /</kbd>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border">
              <span className="text-muted-foreground">Create New Link</span>
              <kbd className="px-2 py-0.5 rounded bg-muted font-mono font-bold text-foreground">C</kbd>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border">
              <span className="text-muted-foreground">View Keyboard Shortcuts</span>
              <kbd className="px-2 py-0.5 rounded bg-muted font-mono font-bold text-foreground">?</kbd>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
