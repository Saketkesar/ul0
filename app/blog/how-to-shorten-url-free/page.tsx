import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft, Link2, CheckCircle, AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "How to Shorten a URL for Free in 2026 - Complete Guide | ul0",
  description: "Learn how to shorten long URLs for free. Step-by-step guide covering the best methods, tools, and tips for shortening links for social media, marketing, and more.",
  keywords: [
    "how to shorten a url",
    "shorten url free",
    "how to make a link shorter",
    "url shortener free",
    "how to shorten a link",
    "make url shorter",
    "short link generator",
    "how to create short url",
    "free url shortener",
    "shorten link for free",
  ],
  alternates: {
    canonical: "https://ul0.site/blog/how-to-shorten-url-free",
  },
  openGraph: {
    title: "How to Shorten a URL for Free in 2026 - Complete Guide",
    description: "Learn how to shorten long URLs for free with this step-by-step guide.",
    url: "https://ul0.site/blog/how-to-shorten-url-free",
    type: "article",
    publishedTime: "2026-03-01",
  },
}

export default function HowToShortenUrlPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Shorten a URL for Free in 2026 - Complete Guide",
    description: "Learn how to shorten long URLs for free. Step-by-step guide covering the best methods, tools, and tips.",
    image: "https://ul0.site/ul0.png",
    datePublished: "2026-03-01",
    dateModified: "2026-03-01",
    author: {
      "@type": "Organization",
      name: "ul0",
    },
    publisher: {
      "@type": "Organization",
      name: "ul0",
      logo: {
        "@type": "ImageObject",
        url: "https://ul0.site/ul0.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://ul0.site/blog/how-to-shorten-url-free",
    },
  }

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Shorten a URL for Free",
    description: "A step-by-step guide to shortening URLs using free online tools",
    totalTime: "PT1M",
    tool: {
      "@type": "HowToTool",
      name: "ul0 URL Shortener",
    },
    step: [
      {
        "@type": "HowToStep",
        name: "Copy your long URL",
        text: "Copy the long URL you want to shorten from your browser's address bar",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Go to ul0.site",
        text: "Open ul0.site in your web browser",
        url: "https://ul0.site",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Paste the URL",
        text: "Paste your long URL into the input box on the homepage",
        position: 3,
      },
      {
        "@type": "HowToStep",
        name: "Click Shorten",
        text: "Click the 'Shorten' button to generate your short link",
        position: 4,
      },
      {
        "@type": "HowToStep",
        name: "Copy and share",
        text: "Copy your new short URL and share it anywhere",
        position: 5,
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <Header />
      
      <main className="flex-1 py-8 sm:py-12">
        <article className="container mx-auto px-4 max-w-3xl">
          {/* Breadcrumb */}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-8">
            <Badge className="mb-4">Guide</Badge>
            <h1 className="text-3xl font-bold mb-4 sm:text-4xl">
              How to Shorten a URL for Free in 2026 - Complete Guide
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                March 1, 2026
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                5 min read
              </span>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground">
              Long URLs can be messy, hard to share, and look unprofessional. Whether you're sharing links on social media, 
              in emails, or on printed materials, <strong>shortening your URLs</strong> makes them cleaner and easier to manage. 
              In this guide, we'll show you <strong>how to shorten a URL for free</strong> in just a few simple steps.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">What is URL Shortening?</h2>
            <p>
              URL shortening is the process of converting a long web address into a shorter, more manageable link. 
              For example, a URL like:
            </p>
            <code className="block bg-muted p-3 rounded-lg text-sm mb-4 overflow-x-auto">
              https://example.com/products/category/electronics/smartphones/iphone-15-pro-max?ref=homepage&utm_source=google
            </code>
            <p>Can become:</p>
            <code className="block bg-muted p-3 rounded-lg text-sm mb-4">
              https://ul0.site/abc123
            </code>

            <h2 className="text-2xl font-bold mt-8 mb-4">How to Shorten a URL - Step by Step</h2>
            
            <div className="space-y-4 my-6">
              <div className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-semibold">Copy Your Long URL</h3>
                  <p className="text-muted-foreground">Go to the webpage you want to share and copy the URL from your browser's address bar.</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-semibold">Visit a URL Shortener</h3>
                  <p className="text-muted-foreground">Go to <Link href="/" className="text-primary hover:underline">ul0.site</Link> - it's free and requires no signup.</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-semibold">Paste Your URL</h3>
                  <p className="text-muted-foreground">Paste your long URL into the input box on the homepage.</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="font-semibold">Click "Shorten"</h3>
                  <p className="text-muted-foreground">Click the button and your short link will be generated instantly.</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">5</div>
                <div>
                  <h3 className="font-semibold">Copy & Share</h3>
                  <p className="text-muted-foreground">Copy your new short URL and share it on WhatsApp, Instagram, Twitter, email, or anywhere else!</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Benefits of Using Short URLs</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span><strong>Cleaner appearance</strong> - Short links look more professional and trustworthy</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span><strong>Easier to share</strong> - Perfect for social media with character limits</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span><strong>Memorable</strong> - Short URLs are easier to remember and type</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span><strong>Print-friendly</strong> - Ideal for business cards, flyers, and posters</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span><strong>QR code friendly</strong> - Shorter URLs create simpler QR codes</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Where to Use Short URLs</h2>
            <div className="grid gap-4 sm:grid-cols-2 my-6">
              <div className="p-4 bg-green-500/10 rounded-lg">
                <p className="font-semibold text-green-600 mb-1">Social Media</p>
                <p className="text-sm text-muted-foreground">Instagram bio, Twitter posts, Facebook shares, TikTok profiles</p>
              </div>
              <div className="p-4 bg-blue-500/10 rounded-lg">
                <p className="font-semibold text-blue-600 mb-1">Marketing</p>
                <p className="text-sm text-muted-foreground">Email campaigns, SMS marketing, digital ads</p>
              </div>
              <div className="p-4 bg-purple-500/10 rounded-lg">
                <p className="font-semibold text-purple-600 mb-1">Print Materials</p>
                <p className="text-sm text-muted-foreground">Business cards, brochures, posters, flyers</p>
              </div>
              <div className="p-4 bg-orange-500/10 rounded-lg">
                <p className="font-semibold text-orange-600 mb-1">Messaging</p>
                <p className="text-sm text-muted-foreground">WhatsApp, Telegram, Discord, Slack</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Why Choose ul0?</h2>
            <p>
              ul0 is a <strong>100% free URL shortener</strong> that requires no signup or registration. Here's why thousands of users choose ul0:
            </p>
            <ul className="space-y-2 my-4">
              <li>✅ <strong>No signup required</strong> - Start shortening instantly</li>
              <li>✅ <strong>Completely free</strong> - No hidden costs or premium tiers</li>
              <li>✅ <strong>Fast & reliable</strong> - Links redirect instantly</li>
              <li>✅ <strong>No ads on redirect</strong> - Clean user experience</li>
              <li>✅ <strong>Permanent links</strong> - Your short URLs never expire</li>
            </ul>

            <div className="my-8 p-6 bg-primary/5 rounded-lg text-center">
              <h3 className="text-xl font-bold mb-2">Ready to shorten your first URL?</h3>
              <p className="text-muted-foreground mb-4">
                Try ul0 now - it's free and takes less than 10 seconds.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium"
              >
                <Link2 className="h-4 w-4" />
                Shorten a URL Now
              </Link>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">Is URL shortening free?</h3>
                <p className="text-muted-foreground">Yes! ul0 and many other URL shorteners offer free services. ul0 is completely free with no limits.</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">Do short URLs expire?</h3>
                <p className="text-muted-foreground">Short URLs created on ul0 never expire. They will work permanently as long as the original destination is available.</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">Are short URLs safe?</h3>
                <p className="text-muted-foreground">Short URLs from reputable services like ul0 are safe. We don't add malware or redirect to spam sites.</p>
              </div>
            </div>
          </div>

          {/* Author */}
          <div className="mt-12 pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              Published by <strong>ul0 Team</strong> • Last updated March 1, 2026
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
