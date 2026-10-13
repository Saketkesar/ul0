import { type NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { isUserAdmin } from "@/lib/marketing-auth"
import { getFormDocById, updateFormDoc } from "@/lib/appwrite/forms"
import { generateScriptSecret, encryptSecret } from "@/lib/forms/crypto"

interface Context {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await currentUser().catch(() => null)
    const email = user?.emailAddresses?.[0]?.emailAddress ?? null
    if (!isUserAdmin(userId, email)) {
      return NextResponse.json({ error: "Forbidden: Admin access only." }, { status: 403 })
    }

    const form = await getFormDocById(id)
    if (!form || form.owner_id !== userId) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    const rawSecret = generateScriptSecret()
    const script_secret_enc = encryptSecret(rawSecret)

    await updateFormDoc(id, { script_secret_enc })

    return NextResponse.json({
      success: true,
      rawSecret,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to regenerate secret." }, { status: 500 })
  }
}
