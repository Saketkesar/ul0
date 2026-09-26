import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { UrlExpanderClient } from "./url-expander-client"
import { HelpCircle, ShieldCheck, AlertTriangle, Eye, Lock } from "lucide-react"

export const metadata: Metadata = {
  title: "URL Expander — Unshorten & Check Short Links Online | UL0",
  description: "Free online URL expander. Reveal the true destination of any shortened link (Bitly, TinyURL, t.co, etc.) and check safety before clicking.",
  alternates: {
    canonical: "https://ul0.site/tools/url-expander",
  },
  openGraph: {
    title: "URL Expander & Link Safety Checker — UL0 Tools",
    description: "Unshorten short links and preview destination pages safely.",
    url: "https://ul0.site/tools/url-expander",
    type: "website",
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why should I unshorten a link before clicking it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Short URLs conceal the actual destination web address. Malicious actors frequently use short links in phishing emails and SMS scams to bypass security filters. A URL expander reveals the final website domain, webpage title, and security status before you visit."
      }
    },
    {
      "@type": "Question",
      name: "Which short link services does the UL0 URL Expander support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "UL0 can expand links from all major shorteners including bit.ly, tinyurl.com, t.co, goo.gl, ow.ly, cutt.ly, is.gd, rebrandly, and custom branded short domains."
      }
    },
    {
      "@type": "Question",
      name: "Does unshortening a link execute any dangerous code on my computer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The inspection occurs securely on UL0's isolated server environment. No client-side JavaScript or trackers from the destination website are executed on your device."
      }
    }
  ]
}

export default function UrlExpanderPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-foreground">Tools</Link>
            <span>/</span>
            <span className="text-foreground">URL Expander</span>
          </div>

          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              URL Expander &amp; Link Safety Checker
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Unshorten any link to see where it really leads before clicking. Protect yourself against phishing scams, hidden redirects, and malicious domains.
            </p>
          </div>

          {/* Interactive Client Component */}
          <UrlExpanderClient />

          {/* Educational SEO Content */}
          <div className="mt-16 space-y-8 border-t border-border pt-12">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">How URL Expander Technology Protects Your Privacy</h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Short links are ubiquitous on social media platforms like X (Twitter), Discord, and SMS text messages. While they make links easier to share, they also obscure the destination server. When you submit a URL into UL0's URL Expander, our edge server executes an isolated HTTP trace that resolves all intermediate 301 and 302 hops without executing client-side scripts, cookies, or tracking pixels on your machine.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 text-xs">
              <div className="p-4 rounded-xl border border-border bg-card">
                <ShieldCheck className="h-5 w-5 text-emerald-500 mb-2" />
                <h4 className="font-bold text-foreground mb-1">Anti-Phishing Detection</h4>
                <p className="text-muted-foreground">Screens the target destination against active phishing databases and high-risk domain patterns.</p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card">
                <Lock className="h-5 w-5 text-blue-500 mb-2" />
                <h4 className="font-bold text-foreground mb-1">SSL Certificate Check</h4>
                <p className="text-muted-foreground">Verifies that the target website uses secure HTTPS encryption to protect your sensitive credentials.</p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card">
                <Eye className="h-5 w-5 text-purple-500 mb-2" />
                <h4 className="font-bold text-foreground mb-1">Metadata Preview</h4>
                <p className="text-muted-foreground">Extracts the destination page title, meta description, and official favicon before you visit.</p>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h3>
              <div className="space-y-3">
                {faqSchema.mainEntity.map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-border bg-card p-4">
                    <h4 className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                      <HelpCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{item.name}</span>
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed pl-5">
                      {item.acceptedAnswer.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
