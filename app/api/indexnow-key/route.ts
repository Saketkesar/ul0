import { NextResponse } from "next/server"

export async function GET() {
  return new NextResponse("1b98f244195a4bb896890d3bb639f7ee", {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=31536000",
    },
  })
}
