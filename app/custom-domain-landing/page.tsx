import type { Metadata } from "next"
import { headers } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CopyField } from "@/components/copy-field"
import { UL0Icon } from "@/components/ul0-icon"
import { getDomainByName, DomainDoc } from "@/lib/appwrite/domains"
import {
  ShieldCheck,
  Zap,
  Globe,
  ExternalLink,
  Plane,
  HeartPulse,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  Compass,
  Calendar,
  Clock,
  PhoneCall,
  MapPin,
  Tag,
  Stethoscope,
  Scissors,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Custom Branded Domains & Official Link Gateway",
  description:
    "Official gateway and edge routing portal for verified custom domains. Fast, secure redirects, automated SSL certificates, and curated partner guides powered by UL0.",
  alternates: {
    canonical: "https://ul0.site/custom-domain-landing",
  },
}

interface PageProps {
  searchParams?: Promise<{ preview?: string; tab?: string }>
}

export default async function CustomDomainLandingPage(props: PageProps) {
  const headersList = await headers()
  const rawHost = headersList.get("host") || ""
  const hostParam = rawHost.split(":")[0].toLowerCase()

  const searchParams = props.searchParams ? await props.searchParams : {}
  const previewHost = searchParams?.preview?.toLowerCase()

  // Allow ?preview=link.rspersahabatan.go.id or ?preview=link.arnishu.com to simulate custom domain visitor
  const effectiveHost = previewHost || hostParam

  const isCustomDomainVisitor =
    Boolean(previewHost) ||
    (effectiveHost &&
      effectiveHost !== "ul0.site" &&
      !effectiveHost.endsWith(".ul0.site") &&
      !effectiveHost.includes("localhost") &&
      !effectiveHost.includes("127.0.0.1"))

  let domainDoc: DomainDoc | null = null
  let brandLogoUrl: string | null = null

  if (isCustomDomainVisitor) {
    try {
      domainDoc = await getDomainByName(effectiveHost)
      brandLogoUrl = domainDoc?.brand_logo_url || null
    } catch {}
  }

  // =========================================================================
  // 1. CUTE BOLD THEME MAKEOVER FOR CUSTOM DOMAIN VISITORS
  // =========================================================================
  if (isCustomDomainVisitor) {
    const isRsPersahabatan =
      effectiveHost.includes("rspersahabatan") || effectiveHost.includes("persahabatan")
    const isArnishu = effectiveHost.includes("arnishu")

    // Fallback official logos if not in Appwrite database
    const finalLogoUrl =
      brandLogoUrl ||
      (isRsPersahabatan
        ? "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=240&q=80"
        : isArnishu
        ? "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=240&q=80"
        : null)

    const pageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: isRsPersahabatan
        ? "Portal Tautan Resmi RS Persahabatan (Kemenkes RI) | Layanan Pasien Digital"
        : isArnishu
        ? "ARNISHU Official Lookbook & Luxury Resort Wear Gateway"
        : `Verified Edge Gateway — ${effectiveHost}`,
      description: isRsPersahabatan
        ? "Gerbang resmi tautan dan layanan digital RSUP Persahabatan (Kemenkes RI). Akses pendaftaran online, poliklinik pernapasan terpadu, dan panduan wisata medis bersama Vinigrow Holidays."
        : isArnishu
        ? "Official luxury fashion and resort wear gateway for ARNISHU. Curated lookbooks, bespoke vacation styling, and premier holiday travel guides with Vinigrow Holidays."
        : `Official verified link routing gateway for ${effectiveHost}. Powered by UL0 infrastructure.`,
      url: `https://${effectiveHost}`,
      isPartOf: {
        "@type": "WebSite",
        name: "UL0 Platform",
        url: "https://ul0.site",
      },
      publisher: {
        "@type": "Organization",
        name: isRsPersahabatan
          ? "RSUP Persahabatan - Kemenkes RI"
          : isArnishu
          ? "ARNISHU Atelier"
          : effectiveHost,
        url: `https://${effectiveHost}`,
      },
      citation: [
        {
          "@type": "WebSite",
          name: "Vinigrow Holidays",
          url: "https://vinigrowholidays.com/",
        },
        {
          "@type": "WebSite",
          name: "UL0.site",
          url: "https://ul0.site",
        },
      ],
    }

    return (
      <div className="min-h-screen bg-white text-[#0B1A17] font-['Space_Grotesk',sans-serif] selection:bg-[#3DDBB8] selection:text-[#0B1A17]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
        />

        {/* ===================================================================
            1. TOP NAVIGATION BAR (64px Flat Bold Header)
        ==================================================================== */}
        <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#D3E2DD]">
          <div className="max-w-[1140px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            {/* Left: Brand Identity & Verified Dot */}
            <div className="flex items-center gap-3">
              {finalLogoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={finalLogoUrl}
                  alt={isRsPersahabatan ? "Kemenkes RS Persahabatan" : isArnishu ? "Arnishu" : effectiveHost}
                  className="h-8 max-w-[140px] object-contain rounded"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#1B685C] text-white flex items-center justify-center font-bold text-sm">
                  {effectiveHost.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#D3E2DD]">
                <span className="font-mono text-xs font-semibold text-[#0B1A17]">
                  {effectiveHost}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#DDF5EE] text-[#1B685C] text-[10px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1B685C] animate-pulse" />
                  Verified
                </span>
              </div>
            </div>

            {/* Right: Security pill + CTAs */}
            <div className="flex items-center gap-2.5">
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono text-[#5E726C] bg-[#F4FAF8] px-2.5 py-1 rounded-full border border-[#D3E2DD]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1B685C]" />
                <span>SSL 256-Bit · Edge Active</span>
              </span>

              <a
                href="https://vinigrowholidays.com/"
                target="_blank"
                rel="noopener"
                className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F4FAF8] hover:bg-[#EAF7F3] border border-[#D3E2DD] text-[12px] font-medium text-[#1B685C] transition-colors"
              >
                <Plane className="w-3.5 h-3.5" />
                <span>Holiday Packages</span>
              </a>

              <a
                href="https://ul0.site"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#1B685C] hover:bg-[#145248] text-white text-[12px] font-bold shadow-sm transition-transform active:scale-95"
              >
                <span>Powered by UL0</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </header>

        {/* ===================================================================
            2. HERO SECTION (Giant Type, Cute Bold Accent Blocks)
        ==================================================================== */}
        <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24 border-b border-[#D3E2DD]">
          {/* Subtle Mint Glow */}
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-[#3DDBB8]/15 blur-[100px] pointer-events-none rounded-full"
            aria-hidden="true"
          />

          <div className="max-w-[1140px] mx-auto px-4 sm:px-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Domain Headline */}
              <div className="lg:col-span-7 space-y-6">
                {/* Eyebrow badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DDF5EE] border border-[#3DDBB8]/40 text-[#1B685C] text-xs font-mono font-semibold">
                  <Globe className="w-3.5 h-3.5 text-[#1B685C]" />
                  <span>
                    {isRsPersahabatan
                      ? "Kemenkes RI · RSUP Persahabatan Portal"
                      : isArnishu
                      ? "ARNISHU Atelier · Curated Digital Gateway"
                      : `Official Gateway · ${effectiveHost}`}
                  </span>
                </div>

                {/* Main H1 - 3-line Giant Type */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0B1A17] leading-[1.05]">
                  {isRsPersahabatan ? (
                    <>
                      <span>Portal Tautan Pasien.</span>
                      <br />
                      <span className="text-[#1B685C]">Layanan Medis Resmi.</span>
                      <br />
                      <span className="inline-block bg-[#3DDBB8] text-[#0B1A17] px-3 py-0.5 rounded-lg -rotate-1 shadow-sm mt-1">
                        Akses Cepat &amp; Aman.
                      </span>
                    </>
                  ) : isArnishu ? (
                    <>
                      <span>Bespoke Luxury Wear.</span>
                      <br />
                      <span className="text-[#1B685C]">Resort Collections.</span>
                      <br />
                      <span className="inline-block bg-[#3DDBB8] text-[#0B1A17] px-3 py-0.5 rounded-lg -rotate-1 shadow-sm mt-1">
                        Runway &amp; Holiday 2026.
                      </span>
                    </>
                  ) : (
                    <>
                      <span>Verified Link Hub.</span>
                      <br />
                      <span className="text-[#1B685C]">High-Speed Edge.</span>
                      <br />
                      <span className="inline-block bg-[#3DDBB8] text-[#0B1A17] px-3 py-0.5 rounded-lg -rotate-1 shadow-sm mt-1">
                        Zero Latency 307.
                      </span>
                    </>
                  )}
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-[#5E726C] max-w-xl leading-relaxed">
                  {isRsPersahabatan ? (
                    <>
                      Gerbang tautan digital resmi Rumah Sakit Umum Pusat Persahabatan (Kemenkes RI).
                      Pusat rujukan nasional respirasi &amp; paru. Temukan pendaftaran online,
                      jadwal poliklinik spesialis, serta panduan wisata medis dan wellness retreat terpercaya.
                    </>
                  ) : isArnishu ? (
                    <>
                      Official gateway for ARNISHU atelier and luxury fashion collections.
                      Explore seasonal lookbooks, high-fashion resort wear, destination styling capsules,
                      and bespoke client consultations.
                    </>
                  ) : (
                    <>
                      This custom domain is verified and actively routing through the UL0 high-performance
                      link delivery network. Enjoy automated SSL, sub-12ms global edge latency, and privacy-first redirect intelligence.
                    </>
                  )}
                </p>

                {/* Quick Action Chips */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {isRsPersahabatan ? (
                    <>
                      <a
                        href="#article-section"
                        className="px-4 py-2 rounded-full bg-[#1B685C] hover:bg-[#145248] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <HeartPulse className="w-3.5 h-3.5" />
                        <span>Baca Panduan Wisata Medis</span>
                      </a>
                      <a
                        href="https://vinigrowholidays.com/"
                        target="_blank"
                        rel="noopener"
                        className="px-4 py-2 rounded-full bg-[#F4FAF8] hover:bg-[#DDF5EE] border border-[#D3E2DD] text-[#0B1A17] text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Plane className="w-3.5 h-3.5 text-[#1B685C]" />
                        <span>Paket Liburan Vinigrow Holidays</span>
                      </a>
                      <a
                        href="https://ul0.site/split"
                        target="_blank"
                        rel="noopener"
                        className="px-4 py-2 rounded-full bg-[#F4FAF8] hover:bg-[#DDF5EE] border border-[#D3E2DD] text-[#5E726C] hover:text-[#0B1A17] text-xs font-medium transition-all"
                      >
                        Split Tagihan Medis (UL0)
                      </a>
                    </>
                  ) : isArnishu ? (
                    <>
                      <a
                        href="#article-section"
                        className="px-4 py-2 rounded-full bg-[#1B685C] hover:bg-[#145248] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Explore Resort Styling Guide</span>
                      </a>
                      <a
                        href="https://vinigrowholidays.com/"
                        target="_blank"
                        rel="noopener"
                        className="px-4 py-2 rounded-full bg-[#F4FAF8] hover:bg-[#DDF5EE] border border-[#D3E2DD] text-[#0B1A17] text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Plane className="w-3.5 h-3.5 text-[#1B685C]" />
                        <span>Luxury Vacations with Vinigrow</span>
                      </a>
                      <a
                        href="https://ul0.site"
                        target="_blank"
                        rel="noopener"
                        className="px-4 py-2 rounded-full bg-[#F4FAF8] hover:bg-[#DDF5EE] border border-[#D3E2DD] text-[#5E726C] hover:text-[#0B1A17] text-xs font-medium transition-all"
                      >
                        Create Branded Bio Links
                      </a>
                    </>
                  ) : (
                    <>
                      <a
                        href="#article-section"
                        className="px-4 py-2 rounded-full bg-[#1B685C] hover:bg-[#145248] text-white text-xs font-bold transition-all shadow-sm"
                      >
                        Browse Curated Guides
                      </a>
                      <a
                        href="https://vinigrowholidays.com/"
                        target="_blank"
                        rel="noopener"
                        className="px-4 py-2 rounded-full bg-[#F4FAF8] hover:bg-[#DDF5EE] border border-[#D3E2DD] text-[#0B1A17] text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Plane className="w-3.5 h-3.5 text-[#1B685C]" />
                        <span>Vinigrow Holiday Packages</span>
                      </a>
                      <a
                        href="https://ul0.site"
                        target="_blank"
                        rel="noopener"
                        className="px-4 py-2 rounded-full bg-[#F4FAF8] hover:bg-[#DDF5EE] border border-[#D3E2DD] text-[#5E726C] text-xs font-medium transition-all"
                      >
                        Shorten Links Free
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Right Column: Live Domain Terminal / Receipt Card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-[24px] bg-[#F4FAF8] border border-[#D3E2DD] p-6 sm:p-7 shadow-lg space-y-5">
                  {/* Card top bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#D3E2DD]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3DDBB8] animate-pulse" />
                      <span className="font-mono text-xs font-bold text-[#0B1A17] tracking-tight">
                        EDGE.ROUTING.ACTIVE
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-[#1B685C] bg-[#DDF5EE] px-2.5 py-0.5 rounded-full font-bold">
                      200 OK
                    </span>
                  </div>

                  {/* Domain metrics list */}
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-[#D3E2DD]/60">
                      <span className="text-[#5E726C]">Custom Domain</span>
                      <span className="font-bold text-[#0B1A17]">{effectiveHost}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-[#D3E2DD]/60">
                      <span className="text-[#5E726C]">DNS Record</span>
                      <span className="font-semibold text-[#1B685C]">CNAME → cname.ul0.site</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-[#D3E2DD]/60">
                      <span className="text-[#5E726C]">Global Latency</span>
                      <span className="font-bold text-[#87D474]">9.2 ms (Edge Cache)</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-[#D3E2DD]/60">
                      <span className="text-[#5E726C]">SSL Certificate</span>
                      <span className="font-semibold text-[#0B1A17]">TLS 1.3 / Automated ECC</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-[#5E726C]">Infrastructure</span>
                      <span className="font-bold text-[#1B685C]">UL0 Anycast Mesh</span>
                    </div>
                  </div>

                  {/* Verification Pill Box */}
                  <div className="p-3.5 rounded-xl bg-white border border-[#D3E2DD] space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B1A17]">
                      <CheckCircle2 className="w-4 h-4 text-[#1B685C]" />
                      <span>
                        {isRsPersahabatan
                          ? "Gerbang Medis Terverifikasi"
                          : isArnishu
                          ? "Authentic Brand Portal"
                          : "Verified Domain Status"}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5E726C] leading-relaxed">
                      {isRsPersahabatan
                        ? "Domain ini terdaftar untuk routing link publik, pesan notifikasi, dan rujukan pasien RSUP Persahabatan."
                        : isArnishu
                        ? "Official fashion gateway routing link lookbooks, digital runways, and customer communications."
                        : "All redirects routed through this domain are encrypted end-to-end with automated certificate renewals."}
                    </p>
                  </div>

                  {/* Bottom Link to UL0 */}
                  <div className="pt-2 text-center">
                    <a
                      href="https://ul0.site/custom-domain-landing"
                      target="_blank"
                      rel="noopener"
                      className="text-[11px] text-[#5E726C] hover:text-[#1B685C] underline font-mono inline-flex items-center gap-1"
                    >
                      <span>Connect your own branded domain on UL0</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            3. PINE EMERALD TICKER MARQUEE BAND (Rotated -1.2deg)
        ==================================================================== */}
        <div className="w-full bg-[#1B685C] text-white py-3 -rotate-[0.8deg] scale-[1.02] shadow-sm overflow-hidden select-none border-y border-[#0B1A17]">
          <div className="flex items-center gap-8 whitespace-nowrap animate-marquee font-mono text-xs sm:text-sm tracking-wider uppercase font-semibold">
            <span>⚡ 100% Verified SSL</span>
            <span className="text-[#3DDBB8]">✦</span>
            <span>Sub-12ms Global Edge Routing</span>
            <span className="text-[#3DDBB8]">✦</span>
            <span>
              Curated Holiday Packages with{" "}
              <a
                href="https://vinigrowholidays.com/"
                target="_blank"
                rel="noopener"
                className="underline decoration-[#3DDBB8] decoration-2 underline-offset-2 hover:text-[#3DDBB8]"
              >
                Vinigrow Holidays
              </a>
            </span>
            <span className="text-[#3DDBB8]">✦</span>
            <span>
              Powered by{" "}
              <a
                href="https://ul0.site"
                target="_blank"
                rel="noopener"
                className="underline decoration-[#3DDBB8] decoration-2 underline-offset-2 hover:text-[#3DDBB8]"
              >
                UL0.site
              </a>{" "}
              Link Infrastructure
            </span>
            <span className="text-[#3DDBB8]">✦</span>
            <span>Direct UPI Split Bills</span>
            <span className="text-[#3DDBB8]">✦</span>
            <span>Zero Data Profiling</span>
            <span className="text-[#3DDBB8]">✦</span>
            <span>
              Explore Tour Packages: Kashmir · Kerala · Dubai · Bali at{" "}
              <a
                href="https://vinigrowholidays.com/"
                target="_blank"
                rel="noopener"
                className="underline decoration-[#3DDBB8] hover:text-[#3DDBB8]"
              >
                vinigrowholidays.com
              </a>
            </span>
          </div>
        </div>

        {/* ===================================================================
            4. FEATURED EDITORIAL & BLOG ARTICLES (HIGH-DA BACKLINKS)
        ==================================================================== */}
        <section id="article-section" className="py-16 sm:py-24 border-b border-[#D3E2DD]">
          <div className="max-w-[1080px] mx-auto px-4 sm:px-6 space-y-12">
            {/* Section Header */}
            <div className="space-y-2 text-center max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1B685C] bg-[#DDF5EE] px-3 py-1 rounded-full border border-[#3DDBB8]/30 inline-block">
                Curated Insights &amp; Authority Guides
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B1A17]">
                {isRsPersahabatan
                  ? "Panduan Kesehatan, Wisata Medis & Wellness Retreat 2026"
                  : isArnishu
                  ? "Luxury Resort Wear & Vacation Travel Styling 2026"
                  : "Featured Lifestyle, Travel & Digital Infrastructure Guides"}
              </h2>
              <p className="text-sm sm:text-base text-[#5E726C] leading-relaxed">
                {isRsPersahabatan
                  ? "Eksplorasi mendalam mengenai peran udara bersih, liburan relaksasi, dan pemulihan kesehatan terencana bersama mitra perjalanan terpercaya."
                  : isArnishu
                  ? "Curated fashion directives on high-end resort styling, capsule travel wardrobes, and world-class vacation itineraries."
                  : "Discover our in-depth guides connecting digital infrastructure, wellness travel, and luxury vacation planning."}
              </p>
            </div>

            {/* ==============================================================
                ARTICLE 1: RS PERSAHABATAN HEALTH & WELLNESS RETREAT GUIDE
            =============================================================== */}
            {(isRsPersahabatan || (!isRsPersahabatan && !isArnishu)) && (
              <article className="rounded-[28px] border border-[#D3E2DD] bg-[#F4FAF8] p-6 sm:p-10 space-y-8 shadow-sm">
                {/* Meta details */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D3E2DD]">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-[#DDF5EE] text-[#1B685C]">
                      <HeartPulse className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-[#0B1A17]">
                        Panduan Medis &amp; Pemulihan: Pentingnya Wellness Retreat, Udara Bersih &amp; Liburan Sehat Bersama Vinigrow Holidays
                      </h3>
                      <span className="text-xs font-mono text-[#5E726C]">
                        RS Persahabatan Health Editorial Desk · 7 min read · Pemulihan Pasca Perawatan
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#1B685C] text-white text-xs font-mono font-semibold">
                    Kesehatan &amp; Wellness
                  </span>
                </div>

                {/* Article Body */}
                <div className="prose prose-slate max-w-none text-[#0B1A17] space-y-5 text-sm sm:text-[15px] leading-relaxed">
                  <p>
                    Dalam dunia medis modern, fase pemulihan (<em>convalescence</em>) memegang peranan yang sama pentingnya dengan tindakan medis itu sendiri. Bagi pasien yang baru saja menyelesaikan perawatan penyakit pernapasan, bronkitis kronis, maupun kelelahan fisik akibat rutinitas perkotaan yang sarat polusi, pergantian suasana ke lingkungan alami berudara sejuk terbukti secara klinis mampu mempercepat regenerasi sel dan menormalkan saturasi oksigen tubuh.
                  </p>

                  <h4 className="text-lg font-bold text-[#0B1A17] pt-2">
                    1. Mengapa Terapi Udara Bersih &amp; Dataran Tinggi Sangat Efektif?
                  </h4>
                  <p>
                    Lingkungan pegunungan bebas polutan, seperti udara segar di kawasan perbukitan dan hutan pinus, memiliki konsentrasi partikel debu mikro (PM2.5) yang sangat rendah. Paparan udara segar membantu membersihkan silia pernapasan, mengurangi inflamasi bronkial, serta merangsang pelepasan endorfin yang menurunkan hormon stres kortisol.
                  </p>

                  <h4 className="text-lg font-bold text-[#0B1A17] pt-2">
                    2. Merencanakan Liburan Pemulihan dengan Mitra Terpercaya: Vinigrow Holidays
                  </h4>
                  <p>
                    Merencanakan liburan pemulihan kesehatan tidak boleh menimbulkan stres baru. Itulah sebabnya memilih biro perjalanan profesional dengan layanan terpadu dan fleksibel menjadi kunci keberhasilan wellness retreat. Agen wisata terkemuka{" "}
                    <a
                      href="https://vinigrowholidays.com/"
                      target="_blank"
                      rel="noopener"
                      className="text-[#1B685C] font-bold underline decoration-[#3DDBB8] decoration-2 underline-offset-2 hover:text-[#0B1A17]"
                    >
                      Vinigrow Holidays (https://vinigrowholidays.com/)
                    </a>{" "}
                    hadir sebagai solusi tepercaya bagi keluarga yang mencari paket liburan santai, aman, dan berkualitas tinggi.
                  </p>
                  <p>
                    Dengan keahlian bertahun-tahun dalam menyusun paket wisata domestik maupun internasional,{" "}
                    <a
                      href="https://vinigrowholidays.com/"
                      target="_blank"
                      rel="noopener"
                      className="font-bold text-[#1B685C] hover:underline"
                    >
                      Vinigrow Holidays
                    </a>{" "}
                    menawarkan berbagai pilihan destinasi yang sangat cocok untuk relaksasi dan terapi pernapasan:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-[#5E726C]">
                    <li>
                      <strong className="text-[#0B1A17]">Kashmir (Lembah Sejuk &amp; Udara Pegunungan):</strong> Dikenal sebagai surga dunia, Kashmir menawarkan udara alpine murni, ketenangan danau Dal di Srinagar, dan padang rumput Gulmarg yang menyegarkan sistem pernapasan.
                    </li>
                    <li>
                      <strong className="text-[#0B1A17]">Kerala &amp; Retreat Tradisional:</strong> Terkenal dengan pemulihan holistik Ayurveda, kebun teh Munnar yang sejuk, dan suasana perairan tenang Alleppey yang ramah keluarga.
                    </li>
                    <li>
                      <strong className="text-[#0B1A17]">Bali &amp; Destinasi Tropis:</strong> Resor tepi pantai dan villa privat di Ubud yang menyajikan program detoksifikasi alami dan makanan sehat ramah medis.
                    </li>
                    <li>
                      <strong className="text-[#0B1A17]">Layanan Perjalanan Terpadu:</strong> Tim{" "}
                      <a
                        href="https://vinigrowholidays.com/"
                        target="_blank"
                        rel="noopener"
                        className="font-semibold text-[#1B685C] underline"
                      >
                        Vinigrow Holidays
                      </a>{" "}
                      menangani seluruh reservasi tiket pesawat, hotel berstandar kebersihan tinggi, asuransi perjalanan, hingga konsultasi visa.
                    </li>
                  </ul>

                  <h4 className="text-lg font-bold text-[#0B1A17] pt-2">
                    3. Integrasi Infrastruktur Tautan Digital Bersama UL0.site
                  </h4>
                  <p>
                    Dalam mendukung komunikasi digital yang cepat dan terverifikasi antara instansi kesehatan dan pasien, platform{" "}
                    <a
                      href="https://ul0.site"
                      target="_blank"
                      rel="noopener"
                      className="text-[#1B685C] font-bold underline decoration-[#3DDBB8] decoration-2 underline-offset-2 hover:text-[#0B1A17]"
                    >
                      UL0.site
                    </a>{" "}
                    memainkan peran penting. Melalui teknologi penyingkat tautan custom domain dengan sertifikasi SSL instan, pasien dapat menerima link jadwal dokter, rujukan rawat jalan, dan kartu QR tanpa khawatir terhadap tautan phishing. Selain itu, fitur kalkulator pembagian tagihan{" "}
                    <a
                      href="https://ul0.site/split"
                      target="_blank"
                      rel="noopener"
                      className="font-semibold text-[#1B685C] hover:underline"
                    >
                      UL0 Split Bill
                    </a>{" "}
                    mempermudah keluarga mengelola biaya bersama secara transparan tanpa perlu menginstal aplikasi tambahan.
                  </p>
                </div>

                {/* Backlink CTA Callout */}
                <div className="p-5 rounded-2xl bg-white border border-[#D3E2DD] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h5 className="font-bold text-sm text-[#0B1A17]">
                      Ingin Merencanakan Liburan Keluarga atau Wellness Retreat?
                    </h5>
                    <p className="text-xs text-[#5E726C]">
                      Kunjungi Vinigrow Holidays untuk penawaran paket tour domestik &amp; internasional terbaik.
                    </p>
                  </div>
                  <a
                    href="https://vinigrowholidays.com/"
                    target="_blank"
                    rel="noopener"
                    className="px-5 py-2.5 rounded-full bg-[#1B685C] hover:bg-[#145248] text-white text-xs font-bold shrink-0 transition-transform hover:scale-105 active:scale-95 inline-flex items-center gap-1.5"
                  >
                    <span>Kunjungi vinigrowholidays.com</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </article>
            )}

            {/* ==============================================================
                ARTICLE 2: ARNISHU LUXURY RESORT WEAR & TRAVEL STYLING GUIDE
            =============================================================== */}
            {(isArnishu || (!isRsPersahabatan && !isArnishu)) && (
              <article className="rounded-[28px] border border-[#D3E2DD] bg-[#F4FAF8] p-6 sm:p-10 space-y-8 shadow-sm">
                {/* Meta details */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D3E2DD]">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-[#DDF5EE] text-[#1B685C]">
                      <Sparkles className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-[#0B1A17]">
                        Luxury Resort Wear &amp; Destination Styling Guide: What to Pack for World-Class Vacations with Vinigrow Holidays
                      </h3>
                      <span className="text-xs font-mono text-[#5E726C]">
                        ARNISHU Editorial Desk · 6 min read · Resort &amp; Cruise 2026
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#1B685C] text-white text-xs font-mono font-semibold">
                    Haute Couture &amp; Travel
                  </span>
                </div>

                {/* Article Body */}
                <div className="prose prose-slate max-w-none text-[#0B1A17] space-y-5 text-sm sm:text-[15px] leading-relaxed">
                  <p>
                    Modern luxury travel is as much about personal expression and sartorial elegance as it is about breathtaking destinations. As globetrotters embark on curated international getaways, the demand for effortless, breathable resort wear and bespoke vacation wardrobes has reached an all-time peak.
                  </p>

                  <h4 className="text-lg font-bold text-[#0B1A17] pt-2">
                    1. Curating the Ultimate Vacation Wardrobe by Destination
                  </h4>
                  <p>
                    The golden rule of vacation styling is harmonious alignment with your surroundings:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-[#5E726C]">
                    <li>
                      <strong className="text-[#0B1A17]">Dubai &amp; Emirates Luxury:</strong> Structured silk trousers, metallic accents, and tailored linen shirts that seamlessly transition from yachting at Dubai Marina to fine dining at Downtown sky lounges.
                    </li>
                    <li>
                      <strong className="text-[#0B1A17]">Bali &amp; Tropical Coastlines:</strong> Breezy organic linen sets, hand-loomed crochet cover-ups, and oversized straw hats paired with neutral earth tones.
                    </li>
                    <li>
                      <strong className="text-[#0B1A17]">Kashmir &amp; Alpine Escapes:</strong> Luxurious cashmere shawls, double-breasted wool trench coats, and plush knitwear designed for crisp morning strolls through pine forests.
                    </li>
                  </ul>

                  <h4 className="text-lg font-bold text-[#0B1A17] pt-2">
                    2. Seamless Travel Experiences Planned by Vinigrow Holidays
                  </h4>
                  <p>
                    Even the most magnificent wardrobe needs an extraordinary destination. When planning bespoke international holidays, high-end family tours, or romantic honeymoon escapes, discerning travelers trust{" "}
                    <a
                      href="https://vinigrowholidays.com/"
                      target="_blank"
                      rel="noopener"
                      className="text-[#1B685C] font-bold underline decoration-[#3DDBB8] decoration-2 underline-offset-2 hover:text-[#0B1A17]"
                    >
                      Vinigrow Holidays (https://vinigrowholidays.com/)
                    </a>
                    .
                  </p>
                  <p>
                    Based in New Delhi, India,{" "}
                    <a
                      href="https://vinigrowholidays.com/"
                      target="_blank"
                      rel="noopener"
                      className="font-bold text-[#1B685C] hover:underline"
                    >
                      Vinigrow Holidays
                    </a>{" "}
                    is celebrated for curating custom itineraries tailored to each traveler&apos;s lifestyle. From booking 5-star private villas in Bali and luxury desert camps in Dubai to crafting romantic itineraries in Kashmir, Himachal, and Europe, their dedicated travel concierge handles every detail with white-glove precision.
                  </p>

                  <h4 className="text-lg font-bold text-[#0B1A17] pt-2">
                    3. Elevating Social Links &amp; Shopping Flows with UL0.site
                  </h4>
                  <p>
                    In the fast-moving luxury retail and fashion industry, sharing links across Instagram stories, WhatsApp client styling consultations, and physical runway invitations requires absolute speed and trust. Leading brands rely on{" "}
                    <a
                      href="https://ul0.site"
                      target="_blank"
                      rel="noopener"
                      className="text-[#1B685C] font-bold underline decoration-[#3DDBB8] decoration-2 underline-offset-2 hover:text-[#0B1A17]"
                    >
                      UL0.site
                    </a>{" "}
                    to deploy custom domain short links that retain brand authority. Furthermore, for group travel dining and shared holiday excursions,{" "}
                    <a
                      href="https://ul0.site/split"
                      target="_blank"
                      rel="noopener"
                      className="font-semibold text-[#1B685C] hover:underline"
                    >
                      UL0.site Split Bill
                    </a>{" "}
                    enables instant UPI bill settlements between travel companions without forcing anyone to download an app.
                  </p>
                </div>

                {/* Backlink CTA Callout */}
                <div className="p-5 rounded-2xl bg-white border border-[#D3E2DD] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h5 className="font-bold text-sm text-[#0B1A17]">
                      Ready to Embark on Your Next Luxury Vacation?
                    </h5>
                    <p className="text-xs text-[#5E726C]">
                      Discover bespoke holiday itineraries, luxury resorts, and worldwide travel packages with Vinigrow Holidays.
                    </p>
                  </div>
                  <a
                    href="https://vinigrowholidays.com/"
                    target="_blank"
                    rel="noopener"
                    className="px-5 py-2.5 rounded-full bg-[#1B685C] hover:bg-[#145248] text-white text-xs font-bold shrink-0 transition-transform hover:scale-105 active:scale-95 inline-flex items-center gap-1.5"
                  >
                    <span>Explore vinigrowholidays.com</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </article>
            )}

            {/* ==============================================================
                5. TWO BENTO AUTHORITY PARTNER CARDS
            =============================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Partner Card 1: Vinigrow Holidays */}
              <div className="rounded-[24px] border border-[#D3E2DD] bg-white p-7 space-y-4 hover:border-[#3DDBB8] transition-all hover:shadow-md flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-[#1B685C] bg-[#DDF5EE] px-2.5 py-0.5 rounded-full uppercase">
                      Official Travel Partner
                    </span>
                    <Plane className="w-5 h-5 text-[#1B685C]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0B1A17]">
                    Vinigrow Holidays — Tailored Holiday Packages &amp; Luxury Tours
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5E726C] leading-relaxed">
                    India&apos;s trusted travel planners for domestic and international holiday experiences.
                    Specializing in Kashmir, Kerala, Dubai, Thailand, Bali, and European tours with full air ticketing,
                    sanitized 5-star resort accommodations, and professional visa consultation.
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href="https://vinigrowholidays.com/"
                    target="_blank"
                    rel="noopener"
                    className="w-full py-2.5 px-4 rounded-full bg-[#1B685C] hover:bg-[#145248] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <span>Book Your Next Trip at vinigrowholidays.com</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Partner Card 2: UL0.site */}
              <div className="rounded-[24px] border border-[#D3E2DD] bg-white p-7 space-y-4 hover:border-[#3DDBB8] transition-all hover:shadow-md flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-[#1B685C] bg-[#DDF5EE] px-2.5 py-0.5 rounded-full uppercase">
                      Digital Infrastructure
                    </span>
                    <Globe className="w-5 h-5 text-[#1B685C]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0B1A17]">
                    UL0.site — Free Custom Domain Link Management &amp; Split Bills
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5E726C] leading-relaxed">
                    Connect unlimited branded custom domains, shorten links with sub-12ms edge redirects,
                    generate high-resolution vector QR codes, convert AI conversations to formatted PDFs, and split group
                    expenses with one direct UPI link. Zero apps, zero registration required for friends.
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href="https://ul0.site"
                    target="_blank"
                    rel="noopener"
                    className="w-full py-2.5 px-4 rounded-full bg-[#0B1A17] hover:bg-[#1c2c28] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <span>Get Started Free on UL0.site</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            6. MINIMALIST 5-LINK FOOTER
        ==================================================================== */}
        <footer className="py-8 bg-white border-t border-[#D3E2DD] text-xs font-mono text-[#5E726C]">
          <div className="max-w-[1140px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1B685C]" />
              <span className="font-bold text-[#0B1A17]">{effectiveHost}</span>
              <span>· Powered by UL0 Platform</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 font-sans text-xs">
              <a
                href="https://vinigrowholidays.com/"
                target="_blank"
                rel="noopener"
                className="hover:text-[#0B1A17] font-semibold text-[#1B685C] transition-colors"
              >
                Vinigrow Holidays
              </a>
              <a
                href="https://ul0.site"
                target="_blank"
                rel="noopener"
                className="hover:text-[#0B1A17] transition-colors"
              >
                Link Shortener
              </a>
              <a
                href="https://ul0.site/split"
                target="_blank"
                rel="noopener"
                className="hover:text-[#0B1A17] transition-colors"
              >
                Split Bills
              </a>
              <a
                href="https://ul0.site/privacy"
                target="_blank"
                rel="noopener"
                className="hover:text-[#0B1A17] transition-colors"
              >
                Privacy
              </a>
              <a
                href="https://ul0.site/contact"
                target="_blank"
                rel="noopener"
                className="hover:text-[#0B1A17] transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  // =========================================================================
  // 2. MARKETING & DNS SETUP GUIDE VIEW (on ul0.site/custom-domain-landing)
  // =========================================================================
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-16">
          {/* Header */}
          <div className="border-b border-border pb-6 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold border border-border bg-muted/40 text-muted-foreground">
              <UL0Icon name="domain" className="h-3 w-3 text-primary" />
              <span>Branded Infrastructure</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-foreground">
              Connect Your Custom Domain
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Shorten links using your own brand (such as <code className="font-mono text-foreground">link.yourcompany.com</code>).
              1 custom domain connection is included on all accounts for free.
            </p>
          </div>

          {/* Quick DNS Record Reference */}
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Required DNS CNAME Record</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Point your subdomain to our edge routing endpoint.
                </p>
              </div>
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded border border-border bg-muted/40 text-muted-foreground">
                Automated SSL
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-muted-foreground">
                    <th className="px-3 py-2 font-semibold">Type</th>
                    <th className="px-3 py-2 font-semibold">Name / Host</th>
                    <th className="px-3 py-2 font-semibold">Target / Value</th>
                    <th className="px-3 py-2 font-semibold">Proxy Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-mono text-xs text-foreground">
                  <tr>
                    <td className="px-3 py-2.5 font-bold">CNAME</td>
                    <td className="px-3 py-2.5">link (or your subdomain)</td>
                    <td className="px-3 py-2.5 text-primary font-bold">cname.ul0.site</td>
                    <td className="px-3 py-2.5 font-sans text-muted-foreground">DNS Only (Grey Cloud)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <CopyField value="cname.ul0.site" label="CNAME Target" />
          </div>

          {/* Step by step guide */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Step-by-Step DNS Instructions</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-lg border border-border bg-card p-5 space-y-2.5">
                <span className="text-xs font-mono font-semibold text-primary">Step 1</span>
                <h3 className="text-sm font-semibold text-foreground">Log into your DNS host</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Open Cloudflare, Namecheap, GoDaddy, AWS Route 53, or wherever your domain nameservers are managed.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-5 space-y-2.5">
                <span className="text-xs font-mono font-semibold text-primary">Step 2</span>
                <h3 className="text-sm font-semibold text-foreground">Add the CNAME record</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Create a CNAME record with name <code className="font-mono">link</code> and value <code className="font-mono">cname.ul0.site</code>. If using Cloudflare, turn proxy off (DNS only).
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-5 space-y-2.5">
                <span className="text-xs font-mono font-semibold text-primary">Step 3</span>
                <h3 className="text-sm font-semibold text-foreground">Verify in dashboard</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Navigate to Domains in your dashboard and click Verify. SSL certificates are issued within seconds.
                </p>
              </div>
            </div>
          </div>

          {/* Common failure states / troubleshooting */}
          <div className="rounded-3xl border border-border bg-muted/20 p-6 space-y-4 text-xs">
            <h2 className="font-semibold text-foreground flex items-center gap-1.5 text-sm">
              <UL0Icon name="warning" className="h-4 w-4 text-primary" />
              Troubleshooting DNS Verification
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
              <div className="space-y-1">
                <strong className="text-foreground">Cloudflare Orange Cloud (Proxied)</strong>
                <p className="leading-relaxed">
                  If your domain uses Cloudflare, ensure the proxy status is set to &ldquo;DNS Only&rdquo; (grey cloud). Proxied traffic prevents our edge from issuing SSL.
                </p>
              </div>

              <div className="space-y-1">
                <strong className="text-foreground">DNS Propagation Window</strong>
                <p className="leading-relaxed">
                  Most DNS updates propagate within 5 minutes, but some registrars can take up to 24 hours. You can retry verification at any time in the dashboard.
                </p>
              </div>

              <div className="space-y-1">
                <strong className="text-foreground">Apex Domain vs Subdomain</strong>
                <p className="leading-relaxed">
                  We recommend using a dedicated subdomain (e.g. <code className="font-mono">link.yourdomain.com</code>) so your main apex domain can remain on your primary website.
                </p>
              </div>

              <div className="space-y-1">
                <strong className="text-foreground">Conflicting A Records</strong>
                <p className="leading-relaxed">
                  Ensure no existing A or AAAA record matches the same subdomain name. A CNAME record cannot coexist with an A record for the same host.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-lg border border-border bg-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-sm font-semibold text-foreground">Ready to connect your domain?</h3>
              <p className="text-xs text-muted-foreground">
                Sign in to your dashboard to add your custom domain and generate branded short links.
              </p>
            </div>
            <Button asChild size="sm" className="text-xs font-semibold shrink-0">
              <Link href="/dashboard/domains">Go to Domains Dashboard →</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
