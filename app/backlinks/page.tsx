import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BacklinkPageClient, VerifiedSite } from "@/components/backlink-page-client"
import { listVerifiedBacklinks } from "@/lib/appwrite/backlinks"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Free High-Authority Backlink Exchange & Showcase Directory | ul0",
  description:
    "Get a 100% free, permanent high-DR dofollow backlink from ul0.site. Add our lightweight verified badge to your website and get instant showcase in our webmaster index.",
  alternates: {
    canonical: "https://ul0.site/backlinks",
  },
  openGraph: {
    title: "Free High-Authority Backlink Exchange | ul0",
    description:
      "Boost your SEO domain rating for free. Embed our verified badge to earn an immediate dofollow backlink and directory feature.",
    url: "https://ul0.site/backlinks",
    siteName: "ul0",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Backlink Exchange & Showcase Directory | ul0",
    description: "Get a verified dofollow backlink by embedding the ul0 badge.",
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
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20 selection:text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <BacklinkPageClient verifiedSites={verifiedSites} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
