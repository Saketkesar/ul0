import React from "react"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BrandLogo } from "@/components/brand-logo"
import { IconsGalleryClient } from "./icons-gallery-client"
import { UL0Icon } from "@/components/ul0-icon"

export const metadata: Metadata = {
  title: "Our Icons & Color Scheme (Proprietary & Copyright Protected) | UL0",
  description:
    "Explore UL0's proprietary custom icon library, design system tokens, and color palette. All assets are original works protected by international copyright law.",
  alternates: {
    canonical: "https://ul0.site/icons",
  },
}

export default function IconsAndColorsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl space-y-16">
          {/* Header */}
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
              <UL0Icon name="palette" size={14} />
              <span>Proprietary Design Assets</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Our Icons &amp; Color Scheme
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Every icon, character illustration, and color token used across UL0 was custom crafted to deliver an ultra-clean, tactile, and non-AI experience matching our green logo identity.
            </p>
          </div>

          {/* Copyright Warning Box */}
          <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 sm:p-8 space-y-3 text-left">
            <div className="flex items-center gap-3">
              <UL0Icon name="shield" size={24} />
              <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                Strict Copyright &amp; Intellectual Property Notice
              </h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
              All visual assets, SVG vector icons, animated SVGs, tile illustrations, animations, brand marks, and custom color arrangements contained in the <strong>UL0 Icon Library</strong> are the sole intellectual property of <strong>UL0</strong>.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              No individual or organization is permitted to copy, download, scrape, sublicense, distribute, modify, package, or utilize these icons or visual color styles in any commercial, non-commercial, or open-source software, website, or marketing material without prior explicit written permission. Violators will face immediate DMCA takedown notices and legal enforcement under applicable copyright legislation.
            </p>
          </div>

          {/* Color Palette Tokens */}
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Official Color Tokens (from ul0.png)
              </h2>
              <p className="text-sm text-muted-foreground">
                The fresh, high-contrast pine and mint palette powering our web interface.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="rounded-xl border border-border p-4 bg-card space-y-3 shadow-2xs">
                <div className="h-16 rounded-lg bg-[#1B685C] border border-black/10 shadow-inner" />
                <div>
                  <div className="text-xs font-bold text-foreground">Pine Emerald</div>
                  <div className="text-[11px] font-mono text-muted-foreground">#1B685C</div>
                  <div className="text-[10px] text-muted-foreground/80 mt-1">Logo Squircle &amp; CTA</div>
                </div>
              </div>

              <div className="rounded-xl border border-border p-4 bg-card space-y-3 shadow-2xs">
                <div className="h-16 rounded-lg bg-[#87D474] border border-black/10 shadow-inner" />
                <div>
                  <div className="text-xs font-bold text-foreground">Dollar Mint</div>
                  <div className="text-[11px] font-mono text-muted-foreground">#87D474</div>
                  <div className="text-[10px] text-muted-foreground/80 mt-1">Logo Coin Accent</div>
                </div>
              </div>

              <div className="rounded-xl border border-border p-4 bg-card space-y-3 shadow-2xs">
                <div className="h-16 rounded-lg bg-[#3DDBB8] border border-black/10 shadow-inner" />
                <div>
                  <div className="text-xs font-bold text-foreground">Electric Mint</div>
                  <div className="text-[11px] font-mono text-muted-foreground">#3DDBB8</div>
                  <div className="text-[10px] text-muted-foreground/80 mt-1">Icon Accent Stroke</div>
                </div>
              </div>

              <div className="rounded-xl border border-border p-4 bg-card space-y-3 shadow-2xs">
                <div className="h-16 rounded-lg bg-[#F4FAF8] border border-black/10 shadow-inner" />
                <div>
                  <div className="text-xs font-bold text-foreground">Mint Canvas</div>
                  <div className="text-[11px] font-mono text-muted-foreground">#F4FAF8</div>
                  <div className="text-[10px] text-muted-foreground/80 mt-1">Light Surface Backdrop</div>
                </div>
              </div>

              <div className="rounded-xl border border-border p-4 bg-card space-y-3 shadow-2xs">
                <div className="h-16 rounded-lg bg-[#0B1A17] border border-black/10 shadow-inner" />
                <div>
                  <div className="text-xs font-bold text-foreground">Deep Pine Ink</div>
                  <div className="text-[11px] font-mono text-muted-foreground">#0B1A17</div>
                  <div className="text-[10px] text-muted-foreground/80 mt-1">Primary Text &amp; Icon Stroke</div>
                </div>
              </div>

              <div className="rounded-xl border border-border p-4 bg-card space-y-3 shadow-2xs">
                <div className="h-16 rounded-lg bg-[#DDF5EE] border border-black/10 shadow-inner" />
                <div>
                  <div className="text-xs font-bold text-foreground">Tile Surface</div>
                  <div className="text-[11px] font-mono text-muted-foreground">#DDF5EE</div>
                  <div className="text-[10px] text-muted-foreground/80 mt-1">Icon Frame Background</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Icon Kit Explorer */}
          <IconsGalleryClient />
        </div>
      </main>

      <Footer />
    </div>
  )
}
