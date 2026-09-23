import "server-only"
import { redis } from "./redis"
import { randomBytes } from "crypto"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GateSession {
  marketing_link_id: string
  alias: string
  current_step: number
  blog_slugs: string[]
  destination_url: string
  started_at: number
  step_unlocked_at: number[]
  completed: boolean
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SESSION_TTL = 30 * 60 // 30 minutes
const GATE_TIMER_SECONDS = parseInt(process.env.GATE_TIMER_SECONDS || "15", 10)

function sessionKey(token: string): string {
  return `gate_session:${token}`
}

// ---------------------------------------------------------------------------
// Session Management
// ---------------------------------------------------------------------------

export function generateSessionToken(): string {
  return randomBytes(24).toString("hex")
}

export async function createGateSession(
  token: string,
  data: Omit<GateSession, "current_step" | "started_at" | "step_unlocked_at" | "completed">
): Promise<GateSession> {
  const session: GateSession = {
    ...data,
    current_step: 0,
    started_at: Date.now(),
    step_unlocked_at: [],
    completed: false,
  }
  await redis.set(sessionKey(token), JSON.stringify(session), { ex: SESSION_TTL })
  return session
}

export async function getGateSession(token: string): Promise<GateSession | null> {
  if (!token) return null
  try {
    const raw = await redis.get<string>(sessionKey(token))
    if (!raw) return null
    return typeof raw === "string" ? JSON.parse(raw) : raw as unknown as GateSession
  } catch {
    return null
  }
}

export async function updateGateSession(
  token: string,
  session: GateSession
): Promise<void> {
  await redis.set(sessionKey(token), JSON.stringify(session), { ex: SESSION_TTL })
}

export async function deleteGateSession(token: string): Promise<void> {
  await redis.del(sessionKey(token))
}

/**
 * Advance gate session to the next step.
 * Returns { ok, error, session, isComplete }
 */
export async function advanceGateStep(
  token: string
): Promise<{
  ok: boolean
  error?: string
  session?: GateSession
  isComplete?: boolean
}> {
  const session = await getGateSession(token)
  if (!session) {
    return { ok: false, error: "Session not found or expired." }
  }

  if (session.completed) {
    return { ok: false, error: "Session already completed." }
  }

  const currentStep = session.current_step
  const totalSteps = session.blog_slugs.length

  // Validate timer: the current step must have been open for at least GATE_TIMER_SECONDS
  const lastUnlock = session.step_unlocked_at[currentStep]
  if (!lastUnlock) {
    return { ok: false, error: "Step not yet started." }
  }

  const elapsed = (Date.now() - lastUnlock) / 1000
  if (elapsed < GATE_TIMER_SECONDS - 1) {
    // Allow 1s grace for network latency
    return {
      ok: false,
      error: `Please wait ${Math.ceil(GATE_TIMER_SECONDS - elapsed)} more seconds.`,
    }
  }

  // Advance
  const nextStep = currentStep + 1
  const isComplete = nextStep >= totalSteps

  session.current_step = nextStep
  if (isComplete) {
    session.completed = true
  } else {
    // Record the unlock time for the next step
    session.step_unlocked_at[nextStep] = Date.now()
  }

  await updateGateSession(token, session)

  return { ok: true, session, isComplete }
}

/**
 * Mark the current step as started (records unlock timestamp).
 * Called when the gate page is first rendered for a step.
 */
export async function markStepStarted(
  token: string,
  step: number
): Promise<void> {
  const session = await getGateSession(token)
  if (!session || session.completed) return

  if (step === session.current_step && !session.step_unlocked_at[step]) {
    session.step_unlocked_at[step] = Date.now()
    await updateGateSession(token, session)
  }
}

export { GATE_TIMER_SECONDS }
