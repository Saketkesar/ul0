import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getSplitSessionBySlug } from "@/lib/appwrite/splits"
import { renderSplitActionPage } from "@/lib/split/page-renderer"
import { SplitTemplateViewer } from "@/components/split/split-template-viewer"

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ token?: string; member?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `Confirm Payment · ul0.split`,
    description: `Confirm UPI payment received for split ${slug}`,
    icons: {
      icon: "/ul0split-logo-dark.png",
      shortcut: "/ul0split-logo-dark.png",
      apple: "/ul0split-logo-dark.png",
    },
  }
}

export default async function ConfirmPaymentPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { token = "", member } = await searchParams

  const session = await getSplitSessionBySlug(slug)
  if (!session || session.status === "deleted") {
    notFound()
  }

  const settlements = session.settlements || []
  let memberIndex = 0
  if (member !== undefined) {
    const parsed = parseInt(member, 10)
    if (!isNaN(parsed) && parsed >= 0 && parsed < settlements.length) {
      memberIndex = parsed
    } else {
      // Find by name if member string is a name
      const foundIdx = settlements.findIndex(
        (s) => s.from.toLowerCase() === member.toLowerCase()
      )
      if (foundIdx !== -1) memberIndex = foundIdx
    }
  }

  const targetSettlement = settlements[memberIndex]
  const friendName = targetSettlement?.from || "Friend"
  const amount = targetSettlement?.amount || 0
  const paidCount = settlements.filter(
    (s) => s.status === "confirmed" || s.status === "claimed"
  ).length
  const peopleCount = settlements.length || 2
  const paidPercent = peopleCount > 0 ? Math.round((paidCount / peopleCount) * 100) : 50

  const html = renderSplitActionPage("confirm-payment", {
    slug,
    token,
    memberIndex,
    friendName,
    creatorName: targetSettlement?.to || "Organizer",
    splitName: session.title,
    amount,
    paidCount,
    peopleCount,
    paidPercent,
  })

  return <SplitTemplateViewer html={html} title={`Confirm payment from ${friendName}`} />
}
