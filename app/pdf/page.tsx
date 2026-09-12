import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PdfTools } from "@/components/pdf-tools"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  ImageIcon,
  FileStack,
  ScanLine,
  Shield,
  Zap,
  Globe,
  Lock,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Free PDF Tools Online — Image to PDF, Merge PDFs & Document Scanner | ul0",
  description:
    "Convert images to PDF, merge multiple PDFs, and scan documents with your camera — all free, no signup, no upload. 100% client-side processing for maximum privacy. Works on desktop and mobile.",
  keywords: [
    "image to pdf converter free",
    "convert images to pdf online",
    "merge pdf files free",
    "combine pdf online",
    "document scanner app",
    "scan document to pdf free",
    "pdf tools online free",
    "photo to pdf converter",
    "jpg to pdf",
    "png to pdf",
    "merge pdf no signup",
    "free pdf merger",
    "online document scanner",
    "camera to pdf",
    "pdf creator free",
    "best free pdf tools 2026",
    "image to pdf no upload",
    "client side pdf converter",
    "private pdf tools",
    "pdf tools no watermark",
  ],
  alternates: {
    canonical: "https://ul0.site/pdf",
  },
  openGraph: {
    title: "Free PDF Tools — Image to PDF, Merge PDFs & Document Scanner | ul0",
    description:
      "Convert images to PDF, merge PDFs, and scan documents — all free, no signup, 100% private.",
    url: "https://ul0.site/pdf",
    type: "website",
    siteName: "ul0",
    images: [
      {
        url: "https://ul0.site/ul0.png",
        width: 1200,
        height: 630,
        alt: "ul0 Free PDF Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Tools Online | ul0",
    description:
      "Image to PDF, Merge PDFs, Document Scanner — all free, no signup, no upload required.",
    images: ["https://ul0.site/ul0.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

// JSON-LD structured data
const pdfToolsSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "ul0 PDF Tools",
      url: "https://ul0.site/pdf",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "Free online PDF tools: convert images to PDF, merge multiple PDFs, and scan documents with your camera. 100% client-side — files never leave your device.",
      screenshot: "https://ul0.site/ul0.png",
      author: {
        "@type": "Organization",
        name: "ul0",
        url: "https://ul0.site",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "127",
        bestRating: "5",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is ul0 PDF Tools really free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, all PDF tools on ul0 are completely free with no signup required. There are no watermarks, no file limits, and no hidden fees.",
          },
        },
        {
          "@type": "Question",
          name: "Are my files uploaded to a server?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. All processing happens directly in your browser. Your files never leave your device, making ul0 PDF Tools the most private PDF solution available.",
          },
        },
        {
          "@type": "Question",
          name: "Can I scan documents using my phone camera?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The Document Scanner tool uses your device's camera to capture document images with auto-contrast enhancement and an A4 guide overlay. Works on both mobile and desktop browsers.",
          },
        },
        {
          "@type": "Question",
          name: "What image formats can I convert to PDF?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can convert JPG, PNG, WebP, GIF, and BMP images to PDF. There's no limit on the number of images you can include.",
          },
        },
      ],
    },
  ],
}

export default function PdfPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pdfToolsSchema) }}
      />
      <Header />

      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Hero section */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary" className="gap-1">
                <FileText className="h-3 w-3" />
                PDF Tools
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Lock className="h-3 w-3" />
                100% Private
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text">
              Free PDF Tools — No Signup, No Upload
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Convert images to PDF, merge multiple PDFs, or scan documents with your camera.
              Everything runs in your browser — your files never leave your device.
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            {[
              { icon: Shield, text: "No upload — 100% client-side" },
              { icon: Zap, text: "Instant processing" },
              { icon: Globe, text: "Works on any device" },
              { icon: Lock, text: "No watermarks" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 border border-border/50 rounded-full text-xs text-muted-foreground"
              >
                <Icon className="h-3.5 w-3.5 text-primary" />
                {text}
              </div>
            ))}
          </div>

          {/* Main tool */}
          <PdfTools />

          {/* SEO content section */}
          <section className="mt-16 space-y-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-center">
              Why Use ul0 PDF Tools?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  icon: ImageIcon,
                  title: "Image to PDF Converter",
                  desc: "Upload JPG, PNG, or WebP images and instantly convert them into a single PDF document. Set page size (A4, Letter, Legal), orientation, and custom filename. Perfect for creating photo albums, portfolios, or document archives.",
                },
                {
                  icon: FileStack,
                  title: "Merge PDF Files",
                  desc: "Combine multiple PDF files into one document. Drag to reorder pages, see page counts, and download the merged result. Great for combining contracts, reports, or presentation slides.",
                },
                {
                  icon: ScanLine,
                  title: "Document Scanner",
                  desc: "Use your phone or laptop camera to scan physical documents. The scanner includes an A4 aspect ratio guide overlay and automatic contrast enhancement for cleaner scans. Export as PDF with a custom filename.",
                },
                {
                  icon: Shield,
                  title: "Privacy-First Processing",
                  desc: "Unlike other PDF tools, ul0 processes everything in your browser using JavaScript. Your files are never uploaded to any server. No account required, no data collection, no tracking.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="p-5 bg-card rounded-2xl border border-border/60 hover:border-primary/30 transition-colors"
                >
                  <Icon className="h-6 w-6 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            {/* FAQ section for SEO */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-center mt-12">
                Frequently Asked Questions
              </h2>
              {[
                {
                  q: "Is ul0 PDF Tools really free?",
                  a: "Yes, all PDF tools on ul0 are completely free with no signup required. There are no watermarks, no file limits, and no hidden fees.",
                },
                {
                  q: "Are my files uploaded to a server?",
                  a: "No. All processing happens directly in your browser using JavaScript. Your files never leave your device, making this the most private PDF solution available.",
                },
                {
                  q: "Can I scan documents using my phone camera?",
                  a: "Yes. The Document Scanner tool uses your device's camera to capture document images with auto-contrast enhancement and an A4 guide overlay. Works on both mobile and desktop browsers.",
                },
                {
                  q: "What image formats can I convert to PDF?",
                  a: "You can convert JPG, PNG, WebP, GIF, and BMP images to PDF. There is no limit on the number of images you can include in a single PDF.",
                },
                {
                  q: "How many PDFs can I merge at once?",
                  a: "There is no limit. You can merge as many PDF files as your browser's memory allows. The merge operation preserves all pages, formatting, and metadata.",
                },
              ].map(({ q, a }) => (
                <details
                  key={q}
                  className="group p-4 bg-muted/20 rounded-xl border border-border/40 cursor-pointer"
                >
                  <summary className="font-medium text-sm list-none flex items-center justify-between">
                    {q}
                    <ChevronIcon />
                  </summary>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function ChevronIcon() {
  return (
    <svg
      className="h-4 w-4 text-muted-foreground group-open:rotate-180 transition-transform"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}
