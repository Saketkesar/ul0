import { notFound } from "next/navigation"
import { SplitViewClient } from "./split-view-client"
import { getSplitSessionBySlug, toPublicSession } from "@/lib/appwrite/splits"
import { UL0Icon } from "@/components/ul0-icon"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Split Expense Settlement — UL0",
  robots: {
    index: false,
    follow: false,
  },
}

interface Props {
  params: Promise<{ slug: string }>
}

function sanitizeSlug(slug: string): string | null {
  const sanitized = slug.replace(/[^a-zA-Z0-9-_]/g, "")
  if (sanitized.length < 1 || sanitized.length > 50) return null
  if (sanitized.includes("..") || sanitized !== slug) return null
  return sanitized
}

export default async function SplitViewPage({ params }: Props) {
  const { slug } = await params
  const sanitizedSlug = sanitizeSlug(slug)
  if (!sanitizedSlug) notFound()

  const session = await getSplitSessionBySlug(sanitizedSlug)

  if (!session || session.status === "deleted") {
    return (
      <div className="min-h-screen bg-[#F7FAF8] text-[#0B1A17] flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full p-8 rounded-2xl border border-[#E4ECE8] bg-white text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#EAF1EE] text-[#5A6B66] mx-auto flex items-center justify-center">
            <UL0Icon name="splitbill" size={24} />
          </div>
          <h1 className="text-xl font-bold text-[#0B1A17]">Split not found</h1>
          <p className="text-xs text-[#5A6B66] leading-relaxed">
            This bill split link has either been deleted or does not exist. Check with the organizer for the correct link.
          </p>
          <div className="pt-2">
            <Button asChild className="bg-[#0B7A66] hover:bg-[#086353] text-white text-xs h-10 px-5 rounded-xl font-semibold">
              <a href="/split">Create your own split</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Check if session is expired
  const isExpired = session.expires_at ? new Date(session.expires_at) < new Date() : false
  if (isExpired) {
    return (
      <div className="min-h-screen bg-[#F7FAF8] text-[#0B1A17] flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full p-8 rounded-2xl border border-[#E4ECE8] bg-white text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#F2B544]/20 text-[#B57C00] mx-auto flex items-center justify-center">
            <UL0Icon name="clock" size={24} />
          </div>
          <h1 className="text-xl font-bold text-[#0B1A17]">This split has expired</h1>
          <p className="text-xs text-[#5A6B66] leading-relaxed">
            Bill links expire after their scheduled duration to keep private data safe. Ask the organizer to extend the expiry or create a new split.
          </p>
          <div className="pt-2">
            <Button asChild className="bg-[#0B7A66] hover:bg-[#086353] text-white text-xs h-10 px-5 rounded-xl font-semibold">
              <a href="/split">Create your own split</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Pass public-safe session (masked UPI, no token hash)
  const safeSession = toPublicSession(session)

  return <SplitViewClient session={safeSession as any} slug={sanitizedSlug} />
}
