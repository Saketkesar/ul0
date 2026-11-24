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
    title: `Payment Not Received · ul0.split`,
    description: `Report payment not received for split ${slug}`,
    icons: {
      icon: "/ul0split-logo-dark.png",
      shortcut: "/ul0split-logo-dark.png",
      apple: "/ul0split-logo-dark.png",
    },
  }
}

export default async function NotReceivedPage({ params, searchParams }: Props) {
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
      const foundIdx = settlements.findIndex(
        (s) => s.from.toLowerCase() === member.toLowerCase()
      )
      if (foundIdx !== -1) memberIndex = foundIdx
    }
  }

  const targetSettlement = settlements[memberIndex]
  const friendName = targetSettlement?.from || "Friend"
  const amount = targetSettlement?.amount || 0

  const html = renderSplitActionPage("not-received", {
    slug,
    token,
    memberIndex,
    friendName,
    creatorName: targetSettlement?.to || "Organizer",
    splitName: session.title,
    amount,
    upiId: session.pay_by || "organizer@upi",
  })

  return <SplitTemplateViewer html={html} title={`Payment not received from ${friendName}`} />
}
