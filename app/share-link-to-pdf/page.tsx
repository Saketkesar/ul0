import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChatToPdfForm } from "@/components/chat-to-pdf-form"
import { UL0Icon } from "@/components/ul0-icon"

export const metadata: Metadata = {
  title: "Share Link to PDF — Convert AI Chat Links to PDF | UL0",
  description:
    "Turn public Claude and ChatGPT share links into clean, printable PDFs. Intelligent notes, code, and chat formatting with zero storage.",
  alternates: {
    canonical: "https://ul0.site/share-link-to-pdf",
  },
  openGraph: {
    title: "Share Link to PDF — Convert AI Chat Links to PDF | UL0",
    description:
      "Convert public AI share links from ChatGPT and Claude into high-resolution, beautifully formatted A4 PDFs with zero storage.",
    url: "https://ul0.site/share-link-to-pdf",
    type: "website",
    siteName: "UL0",
    images: [
      {
        url: "https://ul0.site/ul0.png",
        width: 1200,
        height: 630,
        alt: "Convert AI Share Link to PDF",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Share Link to PDF — Convert AI Chat Links to PDF | UL0",
    description:
      "Turn public Claude and ChatGPT share links into clean, printable PDFs. Intelligent notes, code, and chat formatting with zero storage.",
    images: ["https://ul0.site/ul0.png"],
  },
}

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AI Share Link to PDF Converter",
  url: "https://ul0.site/share-link-to-pdf",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Universal free tool to convert Claude and ChatGPT public share links into styled A4 PDFs with auto-classification for notes, code, and chats.",
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Which AI chat share links are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We currently support public share links from Claude (claude.ai/share/...) and ChatGPT (chatgpt.com/share/...). You can also paste conversation text from any AI model.",
      },
    },
    {
      "@type": "Question",
      name: "How does the document classification work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our engine inspects message structure: conversations with 3+ code blocks get code-wrapping styling, Q&A summaries with headings become clean document notes without speaker labels, and multi-turn conversations use soft chat bubbles.",
      },
    },
    {
      "@type": "Question",
      name: "Do you log or retain conversation data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. UL0 never stores users' chats. URLs and message content are loaded in memory, compiled into a PDF with JavaScript disabled for security, and permanently discarded.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if a link is password protected or expired?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If a share link cannot be resolved publicly, the tool alerts you with a friendly message. You can use the 'Paste text instead' option to convert the text directly.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this on mobile devices?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The tool is fully responsive and runs smoothly in mobile Safari, Chrome, and Firefox on iOS and Android.",
      },
    },
  ],
}

export default function ShareLinkToPdfPage() {
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
            <span className="text-foreground">Share Link to PDF</span>
          </nav>

          {/* Above-the-fold Hero & Tool */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-3 select-none">
              <UL0Icon name="pdf" size={13} />
              <span>Universal AI Chat Converter</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-3">
              Convert AI Share Link to PDF
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Convert public Claude or ChatGPT share links into clean, minimal PDFs. Intelligent formatting detects notes, code, and chat transcripts automatically.
            </p>
          </div>

          {/* Interactive Tool Component Above the Fold */}
          <div className="mb-14">
            <ChatToPdfForm
              defaultPlatform="any"
              initialPlaceholder="https://claude.ai/share/... or https://chatgpt.com/share/..."
            />
          </div>

          {/* Short How-It-Works Steps */}
          <section className="mb-14 border-t border-border pt-10">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground text-center mb-8">
              Fast, Private AI Export in 3 Steps
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="p-5 rounded-2xl border border-border bg-card">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-sm mb-3">
                  1
                </div>
                <h3 className="font-bold text-sm text-foreground mb-1.5">Paste Public Share Link</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Works with share links from Claude and ChatGPT. Or paste markdown text directly.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-card">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-sm mb-3">
                  2
                </div>
                <h3 className="font-bold text-sm text-foreground mb-1.5">Automatic Layout Detection</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Identifies code blocks, topic headers, lists, and dialogues to pick the optimal typography layout.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-card">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-sm mb-3">
                  3
                </div>
                <h3 className="font-bold text-sm text-foreground mb-1.5">Download Formatted PDF</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enjoy clean page numbers, wrapped code blocks, and crisp print styling with zero watermarks.
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
                Common questions about converting AI share links to PDF.
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

          {/* Privacy Note & Blog Guides */}
          <div className="p-6 rounded-2xl border border-border bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2.5">
              <UL0Icon name="shield" size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span><strong>Privacy Guarantee:</strong> We don&apos;t store your chats. No logging, no tracking.</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/blog/how-to-share-chatgpt-claude-chat-link"
                className="text-primary font-medium hover:underline"
              >
                How to Share AI Chat Links &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
