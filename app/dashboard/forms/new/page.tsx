import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { isUserAdmin } from "@/lib/marketing-auth"
import { createFormDoc } from "@/lib/appwrite/forms"
import { generateScriptSecret, encryptSecret } from "@/lib/forms/crypto"

export default async function NewFormPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const clerkUser = await currentUser().catch(() => null)
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? null
  if (!isUserAdmin(userId, email)) {
    redirect("/dashboard/forms")
  }

  const randomSlug = `form-${Math.random().toString(36).substring(2, 7)}`
  const rawSecret = generateScriptSecret()
  const script_secret_enc = encryptSecret(rawSecret)

  const initialSchema = [
    {
      id: "f_name",
      key: "full_name",
      type: "short_text",
      label: "Full Name",
      required: true,
      placeholder: "Jane Doe",
    },
    {
      id: "f_email",
      key: "email",
      type: "email",
      label: "Email Address",
      required: true,
      placeholder: "jane@example.com",
    },
    {
      id: "f_feedback",
      key: "feedback",
      type: "long_text",
      label: "How can we help?",
      required: false,
      placeholder: "Type your message here...",
    },
  ]

  const newForm = await createFormDoc({
    owner_id: userId,
    slug: randomSlug,
    title: "Untitled Form",
    description: "",
    schema: initialSchema,
    theme: {
      accent: "teal",
      font: "sans",
      mode: "auto",
      submit_label: "Submit Response",
      success_message: "Thank you! Your response has been securely saved to Google Sheets.",
    },
    permissions: { read: true, edit: false, delete: false },
    script_secret_enc,
  })

  redirect(`/dashboard/forms/${newForm.id}`)
}
