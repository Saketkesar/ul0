import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Expense Splitter — Split Bills & Group Costs Easily | ul0.site",
  description: "Split bills, group expenses, and track who owes what — free online expense splitter for trips, dinners, and shared costs. No account needed.",
  keywords: ["expense splitter online", "split bill app", "group cost calculator", "trip expense tracker", "bill splitting tool"],
  alternates: { canonical: "https://ul0.site/split" },
  openGraph: { title: "Free Expense Splitter | ul0.site", description: "Split group bills and expenses instantly online. Free, no signup.", url: "https://ul0.site/split", siteName: "ul0.site", type: "website" },
}
export default function SplitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
