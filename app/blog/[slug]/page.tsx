import React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { sanityFetch, SanityPost } from "@/lib/sanity/client"
import { ArrowLeft, Calendar, User, Clock, Sparkles, ChevronRight } from "lucide-react"

export const revalidate = 60 // Revalidate dynamic blog posts every 60 seconds (supports scheduled posts)

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const now = new Date().toISOString()
  const post = await sanityFetch<SanityPost>(
    `*[_type == "post" && slug.current == $slug && publishedAt <= $now][0]`,
    { slug, now }
  )

  if (!post) return {}

  const title = post.metaTitle || `${post.title} | UL0 Blog`
  const description = post.metaDescription || post.excerpt

  return {
    title,
    description,
    alternates: {
      canonical: `https://ul0.site/blog/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://ul0.site/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : [{ url: "https://ul0.site/social-card.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.coverImageUrl ? [post.coverImageUrl] : ["https://ul0.site/social-card.png"],
    },
  }
}

export async function generateStaticParams() {
  const now = new Date().toISOString()
  const posts = await sanityFetch<{ slug: string }[]>(
    `*[_type == "post" && publishedAt <= $now]{ "slug": slug.current }`,
    { now }
  )
  return (posts || []).map((p) => ({ slug: p.slug }))
}

export default async function DynamicSanityBlogPostPage({ params }: Props) {
  const { slug } = await params
  const now = new Date().toISOString()
  const post = await sanityFetch<SanityPost>(
    `*[_type == "post" && slug.current == $slug && publishedAt <= $now][0]`,
    { slug, now }
  )

  if (!post) {
    notFound()
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImageUrl || "https://ul0.site/social-card.png",
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
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
    mainEntityOfPage: `https://ul0.site/blog/${slug}`,
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://ul0.site" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://ul0.site/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://ul0.site/blog/${slug}` },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header />

      <main className="flex-1 py-10 sm:py-16">
        <article className="container mx-auto px-4 max-w-4xl space-y-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            <span>Back to All Guides</span>
          </Link>

          {/* Article Header */}
          <header className="space-y-4 border-b border-border pb-8">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
              {post.title}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <User className="h-3.5 w-3.5 text-primary" />
                <span>Saket Kesar</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>6 min read</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.coverImageUrl && (
            <div className="rounded-2xl overflow-hidden border border-border bg-muted/20 shadow-xs">
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="w-full h-auto max-h-[480px] object-cover"
              />
            </div>
          )}

          {/* Article Body */}
          <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground text-sm sm:text-base leading-relaxed space-y-6 whitespace-pre-line">
            {post.body}
          </div>

          {/* Embedded Conversion CTA */}
          <div className="p-6 sm:p-8 rounded-2xl border border-primary/30 bg-primary/5 text-center space-y-4 my-10">
            <h3 className="text-lg sm:text-xl font-bold text-foreground">
              Create Branded Short Links on Your Custom Domain for Free
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              UL0 provides 1 branded custom domain, fast 307 temporary redirects, and dynamic vector QR codes
              with zero sign up or credit card required.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                <span>Shorten Link Free</span>
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Link>
              <Link
                href="/custom-domain-landing"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                <span>Setup Free Custom Domain</span>
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}

