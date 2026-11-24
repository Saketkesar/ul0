import { Metadata } from "next"
import { renderSplitActionPage } from "@/lib/split/page-renderer"
import { SplitTemplateViewer } from "@/components/split/split-template-viewer"

interface Props {
  searchParams: Promise<{ email?: string }>
}

export const metadata: Metadata = {
  title: "Email Preferences & Unsubscribe · ul0.split",
  description: "Manage your notification preferences for UL0 Split & Hisab",
  icons: {
    icon: "/ul0split-logo-dark.png",
    shortcut: "/ul0split-logo-dark.png",
    apple: "/ul0split-logo-dark.png",
  },
}

export default async function UnsubscribePage({ searchParams }: Props) {
  const { email = "friend@example.com" } = await searchParams

  const html = renderSplitActionPage("unsubscribe", {
    email,
  })

  return <SplitTemplateViewer html={html} title="Unsubscribe · ul0.split" />
}
