import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChatToPdfForm } from "@/components/chat-to-pdf-form"
import { UL0Icon } from "@/components/ul0-icon"

export const metadata: Metadata = {
  title: "Claude Chat to PDF — Convert Claude Links to PDF",
  description:
    "Convert public Claude share links into clean, minimal A4 PDFs. Document styling, code blocks, page numbers. Free, private, no signup.",
  alternates: {
    canonical: "https://ul0.site/claude-chat-to-pdf",
  },
  openGraph: {
    title: "Claude Chat to PDF — Convert Claude Links to PDF | UL0",
    description:
      "Turn any public Claude share link into a clean, minimal A4 PDF. Formatted code blocks, document summaries, and page numbers.",
    url: "https://ul0.site/claude-chat-to-pdf",
    type: "website",
    siteName: "UL0",
    images: [
      {
        url: "https://ul0.site/ul0.png",
        width: 1200,
        height: 630,
        alt: "Convert Claude Chat to PDF",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Chat to PDF — Convert Claude Links to PDF | UL0",
    description:
      "Convert public Claude share links into clean, minimal A4 PDFs. Document styling, code blocks, page numbers. Free, private, no signup.",
    images: ["https://ul0.site/ul0.png"],
  },
}

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Claude Chat to PDF Converter",
  url: "https://ul0.site/claude-chat-to-pdf",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online tool to convert public Claude.ai share links into clean, formatted A4 PDFs with smart document styling and wrapped code blocks.",
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I get a Claude public share link?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "In your Claude chat, click the Share icon or the conversation title menu in the top right, select 'Share link to chat', and copy the generated link (e.g. claude.ai/share/...).",
      },
    },
    {
      "@type": "Question",
      name: "Does UL0 store my Claude conversation or data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. UL0 never stores users' chats. We do not log URLs, messages, or generated PDFs. All rendering happens in ephemeral memory and is discarded immediately after download.",
      },
    },
    {
      "@type": "Question",
      name: "How does it handle code blocks and technical notes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Conversations with 3 or more code blocks are automatically classified as Code documents. Code blocks wrap cleanly with monospace styling and are protected against splitting across page breaks.",
      },
    },
    {
      "@type": "Question",
      name: "What should I do if my Claude link cannot be read?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ensure your Claude chat share link is public. If Claude is undergoing maintenance or the link is restricted, click 'Paste text instead' on our tool to paste your conversation text directly.",
      },
    },
    {
      "@type": "Question",
      name: "Is Claude Chat to PDF completely free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, it is 100% free with no account creation, no subscriptions, and no watermarks on your generated PDFs.",
      },
    },
  ],
}

export default function ClaudeChatToPdfPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />

      <main className="flex-1 py-10 sm:py-14">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-foreground">
              Tools
            </Link>
            <span>/</span>
            <span className="text-foreground">Claude to PDF</span>
          </nav>

          {/* Above-the-fold Hero & Tool */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D97757]/10 border border-[#D97757]/20 text-[#D97757] text-xs font-semibold mb-3 select-none">
              <UL0Icon name="claude" size={16} />
              <span>Claude to PDF Converter</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-3">
              Convert Claude Chat to PDF
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Paste your public Claude share link to export clean, minimal A4 PDFs. Automatically formats code snippets, notes, and discussions with clean typography.
            </p>
          </div>

          {/* Interactive Tool Component Above the Fold */}
          <div className="mb-14">
            <ChatToPdfForm
              defaultPlatform="claude"
              initialPlaceholder="https://claude.ai/share/..."
            />
          </div>

          {/* Short How-It-Works Steps */}
          <section className="mb-14 border-t border-border pt-10">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground text-center mb-8">
              How to Convert a Claude Share Link in 3 Steps
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="p-5 rounded-2xl border border-border bg-card">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-sm mb-3">
                  1
                </div>
                <h3 className="font-bold text-sm text-foreground mb-1.5">Copy Claude Share Link</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  In Claude, open your chat, click the Share button, and copy your public conversation link.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-card">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-sm mb-3">
                  2
                </div>
                <h3 className="font-bold text-sm text-foreground mb-1.5">Paste &amp; Convert</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Paste the URL into the input field above and click Convert. Our server parses headings, code, and turns.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-card">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-sm mb-3">
                  3
                </div>
                <h3 className="font-bold text-sm text-foreground mb-1.5">Download High-Res PDF</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Get your publication-ready A4 PDF with automatic page numbering, wrapped code, and clean formatting.
                </p>
              </div>
            </div>
          </section>

          {/* 5-Question FAQ */}
          <section className="mb-14 border-t border-border pt-10">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Everything you need to know about exporting Claude AI chats to PDF.
              </p>
            </div>

            <div className="space-y-4">
              {faqSchema.mainEntity.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-card p-5 transition-colors"
                >
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    {item.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.acceptedAnswer.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Privacy & Guide Links */}
          <div className="p-6 rounded-2xl border border-border bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2.5">
              <UL0Icon name="shield" size={18} className="text-emerald-600 shrink-0" />
              <span><strong>Privacy Guarantee:</strong> We don&apos;t store your chats, log URLs, or retain PDFs.</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/blog/how-to-export-claude-conversation-to-pdf"
                className="text-primary font-medium hover:underline"
              >
                Read Claude PDF Guide &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
