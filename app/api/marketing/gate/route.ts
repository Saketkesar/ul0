import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { advanceGateStep, getGateSession } from "@/lib/marketing-gate-session"
import { incrementCompletions } from "@/lib/appwrite/marketing-links"
import { checkRateLimit } from "@/lib/redis"

const GATE_SESSION_COOKIE = "ul0_gate_token"

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(GATE_SESSION_COOKIE)?.value

    if (!token) {
      return NextResponse.json(
        { error: "No gate session found. Please start from the beginning." },
        { status: 401 }
      )
    }

    // Rate limit: 1 advance per 10 seconds per session
    const rl = await checkRateLimit(`gate_advance:${token}`, 1, 10)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Please wait before continuing." },
        { status: 429 }
      )
    }

    const result = await advanceGateStep(token)

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // If gate completed, increment completions counter
    if (result.isComplete && result.session) {
      incrementCompletions(result.session.marketing_link_id).catch(console.error)
    }

    return NextResponse.json({
      success: true,
      isComplete: result.isComplete,
      currentStep: result.session?.current_step,
      totalSteps: result.session?.blog_slugs.length,
      destinationUrl: result.isComplete ? result.session?.destination_url : undefined,
    })
  } catch (error: any) {
    console.error("Gate advance error:", error)
    return NextResponse.json(
      { error: "Failed to advance." },
      { status: 500 }
    )
  }
}

/**
 * GET: Check current gate session status (for client hydration)
 */
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(GATE_SESSION_COOKIE)?.value

    if (!token) {
      return NextResponse.json({ hasSession: false })
    }

    const session = await getGateSession(token)
    if (!session) {
      return NextResponse.json({ hasSession: false })
    }

    return NextResponse.json({
      hasSession: true,
      currentStep: session.current_step,
      totalSteps: session.blog_slugs.length,
      completed: session.completed,
      alias: session.alias,
    })
  } catch {
    return NextResponse.json({ hasSession: false })
  }
}
