import type { Metadata } from "next"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"
import { isUserAdmin } from "@/lib/marketing-auth"
import { getFormDocById } from "@/lib/appwrite/forms"
import { FormBuilderClient } from "@/components/dashboard/form-builder-client"

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Form Studio — Dashboard | UL0",
  description: "Configure questions, generate Google Apps Script, and connect directly to your Google Sheet.",
}

export default async function FormStudioPage({ params }: PageProps) {
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

  return <FormBuilderClient initialForm={form} userEmail={email} />
}
