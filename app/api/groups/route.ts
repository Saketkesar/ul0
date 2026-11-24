import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createGroup, getUserGroups } from "@/lib/groups"
import { logEventToSheet } from "@/lib/split/sheet-logger"

const MAX_ACTIVE_GROUPS_PER_USER = 10

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const groups = await getUserGroups(userId)
    return NextResponse.json({ groups })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load groups" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existing = await getUserGroups(userId)
    if (existing.length >= MAX_ACTIVE_GROUPS_PER_USER) {
      return NextResponse.json(
        { error: `You have reached the limit of ${MAX_ACTIVE_GROUPS_PER_USER} active groups.` },
        { status: 400 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const { name, currency, allowMemberEntries, memberNames, ownerName, ownerUpi, iconUrl, bannerUrl } = body

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Group name is required" }, { status: 400 })
    }

    if (!Array.isArray(memberNames) || memberNames.length === 0) {
      return NextResponse.json({ error: "Add at least one member to the group" }, { status: 400 })
    }

    const group = await createGroup({
      ownerUserId: userId,
      name: name.trim(),
      currency: typeof currency === "string" ? currency.trim() : "INR",
      allowMemberEntries: Boolean(allowMemberEntries),
      memberNames: memberNames.filter((n: any) => typeof n === "string" && n.trim().length > 0),
      ownerName: typeof ownerName === "string" ? ownerName.trim() : "You",
      ownerUpi: typeof ownerUpi === "string" ? ownerUpi.trim() : undefined,
      iconUrl: typeof iconUrl === "string" ? iconUrl : undefined,
      bannerUrl: typeof bannerUrl === "string" ? bannerUrl : undefined,
    })

    const groupId = (group as any)?.$id || (group as any)?.id || ""
    logEventToSheet({
      event_type: "group_created",
      split_slug: groupId,
      title: name.trim(),
      organizer_name: typeof ownerName === "string" ? ownerName.trim() : "You",
      organizer_upi: typeof ownerUpi === "string" ? ownerUpi.trim() : "",
      status: "Active Group",
      notes: `Group created with ${memberNames.length} members`,
      split_url: `https://ul0.site/split/groups/${groupId}`,
    }).catch((e) => console.warn("Group create sheet log error:", e))

    return NextResponse.json({ success: true, group })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create group" }, { status: 500 })
  }
}
