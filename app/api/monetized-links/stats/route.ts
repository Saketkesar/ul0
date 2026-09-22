import { NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"

const ALLOWED_EMAIL = "kesarsaket607@gmail.com"
const ADSTERRA_API_KEY = process.env.ADSTERRA_API_KEY || "56188156bd4e849a3a8eabc78793a431"

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0]
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    const user = await currentUser()
    const email = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase()

    if (!userId || email !== ALLOWED_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 403 }
      )
    }

    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    const finishDate = formatDate(today)
    const startDate = formatDate(thirtyDaysAgo)

    // Fetch daily stats
    const dailyUrl = `https://api3.adsterratools.com/publisher/stats.json?start_date=${startDate}&finish_date=${finishDate}`
    const countryUrl = `https://api3.adsterratools.com/publisher/stats.json?start_date=${startDate}&finish_date=${finishDate}&group_by=country`

    const [dailyRes, countryRes] = await Promise.all([
      fetch(dailyUrl, {
        headers: { "X-API-Key": ADSTERRA_API_KEY },
        next: { revalidate: 300 },
      }),
      fetch(countryUrl, {
        headers: { "X-API-Key": ADSTERRA_API_KEY },
        next: { revalidate: 300 },
      }),
    ])

    const dailyData = dailyRes.ok ? await dailyRes.json() : { items: [] }
    const countryData = countryRes.ok ? await countryRes.json() : { items: [] }

    const dailyItems: any[] = dailyData.items || []
    const countryItems: any[] = countryData.items || []

    // Calculate totals
    let totalRevenue = 0
    let totalImpressions = 0
    let totalClicks = 0

    for (const item of dailyItems) {
      totalRevenue += parseFloat(item.revenue || 0)
      totalImpressions += parseInt(item.impression || 0, 10)
      totalClicks += parseInt(item.clicks || 0, 10)
    }

    const avgCpm = totalImpressions > 0 ? (totalRevenue / totalImpressions) * 1000 : 0
    const overallCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0

    // Today's revenue
    const todayItem = dailyItems.find((i) => i.date === finishDate)
    const todayRevenue = todayItem ? parseFloat(todayItem.revenue || 0) : 0
    const todayImpressions = todayItem ? parseInt(todayItem.impression || 0, 10) : 0

    return NextResponse.json({
      success: true,
      summary: {
        totalRevenue: Math.round(totalRevenue * 1000) / 1000,
        totalImpressions,
        totalClicks,
        avgCpm: Math.round(avgCpm * 1000) / 1000,
        overallCtr: Math.round(overallCtr * 100) / 100,
        todayRevenue,
        todayImpressions,
      },
      daily: dailyItems.slice(-14).reverse(), // Last 14 days
      countries: countryItems.slice(0, 10), // Top 10 countries
      lastUpdated: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Adsterra stats fetch error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch Adsterra stats." },
      { status: 500 }
    )
  }
}
