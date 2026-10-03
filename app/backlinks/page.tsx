import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BacklinkPageClient, VerifiedSite } from "@/components/backlink-page-client"
import { listVerifiedBacklinks } from "@/lib/appwrite/backlinks"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Aesthetic Notion Badges & Free Dofollow Backlink Directory | UL0",
  description:
    "Add an aesthetic, unobtrusive Notion-styled verification badge to your website and earn an immediate, permanent dofollow backlink from ul0.site. Lightweight SVG (<2KB), zero neon, 100% free.",
  alternates: {
    canonical: "https://ul0.site/backlinks",
  },
  openGraph: {
    title: "Aesthetic Notion Badges & Free Dofollow Backlink Directory | UL0",
    description:
      "Boost your SEO with an aesthetic, Notion-styled verification badge. Get a permanent dofollow backlink and showcase your project in our indie directory.",
    url: "https://ul0.site/backlinks",
    siteName: "ul0",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aesthetic Notion Badges & Free Backlink Directory | UL0",
    description: "Get a verified dofollow backlink by embedding our aesthetic Notion partner badge.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function BacklinksPage() {
  let verifiedSites: VerifiedSite[] = []

  try {
    const docs = await listVerifiedBacklinks(100)
    verifiedSites = docs.map((doc) => ({
      id: doc.$id,
      website_url: doc.website_url,
      website_name: doc.website_name,
      website_description: doc.website_description,
      logo_url: doc.logo_url || null,
      verified_at: doc.verified_at || null,
    }))
  } catch (error) {
    console.error("Error fetching verified backlinks:", error)
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Free Backlink Exchange & Showcase Directory — ul0",
    description: "Get a free dofollow backlink from ul0.site by embedding our verified partner badge.",
    url: "https://ul0.site/backlinks",
    publisher: {
      "@type": "Organization",
      name: "ul0",
      url: "https://ul0.site",
      logo: "https://ul0.site/ul0.png",
    },
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F6F3]/60 dark:bg-[#121212] selection:bg-neutral-200 selection:text-neutral-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <BacklinkPageClient verifiedSites={verifiedSites} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
