import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PdfSplitterClient } from "./pdf-splitter-client"
import { HelpCircle, ShieldCheck, Zap, Scissors, Layers, Download, CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "PDF Splitter — Extract, Rename & Download Pages Separately Online | UL0",
  description:
    "Free online PDF splitter. Upload any multi-page PDF (30+ pages), display all pages line-by-line with instant previews, rename files, and download single pages or selected batches as separate PDFs.",
  alternates: {
    canonical: "https://ul0.site/tools/pdf-splitter",
  },
  openGraph: {
    title: "PDF Page Splitter & Extractor — UL0 Free Tools",
    description:
      "Split multi-page PDFs page-by-page. Rename individual pages, download single-page PDFs, or merge selected pages.",
    url: "https://ul0.site/tools/pdf-splitter",
    type: "website",
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Are my uploaded PDF files stored on any server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All PDF splitting, page rendering, and file exports happen 100% client-side inside your browser via WebAssembly and pdf-lib. Your confidential documents, contracts, and receipts never leave your computer or phone.",
      },
    },
    {
      "@type": "Question",
      name: "Can I download each page of a 30-page PDF separately?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every single page displays in a clear line-by-line list with its own 1-click Download button. You can download single pages individually or click 'Download All as ZIP' to receive all separated pages at once.",
      },
    },
    {
      "@type": "Question",
      name: "Can I select specific pages (e.g. 2 pages) and combine them into a new PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Simply check the boxes next to the pages you want (e.g., Page 1 and Page 2) and click 'Merge Selected' to create a new, custom PDF containing only those chosen pages.",
      },
    },
    {
      "@type": "Question",
      name: "Does splitting reduce the quality or resolution of the PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not at all. UL0 extracts the exact vector page stream directly from the original PDF file, preserving all original text layers, embedded fonts, high-resolution vector graphics, and metadata with zero compression loss.",
      },
    },
  ],
}

export default function PdfSplitterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-foreground">
              Tools
            </Link>
            <span>/</span>
            <span className="text-foreground">PDF Splitter</span>
          </div>

          {/* Heading */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
              <Scissors className="h-3.5 w-3.5" />
              <span>100% Client-Side • Private &amp; Instant</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              PDF Page Splitter &amp; Extractor
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Upload any PDF with 5, 30, or 100+ pages. View all pages line-by-line, rename each page, and download single pages separately or merge selected pages into a new PDF.
            </p>
          </div>

          {/* Interactive Splitter Component */}
          <PdfSplitterClient />

          {/* Feature highlights & SEO Educational Content */}
          <div className="mt-16 space-y-8 border-t border-border pt-12">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">
                Why Professionals Choose UL0 to Split &amp; Organize PDFs
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Most online PDF splitters force you to upload sensitive files to remote cloud servers, enforce artificial file size limits, or watermark your downloads. UL0 processes your documents directly inside your web browser using modern WebAssembly and native PDF manipulation engines.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 text-xs">
              <div className="p-4 rounded-xl border border-border bg-card">
                <ShieldCheck className="h-5 w-5 text-emerald-500 mb-2" />
                <h4 className="font-bold text-foreground mb-1">Zero Cloud Uploads</h4>
                <p className="text-muted-foreground">
                  Your files remain strictly inside your browser memory. Ideal for confidential legal filings, financial statements, and contracts.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card">
                <Layers className="h-5 w-5 text-blue-500 mb-2" />
                <h4 className="font-bold text-foreground mb-1">Exact Vector Preservation</h4>
                <p className="text-muted-foreground">
                  Extracted pages preserve 100% of their original crisp text, embedded fonts, and vector artwork without re-encoding.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card">
                <Download className="h-5 w-5 text-purple-500 mb-2" />
                <h4 className="font-bold text-foreground mb-1">Flexible Batch Downloads</h4>
                <p className="text-muted-foreground">
                  Download individual single pages with custom filenames, merge selected pages, or download everything as a ZIP package.
                </p>
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
