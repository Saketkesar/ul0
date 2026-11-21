"use client"

import { useAuth } from "@clerk/nextjs"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SplitWizard } from "@/components/split/split-wizard"
import { PublicLanding } from "@/components/split/public-landing"

export default function SplitPage() {
  const { isLoaded, isSignedIn } = useAuth()

  return (
    <div className="min-h-screen bg-[#F7FAF8] text-[#0B1A17] flex flex-col font-sans selection:bg-[#3DDBB8] selection:text-[#04231C]">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        {!isLoaded ? (
          // Loading skeleton
          <div className="max-w-xl mx-auto space-y-4 animate-pulse">
            <div className="h-8 bg-[#EAF1EE] rounded-lg w-48 mx-auto" />
            <div className="h-4 bg-[#EAF1EE] rounded w-64 mx-auto" />
            <div className="h-64 bg-white border border-[#E4ECE8] rounded-2xl mt-8" />
          </div>
        ) : isSignedIn ? (
          // Signed-in Creator Wizard
          <SplitWizard />
        ) : (
          // Signed-out SEO Public Landing
          <PublicLanding />
        )}
      </main>

      <Footer />
    </div>
  )
}
