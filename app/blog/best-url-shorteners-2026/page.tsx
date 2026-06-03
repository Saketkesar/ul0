import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Check, X, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "10 Best Free URL Shorteners in 2026 - Bitly Alternatives | ul0",
  description: "Compare the best free URL shorteners in 2026. Bitly vs TinyURL vs ul0 vs Rebrandly. Find the perfect link shortener with no signup required.",
  keywords: [
    "best url shortener",
    "best free url shortener",
    "url shortener 2026",
    "bitly alternative",
    "tinyurl alternative",
    "rebrandly alternative",
    "free link shortener",
    "url shortener comparison",
    "top url shorteners",
    "link shortener free",
    "bitly vs tinyurl",
    "best link shortener",
    "url shortener without login",
    "shortener comparison",
  ],
  alternates: {
    canonical: "https://ul0.site/blog/best-url-shorteners-2026",
  },
  openGraph: {
    title: "10 Best Free URL Shorteners in 2026 - Bitly Alternatives",
    description: "Compare the best free URL shorteners. Bitly vs TinyURL vs ul0 vs Rebrandly.",
    url: "https://ul0.site/blog/best-url-shorteners-2026",
    type: "article",
  },
}

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "10 Best Free URL Shorteners in 2026 - Complete Comparison",
  description: "Compare the best free URL shorteners including Bitly, TinyURL, ul0, and Rebrandly. Find the perfect link shortener for your needs.",
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
  datePublished: "2026-03-01",
  dateModified: "2026-03-01",
}

const shorteners = [
  {
    name: "ul0",
    url: "https://ul0.site",
    free: true,
    noSignup: true,
    qrCode: true,
    analytics: false,
    customDomain: false,
    rating: 4.8,
    pros: ["100% free forever", "No signup required", "QR code generator", "Expense splitter", "Fast redirects"],
    cons: ["No custom domains", "No click analytics"],
    best: "Best for quick, free link shortening without any signup",
  },
  {
    name: "Bitly",
    url: "https://bitly.com",
    free: "Limited",
    noSignup: false,
    qrCode: true,
    analytics: true,
    customDomain: true,
    rating: 4.5,
    pros: ["Detailed analytics", "Custom domains", "QR codes", "Enterprise features"],
    cons: ["Only 5 free links/month", "Requires signup", "Expensive paid plans"],
    best: "Best for businesses needing advanced analytics",
  },
  {
    name: "TinyURL",
    url: "https://tinyurl.com",
    free: true,
    noSignup: true,
    qrCode: true,
    analytics: "Paid",
    customDomain: "Paid",
    rating: 4.3,
    pros: ["Been around since 2002", "Simple interface", "No signup for basic use"],
    cons: ["Limited free features", "Analytics require payment"],
    best: "Best for simple, reliable link shortening",
  },
  {
    name: "Rebrandly",
    url: "https://rebrandly.com",
    free: "Limited",
    noSignup: false,
    qrCode: true,
    analytics: true,
    customDomain: true,
    rating: 4.4,
    pros: ["Branded links", "Custom domains", "Team collaboration", "API access"],
    cons: ["Limited free plan", "Complex for beginners", "Expensive"],
    best: "Best for brand-focused businesses",
  },
  {
    name: "is.gd",
    url: "https://is.gd",
    free: true,
    noSignup: true,
    qrCode: false,
    analytics: "Limited",
    customDomain: false,
    rating: 4.0,
    pros: ["Completely free", "No signup", "Simple API"],
    cons: ["No QR codes", "Basic features only", "No custom domains"],
    best: "Best for developers needing a simple API",
  },
]

export default function BestUrlShortenersPage() {
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
              10 Best Free URL Shorteners in 2026 - Complete Comparison
            </h1>
            <p className="text-muted-foreground">
              Updated March 2026 • 8 min read
            </p>
          </header>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg">
              Looking for the <strong>best URL shortener</strong> in 2026? Whether you need a free 
              <strong> Bitly alternative</strong>, a <strong>TinyURL replacement</strong>, or just want to 
              shorten links without creating an account, this comprehensive comparison will help you choose.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Quick Comparison Table</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left">Service</th>
                    <th className="border border-border p-2 text-center">Free</th>
                    <th className="border border-border p-2 text-center">No Signup</th>
                    <th className="border border-border p-2 text-center">QR Code</th>
                    <th className="border border-border p-2 text-center">Analytics</th>
                    <th className="border border-border p-2 text-center">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {shorteners.map((s) => (
                    <tr key={s.name}>
                      <td className="border border-border p-2 font-medium">{s.name}</td>
                      <td className="border border-border p-2 text-center">
                        {s.free === true ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : 
                         s.free === false ? <X className="h-4 w-4 text-red-500 mx-auto" /> : 
                         <span className="text-yellow-500">{s.free}</span>}
                      </td>
                      <td className="border border-border p-2 text-center">
                        {s.noSignup ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-red-500 mx-auto" />}
                      </td>
                      <td className="border border-border p-2 text-center">
                        {s.qrCode ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-red-500 mx-auto" />}
                      </td>
                      <td className="border border-border p-2 text-center">
                        {s.analytics === true ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : 
                         s.analytics === false ? <X className="h-4 w-4 text-red-500 mx-auto" /> : 
                         <span className="text-yellow-500 text-xs">{s.analytics}</span>}
                      </td>
                      <td className="border border-border p-2 text-center">
                        <span className="flex items-center justify-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {s.rating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Detailed Reviews</h2>

            {shorteners.map((s, index) => (
              <div key={s.name} className="mb-8 p-6 border border-border rounded-lg">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  {index + 1}. {s.name}
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </h3>
                <p className="text-primary font-medium mb-3">{s.best}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">✓ Pros</h4>
                    <ul className="text-sm space-y-1">
                      {s.pros.map((pro) => (
                        <li key={pro}>• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">✗ Cons</h4>
                    <ul className="text-sm space-y-1">
                      {s.cons.map((con) => (
                        <li key={con}>• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}

            <h2 className="text-2xl font-bold mt-8 mb-4">Why ul0 is the Best Free Option</h2>
            <p>
              If you&apos;re looking for a <strong>completely free URL shortener</strong> with <strong>no signup required</strong>, 
              ul0 is the clear winner. Unlike Bitly which limits you to 5 links per month on their free plan, 
              or Rebrandly which requires account creation, ul0 lets you shorten unlimited URLs instantly.
            </p>

            <div className="bg-primary/10 p-6 rounded-lg my-6">
              <h3 className="font-bold mb-2">Try ul0 Now - 100% Free</h3>
              <p className="mb-4">Shorten your first link in seconds. No signup, no limits, no ads on your links.</p>
              <Link 
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 font-medium"
              >
                Shorten a URL Free →
              </Link>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Conclusion</h2>
            <p>
              The best URL shortener depends on your needs. For businesses needing analytics and branded domains, 
              <strong> Bitly</strong> or <strong>Rebrandly</strong> are solid choices despite the cost. For quick, 
              free link shortening without any hassle, <strong>ul0</strong> is the best choice in 2026.
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
