import React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { UL0Icon } from "@/components/ul0-icon"

export const metadata: Metadata = {
  title: "How to Create a WhatsApp Link with Message (Free 2026 Generator) | UL0",
  description: "Learn how to generate free WhatsApp direct chat links with custom pre-filled messages. No app required. Convert website visitors into WhatsApp conversations.",
  keywords: [
    "whatsapp link generator",
    "whatsapp link with message",
    "how to create whatsapp link",
    "wa me link generator free",
    "whatsapp direct message link",
    "create whatsapp chat link",
    "whatsapp click to chat link generator",
  ],
  alternates: {
    canonical: "https://ul0.site/blog/whatsapp-link-generator-guide",
  },
  openGraph: {
    title: "How to Create a WhatsApp Link with Message (Free 2026 Generator)",
    description: "Convert social and web visitors into instant WhatsApp leads. Create a free wa.me link with pre-filled text in seconds.",
    url: "https://ul0.site/blog/whatsapp-link-generator-guide",
    type: "article",
    publishedTime: "2026-11-10",
    images: [{
      url: "https://ul0.site/api/og/blog?title=How%20to%20Create%20a%20WhatsApp%20Link%20with%20Message&category=WHATSAPP%20TUTORIAL",
      width: 1200,
      height: 630,
      alt: "WhatsApp Link Generator Guide",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Create a WhatsApp Link with Message (Free 2026 Generator)",
    description: "Convert social and web visitors into instant WhatsApp leads. Create a free wa.me link with pre-filled text in seconds.",
    images: ["https://ul0.site/api/og/blog?title=How%20to%20Create%20a%20WhatsApp%20Link%20with%20Message&category=WHATSAPP%20TUTORIAL"],
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Create a WhatsApp Link with Message (Free 2026 Generator)",
  description: "Complete tutorial on generating WhatsApp Click-to-Chat links with custom pre-filled messages and dynamic QR codes.",
  image: "https://ul0.site/social-card.png",
  datePublished: "2026-11-10",
  dateModified: "2026-11-10",
  author: {
    "@type": "Person",
    name: "Saket Kesar",
    url: "https://ul0.site/about",
  },
  publisher: {
    "@type": "Organization",
    name: "UL0",
    logo: { "@type": "ImageObject", url: "https://ul0.site/ul0.png" },
  },
  mainEntityOfPage: "https://ul0.site/blog/whatsapp-link-generator-guide",
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does a WhatsApp link with a pre-filled message work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "WhatsApp Click-to-Chat utilizes the official WhatsApp API URL schema: https://wa.me/<phone>?text=<encoded_text>. When a customer taps your link, WhatsApp automatically opens a 1-on-1 chat with your phone number and pre-populates your specified message in the text input.",
      },
    },
    {
      "@type": "Question",
      name: "Do customers need to save my phone number to their contacts first?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. With WhatsApp Click-to-Chat links, users do not need to save your contact in their address book. Tapping the link opens the conversation immediately on mobile or WhatsApp Web.",
      },
    },
    {
      "@type": "Question",
      name: "How should international country codes be formatted?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Always use international format without plus signs, spaces, dashes, or leading zeros. For example, a US number (+1 555 123 4567) becomes 15551234567, and an Indian number (+91 98765 43210) becomes 919876543210.",
      },
    },
    {
      "@type": "Question",
      name: "Can I shorten my WhatsApp link or turn it into a QR code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can paste your wa.me URL into UL0's free URL shortener to create a clean branded link (e.g., yourbrand.link/chat) and instantly generate an accompanying vector QR code for print marketing, product packaging, and storefronts.",
      },
    },
  ],
}

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Create a Free WhatsApp Click-to-Chat Link",
  step: [
    {
      "@type": "HowToStep",
      name: "Enter your phone number with country code",
      text: "Input your full WhatsApp phone number in international format without plus signs (+), parentheses, or spaces.",
    },
    {
      "@type": "HowToStep",
      name: "Type your pre-filled inquiry message",
      text: "Draft the pre-filled template message your customers will send (e.g., 'Hi, I would like to book a consultation').",
    },
    {
      "@type": "HowToStep",
      name: "Generate and shorten the link",
      text: "Click generate to receive your instant wa.me link, short branded alias, and printable vector QR code.",
    },
  ],
}

export default function WhatsAppLinkGeneratorGuidePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <article className="container mx-auto px-4 max-w-4xl space-y-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <UL0Icon name="arrowleft" className="h-4 w-4 mr-1.5" />
            <span>Back to All Guides</span>
          </Link>

          <header className="space-y-4 border-b border-border pb-8">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full flex items-center gap-1.5">
                <UL0Icon name="whatsapp" className="h-3.5 w-3.5" /> WhatsApp Marketing Tutorial
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
              How to Create a WhatsApp Link with Message (Free 2026 Generator)
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Eliminate contact friction. Turn website traffic, Instagram followers, and QR code scans into high-converting 1-on-1 WhatsApp conversations with zero app download or saved contact requirements.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
              <span>Author: <strong className="text-foreground">Saket Kesar</strong></span>
              <span>•</span>
              <span>Published: November 10, 2026</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
          </header>

          <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground text-sm sm:text-base leading-relaxed space-y-6">
            <p className="text-lg leading-relaxed text-foreground font-medium">
              Over 2.7 billion people use WhatsApp daily. If your customer has to manually type your phone number, save you to their phone address book, and search for you in their contact list, you lose over <strong>60% of potential leads</strong> before they ever say hello.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8">
              What is a WhatsApp Click-to-Chat Link?
            </h2>
            <p>
              WhatsApp provides an official feature called <strong>Click to Chat</strong> that lets you initiate a conversation with anyone without having their phone number saved in your phone&apos;s address book.
            </p>
            <p>
              The basic URL format provided by WhatsApp is:
            </p>
            <div className="bg-muted/70 p-4 rounded-xl font-mono text-xs sm:text-sm text-foreground overflow-x-auto not-prose border border-border">
              <code>https://wa.me/&lt;number&gt;?text=&lt;urlencoded_text&gt;</code>
            </div>

            <h2 className="text-2xl font-bold text-foreground mt-10">
              Step-by-Step: How to Make a WhatsApp Link with Pre-filled Text
            </h2>

            <div className="space-y-4 not-prose my-6">
              <div className="p-5 rounded-xl border border-border bg-card space-y-2">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">1</span>
                  Format Your Phone Number Correctly
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Use the full international telephone number format. Omit any zeroes, brackets, dashes, or plus signs.
                </p>
                <div className="grid gap-2 sm:grid-cols-2 text-xs font-mono pt-2">
                  <div className="p-2 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                    ✓ Correct: 15551234567 (US)
                  </div>
                  <div className="p-2 rounded bg-rose-500/10 text-rose-700 dark:text-rose-400">
                    ✗ Incorrect: +1 (555) 123-4567
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-border bg-card space-y-2">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">2</span>
                  Craft a High-Converting Pre-filled Message
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Customers often suffer from blank-screen paralysis. Writing the opening sentence for them increases message completion by over 40%.
                </p>
                <div className="p-3 bg-muted/60 rounded-lg text-xs font-mono text-foreground">
                  &quot;Hi! I saw your summer deal on Instagram and would like to order...&quot;
                </div>
              </div>

              <div className="p-5 rounded-xl border border-border bg-card space-y-2">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">3</span>
                  Use UL0&apos;s Free WhatsApp Generator & Shortener
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Raw wa.me links are long and expose your personal phone number directly in URLs. UL0 lets you mask the phone number with a clean branded short link and instantly generates a dynamic vector QR code.
                </p>
              </div>
            </div>

            {/* Direct Tool Callout */}
            <div className="my-10 p-6 sm:p-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 text-center space-y-4 not-prose">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                <UL0Icon name="bolt" className="h-3.5 w-3.5" /> Free Web Tool
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                Generate Your Free WhatsApp Link & QR Code Now
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
                No login required. Enter your phone number and message to instantly create your short WhatsApp link and high-resolution vector QR code.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/whatsapp"
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-xs font-semibold transition-colors shadow-sm"
                >
                  <span>Open WhatsApp Link Generator</span>
                  <UL0Icon name="arrowright" className="h-3.5 w-3.5 ml-1" />
                </Link>
                <Link
                  href="/tools/whatsapp-link"
                  className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <span>Learn WhatsApp Tool Specs</span>
                </Link>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">
              Frequently Asked Questions (FAQ)
            </h2>
            <div className="space-y-3 not-prose">
              <details className="group rounded-xl border border-border bg-card p-4">
                <summary className="text-sm font-semibold text-foreground cursor-pointer flex items-center justify-between select-none">
                  <span>How does a WhatsApp link with a pre-filled message work?</span>
                  <span className="text-xs font-mono text-muted-foreground group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  WhatsApp Click-to-Chat utilizes the official WhatsApp API URL schema: https://wa.me/&lt;phone&gt;?text=&lt;encoded_text&gt;. When a customer taps your link, WhatsApp automatically opens a 1-on-1 chat with your phone number and pre-populates your specified message in the text input.
                </p>
              </details>

              <details className="group rounded-xl border border-border bg-card p-4">
                <summary className="text-sm font-semibold text-foreground cursor-pointer flex items-center justify-between select-none">
                  <span>Do customers need to save my phone number to their contacts first?</span>
                  <span className="text-xs font-mono text-muted-foreground group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  No. With WhatsApp Click-to-Chat links, users do not need to save your contact in their address book. Tapping the link opens the conversation immediately on mobile or WhatsApp Web.
                </p>
              </details>

              <details className="group rounded-xl border border-border bg-card p-4">
                <summary className="text-sm font-semibold text-foreground cursor-pointer flex items-center justify-between select-none">
                  <span>How should international country codes be formatted?</span>
                  <span className="text-xs font-mono text-muted-foreground group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Always use international format without plus signs, spaces, dashes, or leading zeros. For example, a US number (+1 555 123 4567) becomes 15551234567, and an Indian number (+91 98765 43210) becomes 919876543210.
                </p>
              </details>

              <details className="group rounded-xl border border-border bg-card p-4">
                <summary className="text-sm font-semibold text-foreground cursor-pointer flex items-center justify-between select-none">
                  <span>Can I shorten my WhatsApp link or turn it into a QR code?</span>
                  <span className="text-xs font-mono text-muted-foreground group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Yes. You can paste your wa.me URL into UL0&apos;s free URL shortener to create a clean branded link (e.g., yourbrand.link/chat) and instantly generate an accompanying vector QR code for print marketing, product packaging, and storefronts.
                </p>
              </details>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}

