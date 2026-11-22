import { notFound } from "next/navigation"
import { getGroupByShareSlug } from "@/lib/groups"
import { PublicGroupView } from "./public-group-view"
import { UL0Icon } from "@/components/ul0-icon"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Group Hisab & Settle Up — UL0",
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
  return sanitized
}

export default async function PublicGroupPage({ params }: Props) {
  const { slug } = await params
  const sanitizedSlug = sanitizeSlug(slug)
  if (!sanitizedSlug) notFound()

  const data = await getGroupByShareSlug(sanitizedSlug)

  if (!data) {
    return (
      <div className="min-h-screen bg-[#F7FAF8] text-[#0B1A17] flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full p-8 rounded-2xl border border-[#E4ECE8] bg-white text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#EAF1EE] text-[#5A6B66] mx-auto flex items-center justify-center">
            <UL0Icon name="splitbill" size={24} />
          </div>
          <h1 className="text-xl font-bold text-[#0B1A17]">Group not found</h1>
          <p className="text-xs text-[#5A6B66] leading-relaxed">
            This group link does not exist or may have been removed. Check with the organizer for the correct link.
          </p>
          <div className="pt-2">
            <Button asChild className="bg-[#0B7A66] hover:bg-[#086353] text-white text-xs h-10 px-5 rounded-xl font-semibold">
              <a href="/split">Go to Splits</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return <PublicGroupView initialData={data} slug={sanitizedSlug} />
}
