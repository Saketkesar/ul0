import type { Metadata } from "next"
import { auth } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"
import { getFormDocById } from "@/lib/appwrite/forms"
import { FormEntriesClient } from "@/components/dashboard/form-entries-client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

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

  const form = await getFormDocById(id)
  if (!form || form.owner_id !== userId) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 py-6">
        <FormEntriesClient form={form} />
      </main>
      <Footer />
    </div>
  )
}

