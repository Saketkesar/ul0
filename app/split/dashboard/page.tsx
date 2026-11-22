"use client"

import { useAuth, SignInButton } from "@clerk/nextjs"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SplitWizard } from "@/components/split/split-wizard"
import { Button } from "@/components/ui/button"
import { UL0Icon } from "@/components/ul0-icon"

export default function SplitDashboardPage() {
  const { isLoaded, isSignedIn } = useAuth()

  return (
    <div className="min-h-screen bg-[#F7FAF8] text-[#0B1A17] flex flex-col font-sans selection:bg-[#3DDBB8] selection:text-[#04231C]">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10">
        {!isLoaded ? (
          <div className="max-w-xl mx-auto space-y-4 animate-pulse py-12">
            <div className="h-8 bg-[#EAF1EE] rounded-lg w-48 mx-auto" />
            <div className="h-4 bg-[#EAF1EE] rounded w-64 mx-auto" />
            <div className="h-64 bg-white border border-[#E4ECE8] rounded-2xl mt-8" />
          </div>
        ) : isSignedIn ? (
          <SplitWizard />
        ) : (
          <div className="max-w-md mx-auto my-12 p-8 rounded-3xl border border-[#E4ECE8] bg-white text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#EAF7F3] text-[#0B7A66] mx-auto flex items-center justify-center font-bold">
              <UL0Icon name="splitbill" size={26} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#0B1A17]">Sign in to Create Splits</h2>
              <p className="text-xs text-[#5A6B66] mt-1.5 leading-relaxed">
                Sign in once to save your default UPI ID, manage splits, and confirm payments from your phone or PC.
              </p>
            </div>
            <div className="pt-2">
              <SignInButton mode="modal">
                <Button className="w-full bg-[#0B1A17] hover:bg-[#1a2e2a] text-white text-xs h-11 rounded-xl font-bold cursor-pointer shadow-md">
                  Sign in with Google
                </Button>
              </SignInButton>
            </div>
            <p className="text-[11px] text-[#5A6B66] pt-1">
              Your friends will never need an account to pay you.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
