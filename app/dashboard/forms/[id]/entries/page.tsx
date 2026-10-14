import type { Metadata } from "next"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"
import { isUserAdmin } from "@/lib/marketing-auth"
import { getFormDocById } from "@/lib/appwrite/forms"
import { FormEntriesClient } from "@/components/dashboard/form-entries-client"

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Spreadsheet Entries — Forms | UL0",
  description: "View, inspect, search, and manage entries directly from your connected Google Sheet.",
}

export default async function FormEntriesPage({ params }: PageProps) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const clerkUser = await currentUser().catch(() => null)
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? null
  if (!isUserAdmin(userId, email)) {
    redirect("/dashboard/forms")
  }

  const form = await getFormDocById(id)
  if (!form || form.owner_id !== userId) {
    notFound()
  }

  return <FormEntriesClient form={form} />
}
