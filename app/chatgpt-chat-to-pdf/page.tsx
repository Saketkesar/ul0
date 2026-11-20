import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChatToPdfForm } from "@/components/chat-to-pdf-form"
import { UL0Icon } from "@/components/ul0-icon"

export const metadata: Metadata = {
  title: "ChatGPT to PDF — Save ChatGPT Share Links as PDF | UL0",
  description:
    "Convert ChatGPT share links into clean, formatted A4 PDFs. Auto-detects code, notes, and conversations. Free, private, no registration.",
  alternates: {
    canonical: "https://ul0.site/chatgpt-chat-to-pdf",
  },
  openGraph: {
    title: "ChatGPT to PDF — Save ChatGPT Share Links as PDF | UL0",
    description:
      "Transform any public ChatGPT conversation into a beautiful, printable A4 PDF. Formats markdown, tables, and code snippets.",
    url: "https://ul0.site/chatgpt-chat-to-pdf",
    type: "website",
    siteName: "UL0",
    images: [
      {
        url: "https://ul0.site/ul0.png",
        width: 1200,
        height: 630,
        alt: "Convert ChatGPT Chat to PDF",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChatGPT to PDF — Save ChatGPT Share Links as PDF | UL0",
    description:
      "Convert ChatGPT share links into clean, formatted A4 PDFs. Auto-detects code, notes, and conversations. Free, private, no registration.",
    images: ["https://ul0.site/ul0.png"],
  },
}

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ChatGPT to PDF Converter",
  url: "https://ul0.site/chatgpt-chat-to-pdf",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free web tool to convert public chatgpt.com share links into clean, minimal A4 PDFs with intelligent classification for code and notes.",
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I create a public share link in ChatGPT?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "In ChatGPT, click the Share icon at the top right of your chat or next to the conversation in the sidebar, then click 'Copy Link' (chatgpt.com/share/...).",
      },
    },
    {
      "@type": "Question",
      name: "Are my ChatGPT conversations stored on your servers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Never. We do not store your chats or log URLs. All message extraction and PDF rendering happen in temporary memory and are immediately deleted.",
      },
    },
    {
      "@type": "Question",
      name: "How does it format code blocks and tables?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Technical chats are rendered in dark monospace containers with soft word wrapping so long code lines don't get truncated. Code blocks and tables avoid splitting across pages.",
      },
    },
    {
      "@type": "Question",
      name: "Why did my ChatGPT link fail to convert?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Make sure your link is public and has not been deleted or updated to private. You can also use the 'Paste text instead' option to paste the text directly.",
      },
    },
    {
      "@type": "Question",
      name: "Can I paste chat text instead of sharing a link?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Click 'Paste text instead' below the URL bar to paste your prompt, ChatGPT response, or raw markdown, and we will format and export it into a clean A4 PDF.",
      },
    },
  ],
}

export default function ChatGptChatToPdfPage() {
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
            <span className="text-foreground">ChatGPT to PDF</span>
          </nav>

          {/* Above-the-fold Hero & Tool */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-3 select-none">
              <UL0Icon name="chatgpt" size={16} />
              <span>ChatGPT to PDF Utility</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-3">
              Convert ChatGPT Chat to PDF
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Export public ChatGPT conversations into beautiful A4 documents. Formatted for readability with soft chat bubbles, code highlights, and page numbers.
            </p>
          </div>

          {/* Interactive Tool Component Above the Fold */}
          <div className="mb-14">
            <ChatToPdfForm
              defaultPlatform="chatgpt"
              initialPlaceholder="https://chatgpt.com/share/..."
            />
          </div>

          {/* Short How-It-Works Steps */}
          <section className="mb-14 border-t border-border pt-10">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground text-center mb-8">
              How to Convert a ChatGPT Chat to PDF
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="p-5 rounded-2xl border border-border bg-card">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-sm mb-3">
                  1
                </div>
                <h3 className="font-bold text-sm text-foreground mb-1.5">Copy ChatGPT Share URL</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Click the Share button on any ChatGPT conversation and select &quot;Copy Link&quot; (chatgpt.com/share/...).
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-card">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-sm mb-3">
                  2
                </div>
                <h3 className="font-bold text-sm text-foreground mb-1.5">Paste &amp; Click Convert</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enter the URL above. Our engine classifies your chat into notes, technical code, or conversation.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-card">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-sm mb-3">
                  3
                </div>
                <h3 className="font-bold text-sm text-foreground mb-1.5">Download Clean PDF</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Receive your clean A4 PDF file ready for printing, archiving, or sharing with your team.
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
                Answers to common questions about saving ChatGPT conversations as PDF files.
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
              <UL0Icon name="shield" size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span><strong>Privacy Note:</strong> We don&apos;t store your chats. Transcripts are never logged or cached.</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/blog/how-to-save-chatgpt-chat-as-pdf"
                className="text-primary font-medium hover:underline"
              >
                Read ChatGPT PDF Guide &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
