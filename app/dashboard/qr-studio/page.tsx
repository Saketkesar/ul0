import type { Metadata } from "next"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { isQrStudioAuthorized, isUserAdmin } from "@/lib/marketing-auth"
import { getDynamicQrLinksByOwner, listClicksByOwner } from "@/lib/appwrite/links"
import { getDynamicQrUrl } from "@/lib/utils/link-url"
import { QrStudioClient, type DynamicQrItem } from "@/components/dashboard/qr-studio-client"
import { ShieldAlert, ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Dynamic QR Studio & No-Ads Link Generator — Dashboard | UL0",
  description: "Create and manage dynamic vector QR codes with editable destination URLs and high-speed redirection.",
}

export default async function DynamicQrStudioPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect("/sign-in")
  }

  const clerkUser = await currentUser().catch(() => null)
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? null

  const isAuthorized = isQrStudioAuthorized(userId, email)

  if (!isAuthorized) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto border border-amber-500/20">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Access Restricted</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The Dynamic QR Studio &amp; No-Ads Link Generator is an exclusive beta module configured
            specifically for authorized founders (<code className="text-foreground font-mono">kesarsaket607</code>).
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard Overview</span>
          </Link>
        </div>
      </div>
    )
  }

  const isAdmin = isUserAdmin(userId, email)
  const rawLinks = await getDynamicQrLinksByOwner(userId, isAdmin)

  const userClicks = await listClicksByOwner(userId, 2000).catch(() => [])

  const formattedLinks: DynamicQrItem[] = rawLinks.map((link) => {
    let targeting: any = undefined
    if (link.targeting_json) {
      try {
        targeting = JSON.parse(link.targeting_json)
      } catch {}
    }

    const title = targeting?.title || link.meta_title || "Dynamic QR Link"
    const dynamicUrl = getDynamicQrUrl(link.host, link.slug)

    return {
      id: link.$id,
      slug: link.slug,
      long_url: link.long_url,
      title,
      dynamicUrl,
      clicks_count: link.clicks_count || 0,
      created_at: link.created_at || new Date().toISOString(),
      targeting,
    }
  })

  return <QrStudioClient initialLinks={formattedLinks} initialClicks={userClicks} userEmail={email} />
}
