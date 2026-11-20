import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { UL0Icon } from "@/components/ul0-icon"

export const metadata: Metadata = {
  title: "How to Export a Claude Conversation to PDF | UL0",
  description:
    "Step-by-step tutorial on exporting Claude AI chats to clean A4 PDFs. Formatted code blocks, document-style summaries, and zero data logging.",
  alternates: {
    canonical: "https://ul0.site/blog/how-to-export-claude-conversation-to-pdf",
  },
  openGraph: {
    title: "How to Export a Claude Conversation to PDF",
    description:
      "Learn how to export Anthropic Claude discussions and code artifacts into publication-quality PDFs using share links.",
    url: "https://ul0.site/blog/how-to-export-claude-conversation-to-pdf",
    type: "article",
    publishedTime: "2026-11-20",
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Export a Claude Conversation to PDF",
  description:
    "Step-by-step tutorial on exporting Claude AI chats to clean A4 PDFs with formatting for code and document summaries.",
  datePublished: "2026-11-20",
  dateModified: "2026-11-20",
  mainEntityOfPage: "https://ul0.site/blog/how-to-export-claude-conversation-to-pdf",
  author: {
    "@type": "Organization",
    name: "UL0 Team",
  },
  publisher: {
    "@type": "Organization",
    name: "UL0",
    logo: { "@type": "ImageObject", url: "https://ul0.site/ul0.png" },
  },
}

export default function HowToExportClaudeConversationToPdfPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <article className="container mx-auto px-4 max-w-3xl">
          <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-foreground">Guides</Link>
            <span>/</span>
            <span className="text-foreground">Export Claude to PDF</span>
          </nav>

          <header className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-3">
              <UL0Icon name="pdf" size={13} />
              <span>Claude Tutorial</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
              How to Export a Claude Conversation to PDF
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Claude produces thoughtful essays, structured architectural plans, and clean code. Here is how to convert your conversations into clean, beautiful A4 PDFs for offline reading or client deliverables.
            </p>
          </header>

          {/* Quick CTA Card */}
          <div className="my-8 p-6 rounded-2xl border border-primary/30 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-foreground">Ready to export your Claude chat?</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Paste your Claude share link for instant, private PDF generation.
              </p>
            </div>
            <Link
              href="/claude-chat-to-pdf"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 shrink-0"
            >
              <span>Open Claude to PDF Tool</span>
              &rarr;
            </Link>
          </div>

          <div className="space-y-8 text-sm leading-relaxed text-foreground/90">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">Step 1: Generate a Public Share Link in Claude</h2>
              <p>
                Anthropic makes sharing chats easy:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li>Open the conversation you want to export at <strong>claude.ai</strong>.</li>
                <li>Look at the top-right header or click the title dropdown.</li>
                <li>Click <strong>Share link to chat</strong>.</li>
                <li>Confirm and copy the generated link (starts with <code>claude.ai/share/</code>).</li>
              </ol>
            </section>

            <section className="space-y-3 border-t border-border pt-6">
              <h2 className="text-xl font-bold text-foreground">Step 2: Convert to A4 PDF with UL0</h2>
              <p>
                Head to the <Link href="/claude-chat-to-pdf" className="text-primary font-medium underline">Claude Chat to PDF</Link> tool:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li>Paste your Claude share link into the input box.</li>
                <li>Click <strong>Convert to PDF</strong>.</li>
                <li>The server securely fetches the conversation, formats the headings and monospace code, and returns a high-resolution A4 document.</li>
              </ul>
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-800 dark:text-emerald-300">
                <strong>Document Styling:</strong> If your chat is a summary or analysis with few prompts, UL0 automatically removes redundant &quot;User/Claude&quot; speaker labels and styles it as a clean executive report.
              </div>
            </section>

            <section className="space-y-3 border-t border-border pt-6">
              <h2 className="text-xl font-bold text-foreground">Privacy &amp; Security Considerations</h2>
              <p>
                When exporting AI conversations, confidentiality is essential. UL0 renders all documents in isolated, short-lived memory contexts with JavaScript disabled and never stores user data or logs URLs.
              </p>
            </section>
          </div>

          <footer className="mt-12 pt-8 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <Link href="/blog" className="hover:text-foreground">&larr; Back to Guides</Link>
            <Link href="/share-link-to-pdf" className="text-primary hover:underline">Universal Share Link to PDF &rarr;</Link>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  )
}
