import { NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { checkRateLimit, getClientIP } from "@/lib/utils/rate-limit"

export async function GET(req: Request) {
  try {
    // Rate limit: 20 requests per minute per IP
    const clientIP = getClientIP(req)
    const rateLimitResult = await checkRateLimit(`upi:qr:${clientIP}`, {
      windowMs: 60000,
      maxRequests: 20,
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      )
    }

    const url = new URL(req.url)
    const upi = url.searchParams.get('upi') || ''
    const name = url.searchParams.get('name') || ''
    const amount = url.searchParams.get('amount') || ''

    if (!upi) {
      return NextResponse.json({ error: 'Missing upi parameter' }, { status: 400 })
    }

    const note = name ? `&tn=${encodeURIComponent(name)}` : ''
    const am = amount ? `&am=${encodeURIComponent(amount)}` : ''

    const upiLink = `upi://pay?pa=${encodeURIComponent(upi)}${note}${am}&cu=INR`

    // Generate PNG buffer (sized 400x400)
    const buffer = await QRCode.toBuffer(upiLink, { type: 'png', width: 400 })
    const uint8 = new Uint8Array(buffer)

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  } catch (err) {
    console.error('QR generation error', err)
    return NextResponse.json({ error: 'Failed to generate QR' }, { status: 500 })
  }
}
