import type { Metadata } from "next"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { isUserAdmin } from "@/lib/marketing-auth"
import { listFormDocsByOwner } from "@/lib/appwrite/forms"
import { FormsListClient } from "@/components/dashboard/forms-list-client"
import { ShieldAlert, ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Forms → Google Sheets — Dashboard | UL0",
  description: "Create public forms connected directly to your Google Sheet without storing responses in any database.",
}

export default async function FormsDashboardPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect("/sign-in")
  }

  const clerkUser = await currentUser().catch(() => null)
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? null

  const isAuthorized = isUserAdmin(userId, email)

  if (!isAuthorized) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl font-bold text-[var(--foreground)]">Admin Access Required</h1>
          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
            The Forms → Google Sheets module is currently enabled exclusively for authorized administrative accounts.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    )
  }

  const forms = await listFormDocsByOwner(userId)
  return <FormsListClient initialForms={forms} />
}
