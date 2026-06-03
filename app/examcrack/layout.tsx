import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Examcrack OS - The Calm & Premium Student Operating System | ul0",
  description: "Organize your semester, import datesheets, track topics, analyze past year questions (PYQs), study spaced-repetition flashcards, practice quizzes, and access emergency revision notes in one distraction-free student OS.",
  alternates: {
    canonical: "https://ul0.site/examcrack",
  },
  openGraph: {
    title: "Examcrack OS - The Calm & Premium Student Operating System | ul0",
    description: "Organize your semester, import datesheets, track topics, analyze past year questions (PYQs), study spaced-repetition flashcards, practice quizzes, and access emergency revision notes in one distraction-free student OS.",
    url: "https://ul0.site/examcrack",
    type: "website",
    siteName: "ul0 - Free URL Shortener",
  }
}

export default function ExamcrackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
