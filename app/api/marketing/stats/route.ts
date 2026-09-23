import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { isMarketingAdmin } from "@/lib/marketing-auth"

const ADSTERRA_API_KEY = process.env.ADSTERRA_API_KEY || ""

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0]
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    const authorized = await isMarketingAdmin(userId)
    if (!authorized) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 })
    }

    if (!ADSTERRA_API_KEY) {
      return NextResponse.json({
        success: true,
        summary: {
          totalRevenue: 0,
          totalImpressions: 0,
          totalClicks: 0,
          avgCpm: 0,
          overallCtr: 0,
          todayRevenue: 0,
          todayImpressions: 0,
        },
        daily: [],
        countries: [],
        lastUpdated: new Date().toISOString(),
        note: "ADSTERRA_API_KEY not configured.",
      })
    }

    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    const finishDate = formatDate(today)
    const startDate = formatDate(thirtyDaysAgo)

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

    const todayItem = dailyItems.find((i: any) => i.date === finishDate)
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
      daily: dailyItems.slice(-14).reverse(),
      countries: countryItems.slice(0, 10),
      lastUpdated: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Adsterra stats fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats." },
      { status: 500 }
    )
  }
}
