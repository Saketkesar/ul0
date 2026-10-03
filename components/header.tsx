"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useMemo } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
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
  Scissors,
  BookOpen,
  Search,
  ExternalLink,
  ShieldCheck,
  Tag,
} from "lucide-react"
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const allNavLinks = useMemo(
    () => [
      { name: "URL Shortener", href: "/", category: "Products", icon: Link2, desc: "Fast 301 link shortening" },
      { name: "Branded Custom Domains", href: "/pricing", category: "Products", icon: Globe, desc: "Connect your custom domain" },
      { name: "Vector QR Generator", href: "/qr", category: "Products", icon: QrCode, desc: "Custom colors & vector SVG" },
      { name: "Click Analytics", href: "/features", category: "Products", icon: BarChart3, desc: "Real-time geolocation & devices" },
      { name: "UTM Campaign Builder", href: "/utm", category: "Products", icon: LinkIcon, desc: "Google Analytics attribution" },
      { name: "PDF Page Splitter", href: "/tools/pdf-splitter", category: "Tools", icon: Scissors, badge: "New", desc: "Extract & download single PDF pages" },
      { name: "301 Redirect Checker", href: "/tools/redirect-checker", category: "Tools", icon: ArrowRightLeft, desc: "Audit redirect chains & headers" },
      { name: "URL Expander & Safety", href: "/tools/url-expander", category: "Tools", icon: Maximize2, desc: "Inspect hidden destinations safely" },
      { name: "Social Card Previewer", href: "/tools/og-preview", category: "Tools", icon: Share2, desc: "Test OpenGraph & Twitter cards" },
      { name: "Meta Tag Generator", href: "/tools/meta-tag-generator", category: "Tools", icon: Code, desc: "Generate SEO & social metadata" },
      { name: "JSON Formatter", href: "/json", category: "Tools", icon: FileJson, desc: "Validate & beautify JSON" },
      { name: "Startups & SaaS", href: "/use-cases/startups", category: "Solutions", icon: Rocket, desc: "Developer API & branded links" },
      { name: "Marketing Agencies", href: "/use-cases/marketing-agencies", category: "Solutions", icon: Briefcase, desc: "Client attribution & campaigns" },
      { name: "Creators & Influencers", href: "/use-cases/creators", category: "Solutions", icon: Video, desc: "Bio links & social tracking" },
      { name: "Small Businesses", href: "/use-cases/small-business", category: "Solutions", icon: Building2, desc: "Simple SMS & print marketing" },
      { name: "E-Commerce & Retail", href: "/use-cases/ecommerce", category: "Solutions", icon: ShoppingBag, desc: "Product link attribution" },
      { name: "Real Estate Agents", href: "/use-cases/real-estate", category: "Solutions", icon: Home, desc: "Yard sign QR codes & flyers" },
      { name: "US Growth Blog & Guides", href: "/blog", category: "Resources", icon: BookOpen, desc: "Bitly alternatives & SEO guides" },
      { name: "Backlinks & Partner Directory", href: "/backlinks", category: "Resources", icon: Link2, badge: "Notion", desc: "Aesthetic badge exchange" },
      { name: "Changelog & Updates", href: "/changelog", category: "Resources", icon: Zap, desc: "Latest releases and features" },
      { name: "Pricing & Plans", href: "/pricing", category: "Resources", icon: Tag, desc: "Free & Pro tier options" },
    ],
    []
  )

  const filteredLinks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return []
    return allNavLinks.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q)
    )
  }, [searchQuery, allNavLinks])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Left: Brand Logo + Version Badge */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2" aria-label="UL0 Link Management Home">
            <Image
              src="/ul0.png"
              alt="UL0 Logo"
              width={76}
              height={28}
              className="h-7 w-auto object-contain"
              priority
            />
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
            v2.5
          </span>
        </div>

        {/* Center: Desktop Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-muted-foreground" aria-label="Main navigation">
          {/* 1. Products Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-2.5 py-1.5 transition-colors hover:bg-accent hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span>Product</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80 p-2 shadow-lg">
              <DropdownMenuLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1">
                Link Platform
              </DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <Link2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">URL Shortener</div>
                    <div className="text-[11px] text-muted-foreground">High-performance 301 redirects with zero ads</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/pricing" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <Globe className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">Branded Custom Domains</div>
                    <div className="text-[11px] text-muted-foreground">Connect your own custom root or sub-domain</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/qr" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <QrCode className="h-4 w-4 text-foreground mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">Vector QR Codes</div>
                    <div className="text-[11px] text-muted-foreground">Custom colors, precision SVGs, and tracking</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/features" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <BarChart3 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">Real-Time Analytics</div>
                    <div className="text-[11px] text-muted-foreground">Device, country, browser, and referrer stats</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/utm" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <LinkIcon className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">UTM Campaign Builder</div>
                    <div className="text-[11px] text-muted-foreground">Google Analytics and Meta Ads attribution</div>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 2. Solutions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-2.5 py-1.5 transition-colors hover:bg-accent hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span>Solutions</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80 p-2 shadow-lg">
              <DropdownMenuItem asChild>
                <Link href="/use-cases" className="flex items-center gap-2 p-2 rounded-lg font-semibold text-primary cursor-pointer">
                  <Compass className="h-4 w-4" />
                  <span>All Use Cases &amp; Solutions</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/use-cases/startups" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <Rocket className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">Startups &amp; Developers</div>
                    <div className="text-[11px] text-muted-foreground">REST API, webhook relays, and branded links</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/use-cases/marketing-agencies" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <Briefcase className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">Marketing Agencies</div>
                    <div className="text-[11px] text-muted-foreground">Multi-client campaign tracking &amp; clean reporting</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/use-cases/creators" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <Video className="h-4 w-4 text-pink-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">Creators &amp; Influencers</div>
                    <div className="text-[11px] text-muted-foreground">Bio links, YouTube &amp; TikTok attribution</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/use-cases/ecommerce" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <ShoppingBag className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">E-Commerce &amp; SMS</div>
                    <div className="text-[11px] text-muted-foreground">Short SMS links, discounts, and checkout tracking</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/use-cases/real-estate" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <Home className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">Real Estate Agents</div>
                    <div className="text-[11px] text-muted-foreground">Yard signs, flyers, and property QR codes</div>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 3. Free Web & SEO Tools Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-2.5 py-1.5 transition-colors hover:bg-accent hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span>Free Tools</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Free
              </span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80 p-2 shadow-lg">
              <DropdownMenuItem asChild>
                <Link href="/tools" className="flex items-center gap-2 p-2 rounded-lg font-semibold text-primary cursor-pointer">
                  <Sparkles className="h-4 w-4" />
                  <span>Free Tools Directory</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1">
                Popular Utilities
              </DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/tools/pdf-splitter" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <Scissors className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <span>PDF Page Splitter</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-primary/10 text-primary font-bold">NEW</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">Extract &amp; download single PDF pages line-by-line</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tools/redirect-checker" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <ArrowRightLeft className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">301 Redirect Checker</div>
                    <div className="text-[11px] text-muted-foreground">Inspect HTTP status codes &amp; redirect hops</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tools/url-expander" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <Maximize2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">URL Expander &amp; Safety</div>
                    <div className="text-[11px] text-muted-foreground">Reveal destination behind shortened links safely</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tools/og-preview" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <Share2 className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">Social Card Previewer</div>
                    <div className="text-[11px] text-muted-foreground">Test OpenGraph &amp; Twitter card images</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tools/meta-tag-generator" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <Code className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">Meta Tag Generator</div>
                    <div className="text-[11px] text-muted-foreground">Generate copy-paste SEO meta tags</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/json" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <FileJson className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">JSON Formatter</div>
                    <div className="text-[11px] text-muted-foreground">Validate, prettify, and inspect JSON payloads</div>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 4. Blog & Growth Guides */}
          <Link
            href="/blog"
            className="rounded-md px-2.5 py-1.5 transition-colors hover:bg-accent hover:text-foreground"
          >
            Blog
          </Link>

          {/* 5. Backlinks Directory */}
          <Link
            href="/backlinks"
            className="flex items-center gap-1 rounded-md px-2.5 py-1.5 transition-colors hover:bg-accent hover:text-foreground"
          >
            <span>Backlinks</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono">
              Notion
            </span>
          </Link>

          {/* 6. Pricing */}
          <Link
            href="/pricing"
            className="rounded-md px-2.5 py-1.5 transition-colors hover:bg-accent hover:text-foreground"
          >
            Pricing
          </Link>
        </nav>

        {/* Right: Auth Controls & Mobile Menu Trigger */}
        <div className="flex items-center gap-2">
          {/* Desktop Auth */}
          <div className="hidden sm:flex items-center gap-2">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 shadow-xs cursor-pointer">
                  Get Started Free
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-primary" />
                <span>Dashboard</span>
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-7 w-7",
                  },
                }}
              />
            </Show>
          </div>

          {/* Mobile Menu Trigger via Sheet */}
          <div className="lg:hidden flex items-center gap-1.5">
            <Show when="signed-in">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-7 w-7",
                  },
                }}
              />
            </Show>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open Navigation Menu"
                  className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors border border-border/60"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-sm p-0 flex flex-col justify-between">
                <SheetHeader className="p-4 border-b border-border flex flex-row items-center justify-between space-y-0">
                  <SheetTitle className="text-left flex items-center gap-2">
                    <Image
                      src="/ul0.png"
                      alt="UL0"
                      width={64}
                      height={24}
                      className="h-6 w-auto object-contain"
                    />
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-muted-foreground">
                      Navigation
                    </span>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Scrollable Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-5">
                  {/* Instant Search in Menu */}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search tools, use cases, guides..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border bg-muted/40 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Filtered Search Results */}
                  {searchQuery ? (
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground pb-1">
                        Matching Results ({filteredLinks.length})
                      </div>
                      {filteredLinks.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-2">No matching links found.</p>
                      ) : (
                        filteredLinks.map((item) => {
                          const Icon = item.icon
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => {
                                setMobileOpen(false)
                                setSearchQuery("")
                              }}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-accent text-xs font-medium text-foreground transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4 text-primary shrink-0" />
                                <div>
                                  <div className="font-semibold">{item.name}</div>
                                  <div className="text-[10px] text-muted-foreground">{item.desc}</div>
                                </div>
                              </div>
                              {item.badge && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          )
                        })
                      )}
                    </div>
                  ) : (
                    /* Default Grouped Mobile Sections */
                    <>
                      {/* Quick Action Shortcuts */}
                      <div className="grid grid-cols-2 gap-2 pb-2">
                        <Link
                          href="/"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:border-primary/50 transition-colors shadow-2xs"
                        >
                          <Link2 className="h-4 w-4 text-primary" />
                          <span>Shorten URL</span>
                        </Link>
                        <Link
                          href="/tools/pdf-splitter"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:border-primary/50 transition-colors shadow-2xs"
                        >
                          <Scissors className="h-4 w-4 text-primary" />
                          <span>PDF Splitter</span>
                        </Link>
                      </div>

                      {/* Section 1: Core Platform */}
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2">
                          Core Platform
                        </div>
                        <Link
                          href="/"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg text-xs font-medium hover:bg-accent text-foreground"
                        >
                          <div className="flex items-center gap-2">
                            <Link2 className="h-4 w-4 text-muted-foreground" />
                            <span>URL Shortener</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground">301 Redirects</span>
                        </Link>
                        <Link
                          href="/features"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg text-xs font-medium hover:bg-accent text-foreground"
                        >
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            <span>Features &amp; Analytics</span>
                          </div>
                        </Link>
                        <Link
                          href="/pricing"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg text-xs font-medium hover:bg-accent text-foreground"
                        >
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-blue-500" />
                            <span>Custom Domains &amp; Pricing</span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-600 font-bold">$0 Free</span>
                        </Link>
                        <Link
                          href="/qr"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg text-xs font-medium hover:bg-accent text-foreground"
                        >
                          <div className="flex items-center gap-2">
                            <QrCode className="h-4 w-4 text-muted-foreground" />
                            <span>Vector QR Generator</span>
                          </div>
                        </Link>
                      </div>

                      {/* Section 2: Free SEO & Web Tools */}
                      <div className="space-y-1 pt-2 border-t border-border">
                        <div className="flex items-center justify-between px-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Free Tools &amp; PDF
                          </span>
                          <Link
                            href="/tools"
                            onClick={() => setMobileOpen(false)}
                            className="text-[10px] font-semibold text-primary hover:underline"
                          >
                            View All →
                          </Link>
                        </div>
                        <Link
                          href="/tools/pdf-splitter"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg text-xs font-medium bg-primary/5 hover:bg-primary/10 text-foreground"
                        >
                          <div className="flex items-center gap-2">
                            <Scissors className="h-4 w-4 text-primary" />
                            <span className="font-semibold">PDF Page Splitter</span>
                          </div>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-primary/10 text-primary font-bold">
                            NEW
                          </span>
                        </Link>
                        <Link
                          href="/tools/redirect-checker"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium hover:bg-accent text-foreground"
                        >
                          <ArrowRightLeft className="h-4 w-4 text-blue-500" />
                          <span>301 Redirect Checker</span>
                        </Link>
                        <Link
                          href="/tools/url-expander"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium hover:bg-accent text-foreground"
                        >
                          <Maximize2 className="h-4 w-4 text-emerald-500" />
                          <span>URL Expander &amp; Safety</span>
                        </Link>
                        <Link
                          href="/tools/og-preview"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium hover:bg-accent text-foreground"
                        >
                          <Share2 className="h-4 w-4 text-purple-500" />
                          <span>Social Card Previewer</span>
                        </Link>
                        <Link
                          href="/utm"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium hover:bg-accent text-foreground"
                        >
                          <LinkIcon className="h-4 w-4 text-cyan-500" />
                          <span>UTM Campaign Builder</span>
                        </Link>
                      </div>

                      {/* Section 3: Solutions & Resources */}
                      <div className="space-y-1 pt-2 border-t border-border">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2">
                          Resources &amp; Growth
                        </div>
                        <Link
                          href="/blog"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg text-xs font-medium hover:bg-accent text-foreground"
                        >
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-indigo-500" />
                            <span>US Growth Blog &amp; Guides</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground">SEO</span>
                        </Link>
                        <Link
                          href="/backlinks"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg text-xs font-medium hover:bg-accent text-foreground"
                        >
                          <div className="flex items-center gap-2">
                            <Link2 className="h-4 w-4 text-muted-foreground" />
                            <span>Notion Backlinks Directory</span>
                          </div>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono">
                            Dofollow
                          </span>
                        </Link>
                        <Link
                          href="/use-cases"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium hover:bg-accent text-foreground"
                        >
                          <Compass className="h-4 w-4 text-muted-foreground" />
                          <span>All Solutions Hub</span>
                        </Link>
                        <Link
                          href="/changelog"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium hover:bg-accent text-foreground"
                        >
                          <Zap className="h-4 w-4 text-muted-foreground" />
                          <span>Changelog</span>
                        </Link>
                      </div>
                    </>
                  )}
                </div>

                {/* Bottom Dock: Auth Buttons */}
                <div className="p-4 border-t border-border bg-muted/20">
                  <Show when="signed-out">
                    <div className="grid grid-cols-2 gap-2">
                      <SignInButton mode="modal">
                        <button
                          onClick={() => setMobileOpen(false)}
                          className="w-full py-2 px-3 text-xs font-semibold rounded-lg border border-border hover:bg-accent text-foreground transition-colors cursor-pointer"
                        >
                          Sign In
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button
                          onClick={() => setMobileOpen(false)}
                          className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors shadow-xs cursor-pointer"
                        >
                          Get Started
                        </button>
                      </SignUpButton>
                    </div>
                  </Show>
                  <Show when="signed-in">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors shadow-xs"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Go to Dashboard</span>
                    </Link>
                  </Show>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
