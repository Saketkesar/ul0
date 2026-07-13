import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Ambient Soundscapes — Focus & Relaxation Sounds | ul0.site",
  description: "Listen to ambient sounds for focus, relaxation, or sleep. Free browser-based soundscape tool — rain, white noise, cafe sounds, and more. No download needed.",
  keywords: ["ambient sounds online", "focus sounds browser", "white noise free", "relaxation soundscape", "study music tool"],
  alternates: { canonical: "https://ul0.site/ambient" },
  openGraph: { title: "Free Ambient Sounds | ul0.site", description: "Ambient soundscapes for focus and relaxation. Free, no download.", url: "https://ul0.site/ambient", siteName: "ul0.site", type: "website" },
}
export default function AmbientLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
