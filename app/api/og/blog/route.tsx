import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const title = searchParams.get("title") || "Free Custom Domain Link Shortener & QR Codes"
    const category = searchParams.get("category") || "TECHNICAL GUIDE"
    const author = searchParams.get("author") || "Saket Kesar"
    const readTime = searchParams.get("readTime") || "6 min read"

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#060D0B",
            backgroundImage:
              "radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.18) 0%, transparent 50%), radial-gradient(circle at 15% 85%, rgba(14, 165, 233, 0.12) 0%, transparent 50%)",
            padding: "60px 70px",
            fontFamily: "sans-serif",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            boxSizing: "border-box",
          }}
        >
          {/* Top Row: Brand & Category Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* Logo + Brand Name */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  backgroundColor: "#10b981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#060D0B",
                  fontSize: "24px",
                  fontWeight: 900,
                  boxShadow: "0 0 24px rgba(16, 185, 129, 0.5)",
                }}
              >
                U
              </div>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  letterSpacing: "-0.5px",
                }}
              >
                UL0<span style={{ color: "#10b981" }}>.site</span>
              </span>
            </div>

            {/* Category Pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 20px",
                borderRadius: "999px",
                backgroundColor: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                color: "#10b981",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              {category}
            </div>
          </div>

          {/* Middle: Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "1050px",
            }}
          >
            <h1
              style={{
                fontSize: title.length > 55 ? "48px" : "58px",
                fontWeight: 900,
                color: "#FFFFFF",
                lineHeight: 1.15,
                letterSpacing: "-1px",
                margin: 0,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textShadow: "0 2px 20px rgba(0, 0, 0, 0.7)",
              }}
            >
              {title}
            </h1>
          </div>

          {/* Bottom Row: Metadata & Free Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "24px",
                color: "#94a3b8",
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              <span>By {author}</span>
              <span>•</span>
              <span>{readTime}</span>
              <span>•</span>
              <span style={{ color: "#10b981" }}>307 Fast Redirects</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#e2e8f0",
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              <span>Free Custom Domain Forever</span>
              <span style={{ color: "#10b981" }}>✓</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.error("[OG Generator Error]:", e)
    return new Response(`Failed to generate image: ${e.message}`, { status: 500 })
  }
}
