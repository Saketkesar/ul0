import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { cookies } from "next/headers"
import Link from "next/link"
import Image from "next/image"
import { getMarketingLinkByAlias, incrementGateOpens } from "@/lib/appwrite/marketing-links"
import {
  generateSessionToken,
  createGateSession,
  getGateSession,
  markStepStarted,
  GATE_TIMER_SECONDS,
} from "@/lib/marketing-gate-session"
import { selectRandomBlogs } from "@/lib/blog-discovery"
import { getBlogComponent } from "@/lib/blog-registry"
import { GatePageClient } from "@/components/gate-page-client"
import { AlertCircle, ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Sponsored Content Verification | ul0",
  robots: {
    index: false,
    follow: false,
  },
}

const GATE_SESSION_COOKIE = "ul0_gate_token"

interface PageProps {
  params: Promise<{ alias: string }>
}

export default async function GatePage({ params }: PageProps) {
  const { alias } = await params

  if (!alias) {
    notFound()
  }

  // 1. Look up marketing link in Appwrite
  const link = await getMarketingLinkByAlias(alias)

  if (!link || !link.is_active) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <div className="w-full max-w-md p-8 rounded-2xl border border-border bg-card shadow-lg">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Link Inactive or Not Found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The link you are trying to visit is either inactive, expired, or does not exist.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to ul0 Home</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // 2. Cookie & Session Resolution
  const cookieStore = await cookies()
  let token = cookieStore.get(GATE_SESSION_COOKIE)?.value
  let session = token ? await getGateSession(token) : null

  // If token is invalid or belongs to a different alias, generate a fresh session
  if (!session || session.alias !== link.alias) {
    token = generateSessionToken()
    let selectedSlugs = selectRandomBlogs(link.blog_count || 3)
    if (!selectedSlugs || selectedSlugs.length === 0) {
      selectedSlugs = ["link-shortening-best-practices-2026"]
    }

    session = await createGateSession(token, {
      marketing_link_id: link.$id,
      alias: link.alias,
      blog_slugs: selectedSlugs,
      destination_url: link.destination_url,
    })

    // Track open
    incrementGateOpens(link.$id).catch(console.error)
  }

  // 3. Completion Check
  if (session.completed || session.current_step >= session.blog_slugs.length) {
    redirect(session.destination_url)
  }

  // 4. Mark step started in Redis (starts server-side timer validation)
  await markStepStarted(token!, session.current_step)

  // 5. Load the current step's blog article
  const currentSlug = session.blog_slugs[session.current_step] || session.blog_slugs[0]
  const BlogComponent = await getBlogComponent(currentSlug)

  // Parse destination hostname for preview
  let destinationDomain = "destination site"
  try {
    destinationDomain = new URL(link.destination_url).hostname
  } catch {
    destinationDomain = "destination site"
  }

  return (
    <GatePageClient
      alias={link.alias}
      sessionToken={token!}
      currentStep={session.current_step}
      totalSteps={session.blog_slugs.length}
      gateTimerSeconds={GATE_TIMER_SECONDS}
      destinationDomain={destinationDomain}
    >
      {BlogComponent ? (
        <BlogComponent />
      ) : (
        <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">
          <p>Loading sponsored content...</p>
        </div>
      )}
    </GatePageClient>
  )
}
