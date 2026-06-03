import { NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function GET(req: Request) {
  try {
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
