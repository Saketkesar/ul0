import type { Metadata } from "next"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"
import { getFormDocById } from "@/lib/appwrite/forms"
import { decryptSecret } from "@/lib/forms/crypto"
import { FormBuilderClient } from "@/components/dashboard/form-builder-client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Form Studio — Zero-DB Form Builder | UL0",
  description: "Configure questions, generate Google Apps Script, and connect directly to your Google Sheet.",
}

export default async function FormStudioPage({ params }: PageProps) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const form = await getFormDocById(id)
  if (!form || form.owner_id !== userId) {
    notFound()
  }

  const clerkUser = await currentUser().catch(() => null)
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? null

  let secret = ""
  if (form.script_secret_enc) {
    try {
      secret = decryptSecret(form.script_secret_enc)
    } catch {}
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <FormBuilderClient initialForm={form} initialSecret={secret} userEmail={email} />
      </main>
      <Footer />
    </div>
  )
}

