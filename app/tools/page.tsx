"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import {
  Link2,
  QrCode,
  Search,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Eye,
  Code2,
  FileText,
  Users,
  MessageCircle,
  Wifi,
  Scissors,
  FileSpreadsheet,
} from "lucide-react"

type ToolCategory = "all" | "links" | "qr" | "documents" | "utilities"

interface ToolItem {
  id: string
  name: string
  description: string
  href: string
  category: "links" | "qr" | "documents" | "utilities"
  privacy: string
  icon: React.ComponentType<{ className?: string }>
}

const TOOLS: ToolItem[] = [
  {
    id: "forms-sheets",
    name: "Forms to Google Sheets",
    description: "Create public forms that save responses straight to your Google Sheet without database storage.",
    href: "/forms",
    category: "utilities",
    privacy: "Direct to Google Sheets (Zero-DB)",
    icon: FileSpreadsheet,
  },
  {
    id: "shortener",
    name: "URL Shortener",
    description: "Shorten links with custom back-halves and 307 temporary redirects.",
    href: "/",
    category: "links",
    privacy: "Processed at edge",
    icon: Link2,
  },
  {
    id: "redirect-checker",
    name: "HTTP Redirect Checker",
    description: "Inspect 301, 302, and 307 redirect hops, headers, and status codes.",
    href: "/tools/redirect-checker",
    category: "links",
    privacy: "Server inspection query",
    icon: TrendingUp,
  },
  {
    id: "url-expander",
    name: "URL Expander",
    description: "Reveal the final destination of shortened or obfuscated links before clicking.",
    href: "/tools/url-expander",
    category: "links",
    privacy: "Safety screened query",
    icon: Search,
  },
  {
    id: "utm-builder",
    name: "UTM Campaign Builder",
    description: "Standardize Google Analytics 4 tracking parameters with clean URLs.",
    href: "/utm",
    category: "links",
    privacy: "Processed in your browser",
    icon: Link2,
  },
  {
    id: "og-preview",
    name: "OpenGraph Previewer",
    description: "Inspect metadata previews for X, LinkedIn, Discord, and Facebook cards.",
    href: "/tools/og-preview",
    category: "links",
    privacy: "Fetched on demand",
    icon: Eye,
  },
  {
    id: "qr-studio",
    name: "Vector QR Generator",
    description: "Create printable PNG and SVG vector QR codes with contrast verification.",
    href: "/qr",
    category: "qr",
    privacy: "Processed in your browser",
    icon: QrCode,
  },
  {
    id: "wifi-qr",
    name: "WiFi QR Code Generator",
    description: "Generate instant camera connect codes for WPA/WPA2 networks.",
    href: "/wifi",
    category: "qr",
    privacy: "Processed in your browser",
    icon: Wifi,
  },
  {
    id: "whatsapp-link",
    name: "WhatsApp Link & QR",
    description: "Create click-to-chat links with pre-filled messages and QR codes.",
    href: "/whatsapp",
    category: "utilities",
    privacy: "Processed in your browser",
    icon: MessageCircle,
  },
  {
    id: "split-bill",
    name: "Split Bill Calculator",
    description: "Divide group dinner and travel expenses with shareable summary links.",
    href: "/split",
    category: "utilities",
    privacy: "No app download required",
    icon: Users,
  },
  {
    id: "pdf-tools",
    name: "PDF Suite (Split, Merge, Convert)",
    description: "Split pages, merge documents, and convert images to PDF entirely in your browser.",
    href: "/files",
    category: "documents",
    privacy: "100% client-side (no uploads)",
    icon: Scissors,
  },
  {
    id: "pdf-splitter",
    name: "PDF Page Splitter",
    description: "Extract specific page ranges from PDF files without uploading them.",
    href: "/tools/pdf-splitter",
    category: "documents",
    privacy: "100% client-side (no uploads)",
    icon: FileText,
  },
  {
    id: "meta-tag-generator",
    name: "Meta Tag Generator",
    description: "Generate valid HTML SEO, OpenGraph, and Twitter card tags.",
    href: "/tools/meta-tag-generator",
    category: "utilities",
    privacy: "Processed in your browser",
    icon: Code2,
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

      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl space-y-10">
          {/* Header */}
          <div className="border-b border-border pb-6 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Web &amp; Link Tools
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Lightweight utilities for link management, vector QR codes, and client-side document processing.
            </p>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-md bg-muted/40 border border-border">
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
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-background text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools..."
                className="pl-9 h-9 text-xs"
              />
            </div>
          </div>

          {/* Tools Grid */}
          {filteredTools.length === 0 ? (
            <div className="p-12 text-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
              No tools matching &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((t) => {
                const Icon = t.icon
                return (
                  <Link
                    key={t.id}
                    href={t.href}
                    className="rounded-lg border border-border bg-card p-5 space-y-3 hover:border-foreground/40 transition-colors flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="h-8 w-8 rounded-md border border-border bg-muted/30 flex items-center justify-center text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground border border-border/60 bg-muted/30 px-2 py-0.5 rounded">
                          {t.category}
                        </span>
                      </div>
                      <h2 className="text-sm font-semibold text-foreground">{t.name}</h2>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {t.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-primary" />
                        {t.privacy}
                      </span>
                      <span className="font-semibold text-foreground hover:underline">
                        Open tool →
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
