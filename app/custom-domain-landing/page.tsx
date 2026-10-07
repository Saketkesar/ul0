import type { Metadata } from "next"
import { headers } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { Link2, ArrowRight } from "lucide-react"
import { getDomainByName } from "@/lib/appwrite/domains"

export const metadata: Metadata = {
  title: "Connect a Custom Domain to Shorten Links — ul0.site",
  description:
    "Connect your own branded domain to ul0.site and create custom short links for free. Build audience trust, increase click-through rates, and track link analytics. Starting at $2/month.",
  keywords: [
    "custom domain link shortener",
    "branded short links",
    "connect custom domain URL shortener",
    "white label link shortener",
    "custom short URL",
    "branded URL shortener free",
  ],
  openGraph: {
    title: "Connect a Custom Domain to Shorten Links — ul0.site",
    description:
      "Create branded short URLs on your own domain. Track clicks, manage links, and build trust with your audience using ul0.site.",
    url: "https://ul0.site/custom-domain-landing",
    siteName: "ul0.site",
    type: "website",
  },
  alternates: {
    canonical: "https://ul0.site/custom-domain-landing",
  },
  robots: { index: true, follow: true },
}

export default async function CustomDomainLandingPage() {
  const headersList = await headers()
  const host = headersList.get("host") || ""
  // Strip port if present
  const domain = host.split(":")[0]

  // Retrieve brand logo URL from the database for this domain
  let brandLogoUrl: string | null = null
  try {
    const domainDoc = await getDomainByName(domain)
    brandLogoUrl = domainDoc?.brand_logo_url || null
  } catch (err) {
    console.error("Failed to fetch domain doc in landing page:", err)
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-white text-gray-900 font-sans selection:bg-gray-100">
      {/* Notion-style subtle border instead of flashy grid */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gray-200" />

      {/* Header bar */}
      <header className="relative z-10 border-b border-gray-100 bg-white/80 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="https://ul0.site" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <Image
              src="/ul0.png"
              alt="ul0"
              width={72}
              height={26}
              className="h-6 w-auto object-contain"
              priority
            />
          </Link>
          <Link
            href="https://ul0.site/sign-up"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md border border-gray-900 bg-gray-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 transition-colors"
          >
            Get Free Links
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-24 text-center max-w-3xl mx-auto w-full">
        {/* Brand Logo Display */}
        {brandLogoUrl ? (
          <div className="mb-8 flex items-center justify-center p-3 rounded-xl border border-gray-200 bg-gray-50 shadow-sm max-w-[160px] max-h-[80px]">
            <img
              src={brandLogoUrl}
              alt="Brand Logo"
              className="max-w-[140px] max-h-[60px] object-contain"
            />
          </div>
        ) : (
          <div className="mb-8 font-mono text-sm tracking-tight border border-gray-200 bg-gray-50 rounded-md px-3.5 py-1.5 text-gray-600 font-semibold shadow-sm">
            {domain}
          </div>
        )}

        {/* Headline */}
        <h1 className="mb-4 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 max-w-xl leading-snug">
          This domain is managed by <span className="underline decoration-2 decoration-gray-400">ul0.site</span>
        </h1>
        <p className="mb-10 max-w-md text-base text-gray-500 leading-relaxed">
          Short link redirection services for this domain are securely powered by ul0. 
          Get your own branded short links for free today.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Link
            href="https://ul0.site/sign-up"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-950 bg-gray-950 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-all duration-150"
          >
            <Link2 className="h-4 w-4" />
            Get Branded Links — Free
          </Link>
          <Link
            href="https://ul0.site"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
          >
            Learn More
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-100 bg-white px-6 py-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <Link href="https://ul0.site" target="_blank" rel="noopener noreferrer">
            <Image
              src="/ul0.png"
              alt="ul0"
              width={55}
              height={20}
              className="h-5 w-auto object-contain opacity-40 hover:opacity-80 transition-opacity"
            />
          </Link>
          <p className="text-xs text-gray-400 font-mono">
            Powered by{" "}
            <a
              href="https://ul0.site"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600"
            >
              ul0.site
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
