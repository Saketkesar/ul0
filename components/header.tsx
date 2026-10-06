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
  Video,
  ShoppingBag,
  Rocket,
  ArrowRightLeft,
  Maximize2,
  Share2,
  Code,
  LinkIcon,
  FileJson,
  ScanLine,
  Menu,
  Sparkles,
  Scissors,
  BookOpen,
  Search,
  Users,
  ShieldCheck,
  Tag,
  Wifi,
} from "lucide-react"
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const allNavLinks = useMemo(
    () => [
      { name: "URL Shortener", href: "/", category: "Link Tools", icon: Link2, desc: "Fast 301 link shortening with no signup" },
      { name: "Split Expenses & UPI", href: "/split", category: "Utilities", icon: Users, badge: "Popular", desc: "Split bills and calculate group dues with UPI QR" },
      { name: "PDF Page Splitter", href: "/tools/pdf-splitter", category: "PDF Tools", icon: Scissors, badge: "New", desc: "Extract & download single PDF pages line-by-line" },
      { name: "PDF Scanner & Document Tools", href: "/pdf", category: "PDF Tools", icon: ScanLine, desc: "Scan, crop, merge and manage PDFs" },
      { name: "Vector QR Code Generator", href: "/qr", category: "Link Tools", icon: QrCode, desc: "Create high-res trackable QR codes" },
      { name: "WiFi QR Code Maker", href: "/wifi", category: "Link Tools", icon: Wifi, desc: "Generate instant connect WiFi QR codes" },
      { name: "Branded Custom Domains", href: "/custom-domain-landing", category: "Link Tools", icon: Globe, desc: "Connect your own custom root or sub-domain" },
      { name: "Real-Time Click Analytics", href: "/features", category: "Link Tools", icon: BarChart3, desc: "Track country, device, browser, and referrers" },
      { name: "UTM Campaign Builder", href: "/utm", category: "Marketing", icon: LinkIcon, desc: "Google Analytics & Meta Ads campaign builder" },
      { name: "301 Redirect Checker", href: "/tools/redirect-checker", category: "Utilities", icon: ArrowRightLeft, desc: "Audit redirect chains, status codes & hops" },
      { name: "URL Expander & Safety", href: "/tools/url-expander", category: "Utilities", icon: Maximize2, desc: "Inspect hidden destination URLs safely" },
      { name: "Social Card Previewer", href: "/tools/og-preview", category: "Marketing", icon: Share2, desc: "Preview OpenGraph & Twitter card images" },
      { name: "Meta Tag Generator", href: "/tools/meta-tag-generator", category: "Marketing", icon: Code, desc: "Generate search & social meta tags" },
      { name: "JSON Formatter", href: "/json", category: "Utilities", icon: FileJson, desc: "Validate, prettify, and inspect JSON" },
      { name: "Free Backlinks & Badges", href: "/backlinks", category: "Growth", icon: Link2, desc: "Aesthetic badge exchange and dofollow backlinks" },
      { name: "SEO & Growth Blog", href: "/blog", category: "Resources", icon: BookOpen, desc: "Link shortening guides, Bitly alternatives, and QR marketing" },
      { name: "Startups & Developers", href: "/use-cases/startups", category: "Solutions", icon: Rocket, desc: "API access, webhook relays, and custom links" },
      { name: "Marketing Agencies", href: "/use-cases/marketing-agencies", category: "Solutions", icon: Briefcase, desc: "Multi-client campaigns and link tracking" },
      { name: "Creators & Influencers", href: "/use-cases/creators", category: "Solutions", icon: Video, desc: "Social bio links and video attribution" },
      { name: "Pricing & Custom Domains", href: "/pricing", category: "Pricing", icon: Tag, desc: "Free tier and custom domain plans" },
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
        {/* Left: Original Brand Logo (Preserved as requested) */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group" aria-label="UL0 Link Management Home">
            <Image
              src="/ul0.png"
              alt="UL0 Logo"
              width={76}
              height={28}
              className="h-7 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Center: Desktop Navigation Bar with Prominent Tools */}
        <nav className="hidden xl:flex items-center gap-1 text-sm font-medium text-muted-foreground" aria-label="Main navigation">
          {/* 1. URL Shortener */}
          <Link
            href="/"
            className="rounded-md px-2.5 py-1.5 transition-colors hover:bg-accent hover:text-foreground flex items-center gap-1.5"
          >
            <Link2 className="h-4 w-4 text-primary" />
            <span>Shorten</span>
          </Link>

          {/* 2. Custom Domains (Direct to money page) */}
          <Link
            href="/custom-domain-landing"
            className="rounded-md px-2.5 py-1.5 transition-colors hover:bg-accent hover:text-foreground flex items-center gap-1.5"
          >
            <Globe className="h-4 w-4 text-primary" />
            <span>Custom Domains</span>
          </Link>

          {/* 3. Vector QR Generator */}
          <Link
            href="/qr"
            className="rounded-md px-2.5 py-1.5 transition-colors hover:bg-accent hover:text-foreground flex items-center gap-1.5"
          >
            <QrCode className="h-4 w-4 text-muted-foreground" />
            <span>QR Codes</span>
          </Link>

          {/* 4. Use Cases Solutions */}
          <Link
            href="/use-cases"
            className="rounded-md px-2.5 py-1.5 transition-colors hover:bg-accent hover:text-foreground flex items-center gap-1.5"
          >
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span>Use Cases</span>
          </Link>

          {/* 5. Free Tools Dropdown (Includes Split, PDF, UTM, WiFi, etc.) */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-2.5 py-1.5 transition-colors hover:bg-accent hover:text-foreground outline-none">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <span>Free Tools</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80 p-2 shadow-lg max-h-[85vh] overflow-y-auto">
              <DropdownMenuItem asChild>
                <Link href="/tools" className="flex items-center gap-2 p-2 rounded-lg font-semibold text-primary cursor-pointer">
                  <Sparkles className="h-4 w-4" />
                  <span>Free Tools Directory</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/split" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <Users className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <span>Split Expenses &amp; UPI</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">Popular</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">Split bills &amp; calculate dues with UPI QR</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tools/pdf-splitter" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <Scissors className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <span>PDF Page Splitter</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-primary/10 text-primary font-bold">NEW</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">Extract single pages line-by-line</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/pdf" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <ScanLine className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">PDF Scanner &amp; Tools</div>
                    <div className="text-[11px] text-muted-foreground">Scan with camera, merge &amp; rename documents</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/utm" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <LinkIcon className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">UTM Campaign Builder</div>
                    <div className="text-[11px] text-muted-foreground">Google Analytics &amp; Meta Ads attribution</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tools/redirect-checker" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <ArrowRightLeft className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">301 Redirect Checker</div>
                    <div className="text-[11px] text-muted-foreground">Audit HTTP status codes &amp; redirect hops</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tools/url-expander" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <Maximize2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">URL Expander &amp; Safety</div>
                    <div className="text-[11px] text-muted-foreground">Inspect destination behind short links</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/wifi" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <Wifi className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">WiFi QR Code Maker</div>
                    <div className="text-[11px] text-muted-foreground">Generate 1-scan WiFi access codes</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/json" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <FileJson className="h-4 w-4 text-sky-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">JSON Formatter</div>
                    <div className="text-[11px] text-muted-foreground">Validate, prettify &amp; minify JSON</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tools/og-preview" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <Share2 className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">Social Card Previewer</div>
                    <div className="text-[11px] text-muted-foreground">Test OpenGraph &amp; Twitter card previews</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tools/meta-tag-generator" className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer">
                  <Code className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">Meta Tag Generator</div>
                    <div className="text-[11px] text-muted-foreground">Generate SEO &amp; social metadata</div>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 6. Pricing */}
          <Link
            href="/pricing"
            className="rounded-md px-2.5 py-1.5 transition-colors hover:bg-accent hover:text-foreground"
          >
            Pricing
          </Link>

          {/* 7. Blog */}
          <Link
            href="/blog"
            className="rounded-md px-2.5 py-1.5 transition-colors hover:bg-accent hover:text-foreground"
          >
            Blog
          </Link>
        </nav>

        {/* Right: Auth Controls & Mobile Menu Trigger */}
        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <div className="hidden sm:flex items-center gap-2">
              <SignInButton mode="modal">
                <button className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 cursor-pointer">
                  Get Started Free
                </button>
              </SignUpButton>
            </div>
          </Show>

          <Show when="signed-in">
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
              >
                <BarChart3 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-7 w-7",
                  },
                }}
              />
            </div>
          </Show>

          {/* Mobile Menu Trigger via Sheet */}
          <div className="xl:hidden flex items-center">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open Navigation Menu"
                  className="rounded-lg h-9 w-9 flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors border border-border/60"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[88vw] max-w-sm p-0 flex flex-col justify-between">
                <SheetHeader className="p-4 border-b border-border flex flex-row items-center justify-between space-y-0">
                  <SheetTitle className="text-left flex items-center gap-2">
                    <Image
                      src="/ul0.png"
                      alt="UL0 Logo"
                      width={64}
                      height={24}
                      className="h-6 w-auto object-contain"
                    />
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Scrollable Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Instant Search in Menu */}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search tools, split, pdf, qr..."
                      className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-muted/40 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
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
                        <div className="text-xs text-muted-foreground py-4 text-center">
                          No tools found matching &quot;{searchQuery}&quot;
                        </div>
                      ) : (
                        filteredLinks.map((item) => (
                          <Link
                            key={item.href + item.name}
                            href={item.href}
                            onClick={() => {
                              setSearchQuery("")
                              setMobileOpen(false)
                            }}
                            className="flex items-start gap-2.5 p-2 rounded-lg text-xs hover:bg-accent text-foreground transition-colors"
                          >
                            <item.icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <div>
                              <div className="font-semibold flex items-center gap-1.5">
                                <span>{item.name}</span>
                                {item.badge && (
                                  <span className="text-[9px] px-1 py-0.2 rounded bg-primary/10 text-primary font-bold">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-muted-foreground line-clamp-1">{item.desc}</div>
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
                  ) : (
                    /* Default Grouped Mobile Sections */
                    <>
                      {/* Prominent Quick Shortcuts: 4 Essential Tools */}
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">
                          Quick Launch Tools
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href="/"
                            onClick={() => setMobileOpen(false)}
                            className="flex flex-col gap-1 p-3 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors shadow-2xs"
                          >
                            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                              <Link2 className="h-4 w-4 text-primary shrink-0" />
                              <span>Shorten URL</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground">301 Redirects</span>
                          </Link>

                          <Link
                            href="/split"
                            onClick={() => setMobileOpen(false)}
                            className="flex flex-col gap-1 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500 transition-colors shadow-2xs"
                          >
                            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                              <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span>Split Expenses</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground">UPI QR &amp; Groups</span>
                          </Link>

                          <Link
                            href="/tools/pdf-splitter"
                            onClick={() => setMobileOpen(false)}
                            className="flex flex-col gap-1 p-3 rounded-xl border border-primary/30 bg-primary/5 hover:border-primary transition-colors shadow-2xs"
                          >
                            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                              <Scissors className="h-4 w-4 text-primary shrink-0" />
                              <span>PDF Splitter</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground">Single Page Extract</span>
                          </Link>

                          <Link
                            href="/qr"
                            onClick={() => setMobileOpen(false)}
                            className="flex flex-col gap-1 p-3 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors shadow-2xs"
                          >
                            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                              <QrCode className="h-4 w-4 text-foreground shrink-0" />
                              <span>QR Codes</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground">Vector QR Maker</span>
                          </Link>
                        </div>
                      </div>

                      {/* Section 1: All Free Web & Developer Tools */}
                      <div className="space-y-1 pt-2 border-t border-border">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            All Developer &amp; Web Tools
                          </span>
                          <Link
                            href="/tools"
                            onClick={() => setMobileOpen(false)}
                            className="text-[10px] font-semibold text-primary hover:underline"
                          >
                            View Directory →
                          </Link>
                        </div>

                        <Link
                          href="/split"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg text-xs font-medium hover:bg-accent text-foreground"
                        >
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-emerald-500" />
                            <span className="font-semibold">Split Expenses &amp; UPI QR</span>
                          </div>
                          <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-600 font-bold">
                            POPULAR
                          </span>
                        </Link>

                        <Link
                          href="/tools/pdf-splitter"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg text-xs font-medium hover:bg-accent text-foreground"
                        >
                          <div className="flex items-center gap-2">
                            <Scissors className="h-4 w-4 text-primary" />
                            <span>PDF Page Splitter</span>
                          </div>
                          <span className="text-[9px] px-1 py-0.2 rounded bg-primary/10 text-primary font-bold">
                            NEW
                          </span>
                        </Link>

                        <Link
                          href="/pdf"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium hover:bg-accent text-foreground"
                        >
                          <ScanLine className="h-4 w-4 text-emerald-500" />
                          <span>PDF Scanner &amp; Document Tools</span>
                        </Link>

                        <Link
                          href="/tools/redirect-checker"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium hover:bg-accent text-foreground"
                        >
                          <ArrowRightLeft className="h-4 w-4 text-blue-500" />
                          <span>301 HTTP Redirect Checker</span>
                        </Link>

                        <Link
                          href="/tools/url-expander"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium hover:bg-accent text-foreground"
                        >
                          <Maximize2 className="h-4 w-4 text-emerald-500" />
                          <span>URL Expander &amp; Safety Inspector</span>
                        </Link>

                        <Link
                          href="/utm"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium hover:bg-accent text-foreground"
                        >
                          <LinkIcon className="h-4 w-4 text-purple-500" />
                          <span>UTM Campaign Builder</span>
                        </Link>

                        <Link
                          href="/tools/og-preview"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium hover:bg-accent text-foreground"
                        >
                          <Share2 className="h-4 w-4 text-indigo-500" />
                          <span>Social Card Previewer</span>
                        </Link>

                        <Link
                          href="/json"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium hover:bg-accent text-foreground"
                        >
                          <FileJson className="h-4 w-4 text-sky-500" />
                          <span>JSON Formatter &amp; Validator</span>
                        </Link>

                        <Link
                          href="/wifi"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium hover:bg-accent text-foreground"
                        >
                          <Wifi className="h-4 w-4 text-rose-500" />
                          <span>WiFi QR Code Maker</span>
                        </Link>
                      </div>

                      {/* Section 2: Platform & Resources */}
                      <div className="space-y-1 pt-2 border-t border-border">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">
                          Platform &amp; Growth
                        </div>
                        <Link
                          href="/pricing"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg text-xs font-medium hover:bg-accent text-foreground"
                        >
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-blue-500" />
                            <span>Branded Custom Domains</span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-600 font-bold">$0 Free</span>
                        </Link>
                        <Link
                          href="/backlinks"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg text-xs font-medium hover:bg-accent text-foreground"
                        >
                          <div className="flex items-center gap-2">
                            <Link2 className="h-4 w-4 text-muted-foreground" />
                            <span>Free Dofollow Backlinks</span>
                          </div>
                        </Link>
                        <Link
                          href="/blog"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg text-xs font-medium hover:bg-accent text-foreground"
                        >
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span>SEO &amp; Growth Blog</span>
                          </div>
                        </Link>
                        <Link
                          href="/features"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg text-xs font-medium hover:bg-accent text-foreground"
                        >
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            <span>Click Analytics &amp; Tracking</span>
                          </div>
                        </Link>
                      </div>
                    </>
                  )}
                </div>

                {/* Mobile Drawer Bottom Auth */}
                <div className="p-4 border-t border-border bg-muted/20 space-y-2">
                  <Show when="signed-out">
                    <SignInButton mode="modal">
                      <button
                        onClick={() => setMobileOpen(false)}
                        className="w-full py-2.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground hover:bg-accent transition-colors"
                      >
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button
                        onClick={() => setMobileOpen(false)}
                        className="w-full py-2.5 rounded-xl bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
                      >
                        Get Started Free
                      </button>
                    </SignUpButton>
                  </Show>
                  <Show when="signed-in">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="w-full py-2.5 rounded-xl bg-primary text-xs font-semibold text-primary-foreground flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>Open Dashboard</span>
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
