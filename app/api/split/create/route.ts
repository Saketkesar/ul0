import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { generateSlug } from "@/lib/utils/slug"
import { checkRateLimit, getClientIP, getRequestFingerprint, isSuspiciousRequest } from "@/lib/utils/rate-limit"
import {
  createSplitSession,
  isConflictError,
  generateCollectorToken,
  hashCollectorToken,
} from "@/lib/appwrite/splits"

// Rate limit configurations
const RATE_LIMIT_CONFIG = {
  windowMs: 60000,
  maxRequests: 3,
}

const STRICT_RATE_LIMIT_CONFIG = {
  windowMs: 60000,
  maxRequests: 1,
}

const DAILY_RATE_LIMIT_CONFIG = {
  windowMs: 86400000,
  maxRequests: 20,
}

// Input validation constants
const MAX_TITLE_LENGTH = 100
const MAX_MEMBER_NAME_LENGTH = 50
const MAX_UPI_ID_LENGTH = 100
const MAX_EXPENSE_TITLE_LENGTH = 100
const MAX_MEMBERS = 20
const MAX_EXPENSES = 50
const MAX_AMOUNT = 10000000 // 1 crore

// Allowed expiry options (days)
const ALLOWED_EXPIRY_DAYS = [7, 30, 90]

function sanitizeString(str: string | undefined | null, maxLength: number): string {
  if (!str || typeof str !== "string") return ""
  return str
    .trim()
    .substring(0, maxLength)
    .replace(/[<>"'&]/g, "")
}

function isValidUpiId(upiId: string): boolean {
  if (!upiId || upiId.trim() === "") return true
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/
  return upiRegex.test(upiId) && upiId.length <= MAX_UPI_ID_LENGTH
}

function validateMember(
  member: unknown
): {
  valid: boolean
  sanitized?: { id: string; name: string; upiId: string; paymentMethod?: string; paymentId?: string }
  error?: string
} {
  if (!member || typeof member !== "object") {
    return { valid: false, error: "Invalid member format" }
  }

  const m = member as Record<string, unknown>

  if (typeof m.id !== "string" || typeof m.name !== "string") {
    return { valid: false, error: "Member missing required fields" }
  }

  const sanitizedName = sanitizeString(m.name, MAX_MEMBER_NAME_LENGTH)
  const sanitizedUpiId = typeof m.upiId === "string" ? sanitizeString(m.upiId, MAX_UPI_ID_LENGTH) : ""
  const sanitizedPaymentMethod = typeof m.paymentMethod === "string" ? sanitizeString(m.paymentMethod, 20) : undefined
  const sanitizedPaymentId = typeof m.paymentId === "string" ? sanitizeString(m.paymentId, MAX_UPI_ID_LENGTH) : undefined

  if (!sanitizedName) {
    return { valid: false, error: "Member name is required" }
  }

  if (sanitizedPaymentMethod === "upi") {
    const pid = sanitizedPaymentId || sanitizedUpiId || ""
    if (pid && !isValidUpiId(pid)) {
      return { valid: false, error: `Invalid UPI ID format for ${sanitizedName}` }
    }
  } else {
    if (sanitizedUpiId && !isValidUpiId(sanitizedUpiId)) {
      return { valid: false, error: `Invalid UPI ID format for ${sanitizedName}` }
    }
  }

  return {
    valid: true,
    sanitized: {
      id: sanitizeString(m.id, 50),
      name: sanitizedName,
      upiId: sanitizedUpiId,
      paymentMethod: sanitizedPaymentMethod,
      paymentId: sanitizedPaymentId,
    },
  }
}

function validateExpense(
  expense: unknown,
  validMemberIds: Set<string>
): { valid: boolean; sanitized?: object; error?: string } {
  if (!expense || typeof expense !== "object") {
    return { valid: false, error: "Invalid expense format" }
  }

  const e = expense as Record<string, unknown>

  if (typeof e.id !== "string" || typeof e.title !== "string" || typeof e.amount !== "number" || typeof e.paidBy !== "string") {
    return { valid: false, error: "Expense missing required fields" }
  }

  const sanitizedTitle = sanitizeString(e.title, MAX_EXPENSE_TITLE_LENGTH)

  if (!sanitizedTitle) {
    return { valid: false, error: "Expense title is required" }
  }

  if (e.amount <= 0 || e.amount > MAX_AMOUNT || !Number.isFinite(e.amount)) {
    return { valid: false, error: "Invalid expense amount" }
  }

  if (!validMemberIds.has(e.paidBy)) {
    return { valid: false, error: "Invalid payer in expense" }
  }

  let sanitizedSplits: { memberId: string; amount: number }[] = []
  if (Array.isArray(e.splits)) {
    for (const split of e.splits) {
      if (!split || typeof split !== "object") continue
      const s = split as Record<string, unknown>
      if (typeof s.memberId === "string" && typeof s.amount === "number" && validMemberIds.has(s.memberId)) {
        if (s.amount >= 0 && s.amount <= MAX_AMOUNT && Number.isFinite(s.amount)) {
          sanitizedSplits.push({
            memberId: s.memberId,
            amount: Math.round(s.amount * 100) / 100,
          })
        }
      }
    }
  }

  return {
    valid: true,
    sanitized: {
      id: sanitizeString(e.id, 50),
      title: sanitizedTitle,
      amount: Math.round(e.amount * 100) / 100,
      paidBy: e.paidBy,
      date: typeof e.date === "string" ? sanitizeString(e.date, 20) : new Date().toISOString().split("T")[0],
      splitType: e.splitType === "custom" ? "custom" : "equal",
      splits: sanitizedSplits,
    },
  }
}

export async function POST(request: NextRequest) {
  try {
    // ---- AUTH: Require signed-in user ----
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: "Sign in to create a split" },
        { status: 401 }
      )
    }

    // ---- RATE LIMITS ----
    const clientIP = getClientIP(request)
    const fingerprint = getRequestFingerprint(request)

    const isSuspicious = isSuspiciousRequest(request)
    const rateLimitConfig = isSuspicious ? STRICT_RATE_LIMIT_CONFIG : RATE_LIMIT_CONFIG

    const rateLimitResult = await checkRateLimit(`split:create:${clientIP}:${fingerprint}`, rateLimitConfig)
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before creating another split." },
        { status: 429, headers: { "Retry-After": rateLimitResult.resetIn.toString() } }
      )
    }

    const dailyRateLimitResult = await checkRateLimit(`split:create:daily:${clientIP}`, DAILY_RATE_LIMIT_CONFIG)
    if (!dailyRateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Daily limit reached. Try again tomorrow." },
        { status: 429, headers: { "Retry-After": dailyRateLimitResult.resetIn.toString() } }
      )
    }

    // ---- PARSE BODY ----
    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { title, members, expenses, settlements, totalAmount } = body

    // ---- VALIDATE TITLE ----
    const sanitizedTitle = sanitizeString(title as string, MAX_TITLE_LENGTH)
    if (!sanitizedTitle) {
      return NextResponse.json({ errors: [{ path: "title", message: "Group name is required" }] }, { status: 400 })
    }

    // ---- VALIDATE MEMBERS ----
    if (!Array.isArray(members) || members.length < 2) {
      return NextResponse.json({ errors: [{ path: "members", message: "At least 2 members are required" }] }, { status: 400 })
    }

    if (members.length > MAX_MEMBERS) {
      return NextResponse.json({ error: `Maximum ${MAX_MEMBERS} members allowed` }, { status: 400 })
    }

    const sanitizedMembers: Array<Record<string, unknown>> = []
    const validMemberIds = new Set<string>()

    for (let i = 0; i < members.length; i++) {
      const validation = validateMember(members[i])
      if (!validation.valid) {
        return NextResponse.json({ errors: [{ path: `members[${i}]`, message: validation.error || "Invalid member" }] }, { status: 400 })
      }
      const sm = validation.sanitized!
      sanitizedMembers.push({
        id: sm.id,
        name: sm.name,
        upiId: sm.upiId || "",
        paymentMethod: sm.paymentMethod || null,
        paymentId: sm.paymentId || "",
      })
      validMemberIds.add(sm.id)
    }

    // ---- VALIDATE EXPENSES ----
    if (!Array.isArray(expenses)) {
      return NextResponse.json({ error: "Expenses must be an array" }, { status: 400 })
    }

    if (expenses.length > MAX_EXPENSES) {
      return NextResponse.json({ error: `Maximum ${MAX_EXPENSES} expenses allowed` }, { status: 400 })
    }

    const sanitizedExpenses: object[] = []
    for (let i = 0; i < expenses.length; i++) {
      const validation = validateExpense(expenses[i], validMemberIds)
      if (!validation.valid) {
        return NextResponse.json({ errors: [{ path: `expenses[${i}]`, message: validation.error || "Invalid expense" }] }, { status: 400 })
      }
      sanitizedExpenses.push(validation.sanitized!)
    }

    // ---- VALIDATE TOTAL ----
    const calculatedTotal = sanitizedExpenses.reduce((sum, e: any) => sum + e.amount, 0)
    const sanitizedTotalAmount =
      typeof totalAmount === "number" && Number.isFinite(totalAmount)
        ? Math.round(totalAmount * 100) / 100
        : calculatedTotal

    // ---- VALIDATE SETTLEMENTS ----
    let sanitizedSettlements: { from: string; to: string; amount: number; status: string }[] = []
    if (Array.isArray(settlements)) {
      for (const settlement of settlements) {
        if (settlement && typeof settlement === "object") {
          const s = settlement as Record<string, unknown>
          if (
            typeof s.from === "string" &&
            typeof s.to === "string" &&
            typeof s.amount === "number" &&
            validMemberIds.has(s.from) &&
            validMemberIds.has(s.to) &&
            s.amount > 0 &&
            s.amount <= MAX_AMOUNT &&
            Number.isFinite(s.amount)
          ) {
            sanitizedSettlements.push({
              from: s.from,
              to: s.to,
              amount: Math.round(s.amount * 100) / 100,
              status: "unpaid",
            })
          }
        }
      }
    }

    // ---- EXPIRY ----
    const expiryDays = typeof body.expiryDays === "number" && ALLOWED_EXPIRY_DAYS.includes(body.expiryDays)
      ? body.expiryDays
      : 30
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiryDays)

    // ---- CURRENCY ----
    const currencyCode = typeof body.currency === "string" ? sanitizeString(body.currency, 10) : "INR"
    if (sanitizedMembers.length > 0) {
      (sanitizedMembers[0] as any).currency = currencyCode
    }

    // ---- PAY BY DATE ----
    let payBy: string | null = null
    if (typeof body.payBy === "string") {
      const d = new Date(body.payBy)
      if (!isNaN(d.getTime()) && d > new Date()) {
        payBy = d.toISOString()
      }
    }

    // ---- COLLECTOR TOKEN ----
    const collectorToken = generateCollectorToken()
    const collectorTokenHash = hashCollectorToken(collectorToken)

    // ---- LOCALE ----
    const locale = typeof body.locale === "string" && ["en", "hi"].includes(body.locale)
      ? body.locale
      : "en"

    // ---- CREATE ----
    let slug = generateSlug()
    let attempts = 0
    const maxAttempts = 5

    while (attempts < maxAttempts) {
      try {
        const session = await createSplitSession({
          slug,
          title: sanitizedTitle,
          members: sanitizedMembers,
          expenses: sanitizedExpenses,
          settlements: sanitizedSettlements,
          total_amount: sanitizedTotalAmount,
          expires_at: expiresAt.toISOString(),
          owner_user_id: userId,
          kind: "bill",
          locale,
          currency: currencyCode,
          pay_by: payBy,
          collector_token_hash: collectorTokenHash,
        })

        return NextResponse.json({
          slug: session.slug,
          expiresAt: session.expires_at,
          // Collector token returned ONCE — the client must save it
          collectorToken,
        })
      } catch (err) {
        if (isConflictError(err)) {
          slug = generateSlug()
          attempts++
          continue
        }
        console.error("Database error:", err)
        return NextResponse.json({ error: "Failed to create split session" }, { status: 500 })
      }
    }

    return NextResponse.json({ error: "Failed to create split session. Please try again." }, { status: 500 })
  } catch (error) {
    console.error("Error creating split session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
