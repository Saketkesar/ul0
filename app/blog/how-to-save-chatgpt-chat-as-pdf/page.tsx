import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { UL0Icon } from "@/components/ul0-icon"

export const metadata: Metadata = {
  title: "How to Save a ChatGPT Chat as PDF (3 Easy Methods) | UL0",
  description:
    "Learn 3 simple ways to save and export ChatGPT chats as clean, printable A4 PDFs. Includes link conversion, browser printing, and formatting tips.",
  alternates: {
    canonical: "https://ul0.site/blog/how-to-save-chatgpt-chat-as-pdf",
  },
  openGraph: {
    title: "How to Save a ChatGPT Chat as PDF (3 Easy Methods)",
    description:
      "Save your ChatGPT discussions, research notes, and code snippets into clean PDFs without cutting off code or dealing with messy browser headers.",
    url: "https://ul0.site/blog/how-to-save-chatgpt-chat-as-pdf",
    type: "article",
    publishedTime: "2026-11-20",
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Save a ChatGPT Chat as PDF (3 Easy Methods)",
  description:
    "Learn 3 simple ways to save and export ChatGPT chats as clean, printable A4 PDFs. Includes link conversion, browser printing, and formatting tips.",
  datePublished: "2026-11-20",
  dateModified: "2026-11-20",
  mainEntityOfPage: "https://ul0.site/blog/how-to-save-chatgpt-chat-as-pdf",
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

export default function HowToSaveChatGPTChatAsPdfPage() {
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
            <span className="text-foreground">Save ChatGPT as PDF</span>
          </nav>

          <header className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-3">
              <UL0Icon name="pdf" size={13} />
              <span>Step-by-Step Guide</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
              How to Save a ChatGPT Chat as PDF
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Whether you need to archive important research, share code walkthroughs with coworkers, or print discussion notes, here is how to export your ChatGPT conversations into clean, formatted PDFs.
            </p>
          </header>

          {/* Quick CTA Card */}
          <div className="my-8 p-6 rounded-2xl border border-primary/30 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-foreground">Have a ChatGPT link ready?</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Convert your public share link into a clean A4 PDF in under 5 seconds.
              </p>
            </div>
            <Link
              href="/chatgpt-chat-to-pdf"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 shrink-0"
            >
              <span>Open ChatGPT to PDF Tool</span>
              &rarr;
            </Link>
          </div>

          <div className="space-y-8 text-sm leading-relaxed text-foreground/90">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">Method 1: Use UL0 ChatGPT Share Link to PDF (Fastest &amp; Cleanest)</h2>
              <p>
                Default browser printing often cuts off code blocks, captures awkward web sidebar navigation, and leaves unreadable margins. UL0&apos;s free converter formats the raw conversation into publication-grade documents.
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li>Open your conversation in ChatGPT.</li>
                <li>Click the <strong>Share</strong> button (top right of the window) and select <strong>Copy Link</strong>.</li>
                <li>Visit the <Link href="/chatgpt-chat-to-pdf" className="text-primary font-medium underline">ChatGPT to PDF converter</Link> (or <Link href="/share-link-to-pdf" className="text-primary font-medium underline">Share Link to PDF</Link>).</li>
                <li>Paste the URL and click <strong>Convert to PDF</strong>.</li>
              </ol>
              <p className="text-xs text-muted-foreground">
                The engine detects if your chat is predominantly code, structured notes, or dialogue and styles tables, wrapped monospace snippets, and page numbers automatically.
              </p>
            </section>

            <section className="space-y-3 border-t border-border pt-6">
              <h2 className="text-xl font-bold text-foreground">Method 2: Browser Print to PDF (Built-in)</h2>
              <p>
                If you prefer not creating a share link, you can use your browser&apos;s native Print dialog:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li>Press <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono text-xs">Ctrl + P</kbd> (Windows) or <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono text-xs">Cmd + P</kbd> (Mac).</li>
                <li>Set Destination to <strong>Save as PDF</strong>.</li>
                <li>Uncheck <em>Headers and footers</em> to prevent URLs and date stamps from cluttering margins.</li>
                <li>Click <strong>Save</strong>.</li>
              </ul>
              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-amber-800 dark:text-amber-300">
                <strong>Limitation:</strong> Long code blocks may overflow horizontally off the page or be split awkwardly across page breaks.
              </div>
            </section>

            <section className="space-y-3 border-t border-border pt-6">
              <h2 className="text-xl font-bold text-foreground">Method 3: Paste Text Fallback</h2>
              <p>
                If your conversation contains private company tokens or you don&apos;t want to publish a public share link, you can copy the message text directly:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li>Select and copy the chat text or markdown from ChatGPT.</li>
                <li>Go to <Link href="/chatgpt-chat-to-pdf" className="text-primary underline">ChatGPT to PDF</Link> and click <strong>Paste text instead</strong>.</li>
                <li>Paste your text into the box and click Convert. The server compiles it into an A4 document without saving any data.</li>
              </ol>
            </section>
          </div>

          <footer className="mt-12 pt-8 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <Link href="/blog" className="hover:text-foreground">&larr; Back to Guides</Link>
            <Link href="/claude-chat-to-pdf" className="text-primary hover:underline">Converting Claude chats? Read the Claude guide &rarr;</Link>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  )
}
