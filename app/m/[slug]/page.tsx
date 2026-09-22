import { notFound, redirect } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react"
import {
  getMonetizedLinkBySlug,
  incrementMonetizedLinkViews,
  incrementMonetizedLinkUnlocks,
} from "@/lib/appwrite/monetized-links"
import { getBlogArticle } from "@/lib/blog-data"
import { MonetizedUnlockClient } from "@/components/monetized-unlock-client"
import { AdBanner } from "@/components/ad-banner"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ step?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const link = await getMonetizedLinkBySlug(slug)
  if (!link) {
    return { title: "Link Not Found — ul0" }
  }
  return {
    title: `Unlocking: ${link.title} — ul0`,
    description: "Please complete the verification steps to access your requested content.",
    robots: { index: false, follow: false },
  }
}

export default async function MonetizedLinkPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { step: stepQuery } = await searchParams

  const link = await getMonetizedLinkBySlug(slug)
  if (!link) {
    notFound()
  }

  const currentStep = Math.max(1, parseInt(stepQuery || "1", 10))

  // Final Step Reached: Unlock Completed!
  if (currentStep > link.total_steps) {
    await incrementMonetizedLinkUnlocks(link.$id, link.completed_unlocks)

    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-300">
        <header className="border-b border-neutral-800 bg-neutral-900/90 px-4 py-3">
          <div className="container mx-auto max-w-2xl flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/ul0.png"
                alt="ul0"
                width={65}
                height={22}
                className="h-5 w-auto object-contain invert"
              />
            </Link>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/50 text-emerald-400">
              Verified &amp; Ready
            </span>
          </div>
        </header>

        <main className="container mx-auto max-w-xl px-4 py-12 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 animate-bounce">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
              🎉 Your Link is Ready!
            </h1>
            <p className="text-sm text-neutral-400 max-w-md mx-auto">
              You have completed all {link.total_steps} verification steps for{" "}
              <strong className="text-neutral-200">{link.title}</strong>.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Destination link safe &amp; verified</span>
            </div>

            <a
              href={link.target_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
            >
              <span>Proceed to Destination URL</span>
              <ExternalLink className="h-4 w-4" />
            </a>

            <p className="text-[11px] text-neutral-500 truncate font-mono">
              {link.target_url}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 flex flex-col items-center justify-center min-h-[90px] overflow-hidden">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1 font-mono">
              Advertisement
            </span>
            <AdBanner type="small" />
          </div>
        </main>

        <footer className="border-t border-neutral-800 py-4 text-center text-xs text-neutral-600">
          Powered by ul0.site
        </footer>
      </div>
    )
  }

  // Record initial view
  if (currentStep === 1) {
    await incrementMonetizedLinkViews(link.$id, link.views)
  }

  // Get current step's blog article
  const blogIndex = currentStep - 1
  const blogSlug = link.blog_slugs?.[blogIndex] || "best-url-shorteners-2026"
  const article = getBlogArticle(blogSlug)

  return (
    <MonetizedUnlockClient
      slug={link.slug}
      title={link.title}
      targetUrl={link.target_url}
      currentStep={currentStep}
      totalSteps={link.total_steps}
      article={article}
    />
  )
}
