import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, Zap, Shield, Globe, QrCode, Wifi, Users, Download } from "lucide-react"

export const metadata: Metadata = {
  title: "Free URL Shortener No Signup Required 2026 | ul0",
  description: "Shorten URLs for free without creating an account. No signup, no limits, no registration. Instant link shortening with QR codes.",
  keywords: [
    "free url shortener no signup",
    "url shortener without login",
    "shorten url free without account",
    "link shortener no registration",
    "free link shortener no signup",
    "url shortener without registration",
    "anonymous url shortener",
    "instant url shortener",
    "no account url shortener",
    "free url shortener without signup",
    "shorten link without login",
    "quick url shortener",
    "easy url shortener free",
    "url shortener no email required",
    "free link shortener online",
    "url shortener no login required",
  ],
  alternates: {
    canonical: "https://ul0.site/blog/free-url-shortener-no-signup",
  },
  openGraph: {
    title: "Free URL Shortener No Signup Required 2026",
    description: "Shorten URLs for free without creating an account. Instant link shortening.",
    url: "https://ul0.site/blog/free-url-shortener-no-signup",
    type: "article",
  },
}

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Free URL Shortener No Signup Required 2026",
  description: "Shorten URLs for free without creating an account.",
  author: { "@type": "Organization", name: "ul0" },
  publisher: {
    "@type": "Organization",
    name: "ul0",
    logo: { "@type": "ImageObject", url: "https://ul0.site/ul0.png" },
  },
  datePublished: "2026-03-01",
  dateModified: "2026-03-01",
}

const features = [
  {
    icon: Zap,
    title: "Instant Shortening",
    description: "Paste your URL and get a short link in seconds. No waiting, no signup forms.",
  },
  {
    icon: Shield,
    title: "100% Free Forever",
    description: "No hidden fees, no premium plans required for basic use. Free forever.",
  },
  {
    icon: Globe,
    title: "No Account Required",
    description: "Start shortening immediately without creating an account or providing email.",
  },
  {
    icon: QrCode,
    title: "Free QR Codes",
    description: "Generate QR codes for any URL instantly. Download in PNG or SVG format.",
  },
  {
    icon: Wifi,
    title: "WiFi QR Generator",
    description: "Create QR codes for WiFi networks. Guests can connect by scanning.",
  },
  {
    icon: Users,
    title: "Expense Splitting",
    description: "Split bills with friends using shareable links. Track who paid what.",
  },
]

const steps = [
  {
    step: 1,
    title: "Paste Your URL",
    description: "Copy any long URL and paste it into the input field on ul0.site",
  },
  {
    step: 2,
    title: "Click Shorten",
    description: "Hit the shorten button and get your short link instantly",
  },
  {
    step: 3,
    title: "Copy & Share",
    description: "Copy your new short URL and share it anywhere - social media, emails, messages",
  },
]

const useCases = [
  "Shortening affiliate links for social media",
  "Sharing long product URLs on Twitter/X",
  "Creating memorable links for presentations",
  "Sharing Google Drive or Dropbox links",
  "Condensing YouTube video links",
  "Simplifying Amazon product URLs",
  "Sharing app store links",
  "Creating short links for print materials",
]

export default function FreeURLShortenerNoSignupPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <Header />
      
      <main className="flex-1 py-8 sm:py-12">
        <article className="container mx-auto px-4 max-w-4xl">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Blog
          </Link>

          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-4 sm:text-4xl">
              Free URL Shortener No Signup Required 2026
            </h1>
            <p className="text-muted-foreground">
              Updated March 2026 • 4 min read
            </p>
          </header>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg">
              Need to <strong>shorten a URL without signing up</strong>? Most URL shorteners now require 
              accounts, email verification, or limit free users. <strong>ul0</strong> is different - 
              it&apos;s a <strong>100% free URL shortener</strong> that works instantly without any registration.
            </p>

            <div className="bg-primary/10 p-6 rounded-lg my-6 text-center">
              <h3 className="font-bold mb-2 text-lg">🚀 Try It Now - No Signup Required</h3>
              <p className="mb-4 text-muted-foreground">
                Paste any URL and get a short link in seconds
              </p>
              <Link 
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 font-medium text-lg"
              >
                Shorten URL Free →
              </Link>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Why Use a No-Signup URL Shortener?</h2>
            <ul className="space-y-3">
              <li>
                <strong>Privacy:</strong> No need to share your email address or personal information
              </li>
              <li>
                <strong>Speed:</strong> Get short links instantly without waiting for account verification
              </li>
              <li>
                <strong>Convenience:</strong> No passwords to remember or accounts to manage
              </li>
              <li>
                <strong>Simplicity:</strong> Just paste and go - perfect for quick one-time use
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">How to Shorten URLs Without Signup</h2>
            <div className="grid gap-4 my-6">
              {steps.map((item) => (
                <div key={item.step} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">ul0 Features - All Free, No Account Needed</h2>
            <div className="grid md:grid-cols-2 gap-4 my-6">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.title} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <h3 className="font-bold">{feature.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                )
              })}
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Use Cases for Free URL Shortening</h2>
            <div className="grid md:grid-cols-2 gap-2 my-6">
              {useCases.map((useCase) => (
                <div key={useCase} className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-sm">{useCase}</span>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Comparison: Free vs Paid URL Shorteners</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Feature</th>
                    <th className="border border-border p-3 text-left">ul0 (Free)</th>
                    <th className="border border-border p-3 text-left">Bitly (Paid)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3">Signup Required</td>
                    <td className="border border-border p-3 text-green-600 font-bold">No</td>
                    <td className="border border-border p-3 text-red-600">Yes</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3">Free Links/Month</td>
                    <td className="border border-border p-3 text-green-600 font-bold">Unlimited</td>
                    <td className="border border-border p-3 text-red-600">5</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3">QR Codes</td>
                    <td className="border border-border p-3 text-green-600 font-bold">Free</td>
                    <td className="border border-border p-3 text-red-600">Paid</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3">Price</td>
                    <td className="border border-border p-3 text-green-600 font-bold">$0</td>
                    <td className="border border-border p-3">$8-199/mo</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg">
                <h3 className="font-bold mb-2">Is ul0 really free?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes! ul0 is 100% free for URL shortening, QR codes, and WiFi QR generation. 
                  We&apos;re supported by ads, so you&apos;ll see some advertisements, but there&apos;s no 
                  paid tier required for any features.
                </p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h3 className="font-bold mb-2">How long do short links last?</h3>
                <p className="text-muted-foreground text-sm">
                  Short links created on ul0 are permanent and don&apos;t expire. Your links will 
                  continue working indefinitely.
                </p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h3 className="font-bold mb-2">Can I track clicks on my links?</h3>
                <p className="text-muted-foreground text-sm">
                  Currently ul0 doesn&apos;t offer click analytics. If you need detailed analytics, 
                  consider a paid service like Bitly.
                </p>
              </div>
            </div>

            <div className="bg-muted p-6 rounded-lg my-8 text-center">
              <h3 className="font-bold mb-2 text-xl">Ready to Shorten Your First Link?</h3>
              <p className="mb-4 text-muted-foreground">
                No signup, no limits, no hassle. Just paste and go.
              </p>
              <Link 
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 font-medium"
              >
                Start Shortening - 100% Free →
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
