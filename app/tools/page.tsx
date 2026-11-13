"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { UL0Icon, UL0IconName } from "@/components/ul0-icon"

type ToolCategory = "all" | "links" | "qr" | "documents" | "utilities"

interface ToolItem {
  id: string
  name: string
  description: string
  href: string
  category: "links" | "qr" | "documents" | "utilities"
  privacy: string
  iconName: UL0IconName
}

const TOOLS: ToolItem[] = [
  {
    id: "forms-sheets",
    name: "Forms to Google Sheets",
    description: "Create public forms that save responses straight to your Google Sheet without database storage.",
    href: "/forms",
    category: "utilities",
    privacy: "Direct to Google Sheets (Zero-DB)",
    iconName: "docs",
  },
  {
    id: "shortener",
    name: "URL Shortener",
    description: "Shorten links with custom back-halves and 307 temporary redirects.",
    href: "/",
    category: "links",
    privacy: "Processed at edge",
    iconName: "scissors",
  },
  {
    id: "redirect-checker",
    name: "HTTP Redirect Checker",
    description: "Inspect 301, 302, and 307 redirect hops, headers, and status codes.",
    href: "/tools/redirect-checker",
    category: "links",
    privacy: "Server inspection query",
    iconName: "chartline",
  },
  {
    id: "url-expander",
    name: "URL Expander",
    description: "Reveal the final destination of shortened or obfuscated links before clicking.",
    href: "/tools/url-expander",
    category: "links",
    privacy: "Safety screened query",
    iconName: "search",
  },
  {
    id: "utm-builder",
    name: "UTM Campaign Builder",
    description: "Standardize Google Analytics 4 tracking parameters with clean URLs.",
    href: "/utm",
    category: "links",
    privacy: "Processed in your browser",
    iconName: "target",
  },
  {
    id: "og-preview",
    name: "OpenGraph Previewer",
    description: "Inspect metadata previews for X, LinkedIn, Discord, and Facebook cards.",
    href: "/tools/og-preview",
    category: "links",
    privacy: "Fetched on demand",
    iconName: "image",
  },
  {
    id: "qr-studio",
    name: "Vector QR Generator",
    description: "Create printable PNG and SVG vector QR codes with contrast verification.",
    href: "/qr",
    category: "qr",
    privacy: "Processed in your browser",
    iconName: "qr",
  },
  {
    id: "wifi-qr",
    name: "WiFi QR Code Generator",
    description: "Generate instant camera connect codes for WPA/WPA2 networks.",
    href: "/wifi",
    category: "qr",
    privacy: "Processed in your browser",
    iconName: "wifi",
  },
  {
    id: "whatsapp-link",
    name: "WhatsApp Link & QR",
    description: "Create click-to-chat links with pre-filled messages and QR codes.",
    href: "/whatsapp",
    category: "utilities",
    privacy: "Processed in your browser",
    iconName: "whatsapp",
  },
  {
    id: "split-bill",
    name: "Split Bill Calculator",
    description: "Divide group dinner and travel expenses with shareable summary links.",
    href: "/split",
    category: "utilities",
    privacy: "No app download required",
    iconName: "splitbill",
  },
  {
    id: "pdf-tools",
    name: "PDF Suite (Split, Merge, Convert)",
    description: "Split pages, merge documents, and convert images to PDF entirely in your browser.",
    href: "/files",
    category: "documents",
    privacy: "100% client-side (no uploads)",
    iconName: "pdf",
  },
  {
    id: "pdf-splitter",
    name: "PDF Page Splitter",
    description: "Extract specific page ranges from PDF files without uploading them.",
    href: "/tools/pdf-splitter",
    category: "documents",
    privacy: "100% client-side (no uploads)",
    iconName: "pdf",
  },
  {
    id: "meta-tag-generator",
    name: "Meta Tag Generator",
    description: "Generate valid HTML SEO, OpenGraph, and Twitter card tags.",
    href: "/tools/meta-tag-generator",
    category: "utilities",
    privacy: "Processed in your browser",
    iconName: "code",
  },
]

export default function ToolsHubPage() {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesCategory =
        selectedCategory === "all" || tool.category === selectedCategory
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !query ||
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl space-y-10">
          {/* Header */}
          <div className="border-b border-border pb-6 space-y-2">
            <div className="flex items-center gap-2">
              <UL0Icon name="tools" size={24} animated={true} />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Free Web &amp; Tiny Tools
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Client-side utilities for link management, vector QR codes, expense splitting, and document tasks.
            </p>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-card border border-border">
              {(
                [
                  { id: "all", label: "All Tools" },
                  { id: "links", label: "Links" },
                  { id: "qr", label: "QR Codes" },
                  { id: "documents", label: "Documents" },
                  { id: "utilities", label: "Utilities" },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <UL0Icon name="search" size={14} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools..."
                className="w-full h-9 pl-9 pr-3 rounded-full bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Tools Grid */}
          {filteredTools.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-border text-xs text-muted-foreground">
              No tools matching &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((t) => (
                <Link
                  key={t.id}
                  href={t.href}
                  className="rounded-2xl border border-border bg-card p-5 space-y-3 hover:border-primary/50 transition-all shadow-2xs hover:shadow-xs group hover:scale-[1.01] flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-12 w-12 rounded-xl border border-border bg-surface-2 flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
                        <UL0Icon name={t.iconName} animated={true} size={30} />
                      </div>
                      <span className="text-[10px] font-mono font-medium text-muted-foreground border border-border/80 bg-surface-2 px-2.5 py-0.5 rounded-full">
                        {t.category}
                      </span>
                    </div>
                    <h2 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {t.name}
                    </h2>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <UL0Icon name="shield" size={12} />
                      <span>{t.privacy}</span>
                    </span>
                    <span className="font-semibold text-primary inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Open</span>
                      <UL0Icon name="arrowright" size={10} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
