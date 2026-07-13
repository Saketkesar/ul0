import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Free Pomodoro Timer — Focus & Productivity Tool | ul0.site",
  description: "Boost your productivity with the Pomodoro technique. Free online timer with 25-minute work sessions and break reminders. No account needed, works in your browser.",
  keywords: ["Pomodoro timer", "Pomodoro technique online", "focus timer free", "productivity timer", "work break timer"],
  alternates: { canonical: "https://ul0.site/pomodoro" },
  openGraph: { title: "Free Pomodoro Timer | ul0.site", description: "Boost focus with the Pomodoro technique. Free browser timer.", url: "https://ul0.site/pomodoro", siteName: "ul0.site", type: "website" },
}
export default function PomodoroLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
