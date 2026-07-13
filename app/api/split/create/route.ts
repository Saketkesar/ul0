import { type NextRequest, NextResponse } from "next/server"
import { generateSlug } from "@/lib/utils/slug"
import { checkRateLimit, getClientIP, getRequestFingerprint, isSuspiciousRequest } from "@/lib/utils/rate-limit"
import { createSplitSession, isConflictError } from "@/lib/appwrite/splits"

// Rate limit configurations
const RATE_LIMIT_CONFIG = {
  windowMs: 60000, // 1 minute
  maxRequests: 3, // Normal users: 3 requests per minute
}

const STRICT_RATE_LIMIT_CONFIG = {
  windowMs: 60000, // 1 minute
  maxRequests: 1, // Suspicious requests: 1 per minute
}

const DAILY_RATE_LIMIT_CONFIG = {
  windowMs: 86400000, // 24 hours
  maxRequests: 20, // Max 20 split sessions per day per IP
}

// Input validation constants
const MAX_TITLE_LENGTH = 100
const MAX_MEMBER_NAME_LENGTH = 50
const MAX_UPI_ID_LENGTH = 100
const MAX_EXPENSE_TITLE_LENGTH = 100
const MAX_MEMBERS = 20
const MAX_EXPENSES = 50
const MAX_AMOUNT = 10000000 // 1 crore

// Sanitize string input
function sanitizeString(str: string | undefined | null, maxLength: number): string {
  if (!str || typeof str !== 'string') return ''
  return str
    .trim()
    .substring(0, maxLength)
    .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
}

// Validate UPI ID format
function isValidUpiId(upiId: string): boolean {
  // UPI ID is optional - empty string is valid
  if (!upiId || upiId.trim() === '') return true
  
  // UPI ID format: username@bankname (e.g., user@paytm, 9876543210@upi)
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/
  return upiRegex.test(upiId) && upiId.length <= MAX_UPI_ID_LENGTH
}

// Validate member object
function validateMember(member: unknown): { valid: boolean; sanitized?: { id: string; name: string; upiId: string; paymentMethod?: string; paymentId?: string }; error?: string } {
  if (!member || typeof member !== 'object') {
    return { valid: false, error: 'Invalid member format' }
  }
  
  const m = member as Record<string, unknown>
  
  // id and name are required, upiId/paymentMethod/paymentId are optional
  if (typeof m.id !== 'string' || typeof m.name !== 'string') {
    return { valid: false, error: 'Member missing required fields' }
  }
  
  const sanitizedName = sanitizeString(m.name, MAX_MEMBER_NAME_LENGTH)
  const sanitizedUpiId = typeof m.upiId === 'string' ? sanitizeString(m.upiId, MAX_UPI_ID_LENGTH) : ''
  const sanitizedPaymentMethod = typeof m.paymentMethod === 'string' ? sanitizeString(m.paymentMethod, 20) : undefined
  const sanitizedPaymentId = typeof m.paymentId === 'string' ? sanitizeString(m.paymentId, MAX_UPI_ID_LENGTH) : undefined
  
  if (!sanitizedName) {
    return { valid: false, error: 'Member name is required' }
  }
  
  // If a UPI ID or paymentId is provided and paymentMethod is upi, validate UPI format
  if (sanitizedPaymentMethod === 'upi') {
    const pid = sanitizedPaymentId || sanitizedUpiId || ''
    if (pid && !isValidUpiId(pid)) {
      return { valid: false, error: `Invalid UPI ID format for ${sanitizedName}` }
    }
  } else {
    // If paymentMethod is not upi but upiId was provided, still validate it
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
    }
  }
}

// Validate expense object
function validateExpense(expense: unknown, validMemberIds: Set<string>): { valid: boolean; sanitized?: object; error?: string } {
  if (!expense || typeof expense !== 'object') {
    return { valid: false, error: 'Invalid expense format' }
  }
  
  const e = expense as Record<string, unknown>
  
  if (typeof e.id !== 'string' || typeof e.title !== 'string' || typeof e.amount !== 'number' || typeof e.paidBy !== 'string') {
    return { valid: false, error: 'Expense missing required fields' }
  }
  
  const sanitizedTitle = sanitizeString(e.title, MAX_EXPENSE_TITLE_LENGTH)
  
  if (!sanitizedTitle) {
    return { valid: false, error: 'Expense title is required' }
  }
  
  if (e.amount <= 0 || e.amount > MAX_AMOUNT || !Number.isFinite(e.amount)) {
    return { valid: false, error: 'Invalid expense amount' }
  }
  
  if (!validMemberIds.has(e.paidBy)) {
    return { valid: false, error: 'Invalid payer in expense' }
  }
  
  // Validate splits if present
  let sanitizedSplits = []
  if (Array.isArray(e.splits)) {
    for (const split of e.splits) {
      if (!split || typeof split !== 'object') continue
      const s = split as Record<string, unknown>
      if (typeof s.memberId === 'string' && typeof s.amount === 'number' && validMemberIds.has(s.memberId)) {
        if (s.amount >= 0 && s.amount <= MAX_AMOUNT && Number.isFinite(s.amount)) {
          sanitizedSplits.push({
            memberId: s.memberId,
            amount: Math.round(s.amount * 100) / 100, // Round to 2 decimal places
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
      date: typeof e.date === 'string' ? sanitizeString(e.date, 20) : new Date().toISOString().split('T')[0],
      splitType: e.splitType === 'custom' ? 'custom' : 'equal',
      splits: sanitizedSplits,
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client identifier for rate limiting
    const clientIP = getClientIP(request)
    const fingerprint = getRequestFingerprint(request)
    
    // Check for suspicious requests (bots, missing headers)
    const suspiciousCheck = isSuspiciousRequest(request)
    
    // Use stricter rate limits for suspicious requests
    const rateLimitConfig = suspiciousCheck.suspicious 
      ? STRICT_RATE_LIMIT_CONFIG 
      : RATE_LIMIT_CONFIG
    
    const identifier = `split:${clientIP}:${fingerprint}`
    const dailyIdentifier = `split:daily:${clientIP}`
    
    // Check per-minute rate limit
    const rateLimitResult = await checkRateLimit(identifier, rateLimitConfig)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: `Rate limit exceeded. Please wait ${rateLimitResult.resetIn} seconds before creating another split session.`,
          retryAfter: rateLimitResult.resetIn 
        }, 
        { 
          status: 429,
          headers: {
            "Retry-After": rateLimitResult.resetIn.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimitResult.resetIn.toString(),
          }
        }
      )
    }
    
    // Check daily rate limit
    const dailyRateLimitResult = await checkRateLimit(dailyIdentifier, DAILY_RATE_LIMIT_CONFIG)
    
    if (!dailyRateLimitResult.success) {
      return NextResponse.json(
        { 
          error: "Daily limit reached. Please try again tomorrow.",
          retryAfter: dailyRateLimitResult.resetIn 
        }, 
        { 
          status: 429,
          headers: {
            "Retry-After": dailyRateLimitResult.resetIn.toString(),
          }
        }
      )
    }

    // Parse request body with error handling
    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }
    
    const { title, members, expenses, settlements, totalAmount } = body

    // Validate title
    const sanitizedTitle = sanitizeString(title as string, MAX_TITLE_LENGTH)
    if (!sanitizedTitle) {
      return NextResponse.json({ errors: [{ path: 'title', message: 'Group name is required' }] }, { status: 400 })
    }

    // Validate members
    if (!Array.isArray(members) || members.length < 2) {
      return NextResponse.json({ errors: [{ path: 'members', message: 'At least 2 members are required' }] }, { status: 400 })
    }
    
    if (members.length > MAX_MEMBERS) {
      return NextResponse.json({ error: `Maximum ${MAX_MEMBERS} members allowed` }, { status: 400 })
    }
    
    const sanitizedMembers: Array<Record<string, unknown>> = []
    const validMemberIds = new Set<string>()
    
    // Helper to map validation messages to a likely field
    function mapMemberErrorField(member: unknown, message?: string) {
      const m = (member && typeof member === 'object') ? member as Record<string, unknown> : {}
      const msg = (message || '').toLowerCase()
      if (msg.includes('name')) return 'name'
      if (msg.includes('upi')) {
        if (typeof m.paymentId === 'string' && m.paymentId) return 'paymentId'
        return 'upiId'
      }
      // default fallback
      return 'id'
    }

    for (let i = 0; i < members.length; i++) {
      const member = members[i]
      const validation = validateMember(member)
      if (!validation.valid) {
        const field = mapMemberErrorField(member, validation.error)
        return NextResponse.json({ errors: [{ path: `members[${i}].${field}`, message: validation.error || 'Invalid member' }] }, { status: 400 })
      }
      // Push sanitized member object including paymentMethod/paymentId if present
      const sm = validation.sanitized!
      sanitizedMembers.push({
        id: sm.id,
        name: sm.name,
        upiId: sm.upiId || '',
        paymentMethod: sm.paymentMethod || null,
        paymentId: sm.paymentId || '',
      })
      validMemberIds.add(sm.id)
    }

    // Validate expenses
    if (!Array.isArray(expenses)) {
      return NextResponse.json({ error: "Expenses must be an array" }, { status: 400 })
    }
    
    if (expenses.length > MAX_EXPENSES) {
      return NextResponse.json({ error: `Maximum ${MAX_EXPENSES} expenses allowed` }, { status: 400 })
    }
    
    const sanitizedExpenses = []
    // Map expense errors to fields for nicer client-side display
    function mapExpenseErrorField(expense: unknown, message?: string) {
      const e = (expense && typeof expense === 'object') ? expense as Record<string, unknown> : {}
      const msg = (message || '').toLowerCase()
      if (msg.includes('title')) return 'title'
      if (msg.includes('amount')) return 'amount'
      if (msg.includes('payer') || msg.includes('paid')) return 'paidBy'
      return 'id'
    }

    for (let i = 0; i < expenses.length; i++) {
      const expense = expenses[i]
      const validation = validateExpense(expense, validMemberIds)
      if (!validation.valid) {
        const field = mapExpenseErrorField(expense, validation.error)
        return NextResponse.json({ errors: [{ path: `expenses[${i}].${field}`, message: validation.error || 'Invalid expense' }] }, { status: 400 })
      }
      sanitizedExpenses.push(validation.sanitized)
    }

    // Validate total amount
    const calculatedTotal = sanitizedExpenses.reduce((sum, e: any) => sum + e.amount, 0)
    const sanitizedTotalAmount = typeof totalAmount === 'number' && Number.isFinite(totalAmount) 
      ? Math.round(totalAmount * 100) / 100 
      : calculatedTotal

    // Validate settlements (if provided)
    let sanitizedSettlements = []
    if (Array.isArray(settlements)) {
      for (const settlement of settlements) {
        if (settlement && typeof settlement === 'object') {
          const s = settlement as Record<string, unknown>
          if (
            typeof s.from === 'string' && 
            typeof s.to === 'string' && 
            typeof s.amount === 'number' &&
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
            })
          }
        }
      }
    }

    // Calculate expiry (24 hours from now)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    // RACE CONDITION FIX: Attempt insert directly and handle unique constraint
    // violation from Appwrite's unique slug index (atomic operation).
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
        })

        return NextResponse.json({ 
          slug: session.slug,
          expiresAt: session.expires_at,
        })
      } catch (err) {
        if (isConflictError(err)) {
          // Slug collision - try a new one
          slug = generateSlug()
          attempts++
          continue
        }
        
        // Other database error
        console.error("Database error:", err)
        return NextResponse.json({ error: "Failed to create split session" }, { status: 500 })
      }
    }
    
    // Exhausted all attempts (very unlikely)
    console.error("Failed to generate unique slug after max attempts")
    return NextResponse.json({ error: "Failed to create split session. Please try again." }, { status: 500 })
    
  } catch (error) {
    console.error("Error creating split session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

