import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { UL0Icon } from "@/components/ul0-icon"

export const metadata: Metadata = {
  title: "How to Share a ChatGPT or Claude Chat Link | UL0",
  description:
    "Simple guide on creating public share links in ChatGPT and Claude. Learn how link sharing works, what recipients see, and how to export as PDF.",
  alternates: {
    canonical: "https://ul0.site/blog/how-to-share-chatgpt-claude-chat-link",
  },
  openGraph: {
    title: "How to Share a ChatGPT or Claude Chat Link",
    description:
      "Quick guide on how to create, manage, and export public share links in ChatGPT and Claude.ai.",
    url: "https://ul0.site/blog/how-to-share-chatgpt-claude-chat-link",
    type: "article",
    publishedTime: "2026-11-20",
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Share a ChatGPT or Claude Chat Link",
  description:
    "Simple guide on creating public share links in ChatGPT and Claude, what recipients see, and how to export as PDF.",
  datePublished: "2026-11-20",
  dateModified: "2026-11-20",
  mainEntityOfPage: "https://ul0.site/blog/how-to-share-chatgpt-claude-chat-link",
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

export default function HowToShareChatGptClaudeChatLinkPage() {
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
            <span className="text-foreground">Share AI Chat Links</span>
          </nav>

          <header className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-3">
              <UL0Icon name="link" size={13} />
              <span>How-To Guide</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
              How to Share a ChatGPT or Claude Chat Link
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Public share links let you send AI conversations to clients, students, or team members without giving access to your private account. Here is how to create them in both ChatGPT and Claude.
            </p>
          </header>

          <div className="space-y-8 text-sm leading-relaxed text-foreground/90">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">1. Creating a Share Link in ChatGPT</h2>
              <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li>Log in to <strong>chatgpt.com</strong> and open the conversation you want to share.</li>
                <li>Click the <strong>Share</strong> icon located at the top-right of the chat window.</li>
                <li>In the dialog that appears, click <strong>Create Link</strong> or <strong>Copy Link</strong>.</li>
                <li>The link will look like <code>https://chatgpt.com/share/xxxx-xxxx</code>.</li>
              </ol>
              <p className="text-xs text-muted-foreground">
                <em>Note:</em> Anyone with the link can view the conversation up to the point it was shared. Future messages added after sharing will not automatically appear unless you update the shared link.
              </p>
            </section>

            <section className="space-y-3 border-t border-border pt-6">
              <h2 className="text-xl font-bold text-foreground">2. Creating a Share Link in Claude</h2>
              <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li>Log in to <strong>claude.ai</strong> and select your conversation.</li>
                <li>Click the title or the menu button at the top of the chat.</li>
                <li>Select <strong>Share link to chat</strong>.</li>
                <li>Click <strong>Copy Link</strong>. The URL format is <code>https://claude.ai/share/xxxx-xxxx</code>.</li>
              </ol>
            </section>

            <section className="space-y-3 border-t border-border pt-6">
              <h2 className="text-xl font-bold text-foreground">3. Converting Shared Links into Clean PDFs</h2>
              <p>
                If your recipient prefers an offline document, or you need to archive the discussion for documentation, you can convert the link directly into an A4 PDF:
              </p>
              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <Link
                  href="/claude-chat-to-pdf"
                  className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors block"
                >
                  <div className="font-bold text-sm text-foreground mb-1">Convert Claude to PDF &rarr;</div>
                  <div className="text-xs text-muted-foreground">Export Claude share links into clean document notes or code PDFs.</div>
                </Link>
                <Link
                  href="/chatgpt-chat-to-pdf"
                  className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors block"
                >
                  <div className="font-bold text-sm text-foreground mb-1">Convert ChatGPT to PDF &rarr;</div>
                  <div className="text-xs text-muted-foreground">Save ChatGPT share links with wrapped monospace blocks and page numbers.</div>
                </Link>
              </div>
            </section>
          </div>

          <footer className="mt-12 pt-8 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <Link href="/blog" className="hover:text-foreground">&larr; Back to Guides</Link>
            <Link href="/share-link-to-pdf" className="text-primary hover:underline">Try Universal Share Link to PDF &rarr;</Link>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  )
}
