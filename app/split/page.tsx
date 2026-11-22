import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SplitLandingPage } from "@/components/split/landing-page"

export default function SplitPage() {
  return (
    <div className="min-h-screen bg-[#F7FAF8] text-[#0B1A17] flex flex-col font-sans selection:bg-[#3DDBB8] selection:text-[#04231C]">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10">
        <SplitLandingPage />
      </main>

      <Footer />
    </div>
  )
}
