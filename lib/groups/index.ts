import "server-only"
import crypto from "crypto"
import { query, mapRow } from "../db"
import { generateSlug } from "../utils/slug"
import {
  maskUpiId,
  createSplitSession,
  generateCollectorToken,
  hashCollectorToken,
} from "../appwrite/splits"

export interface Group {
  id: string
  owner_user_id: string
  name: string
  currency: string
  share_slug: string
  allow_member_entries: boolean
  icon_url?: string | null
  banner_url?: string | null
  created_at: string
  last_activity_at: string
  archived_at: string | null
  member_count?: number
  total_spent?: number
}

export interface GroupMember {
  id: string
  group_id: string
  name: string
  upi_id?: string | null
  claimed_by_user_id?: string | null
  created_at: string
}

export interface GroupExpense {
  id: string
  group_id: string
  paid_by_member_id: string
  amount: number
  note: string
  split_among: { member_id: string; amount: number }[]
  created_at: string
  created_via: "owner" | "member"
  payer_name?: string
}

export interface SettleUpPayment {
  fromMemberId: string
  fromName: string
  toMemberId: string
  toName: string
  toUpiId?: string | null
  toMaskedUpiId?: string
  amount: number
}

/**
 * Greedy minimum settlement algorithm:
 * Matches biggest debtors with biggest creditors to settle group debts
 * with the absolute minimum number of payments.
 */
export function calculateMinimumSettlements(
  members: GroupMember[],
  expenses: GroupExpense[]
): SettleUpPayment[] {
  const memberMap = new Map<string, GroupMember>()
  members.forEach((m) => memberMap.set(m.id, m))

  // Net balance = total paid - total share
  const balances = new Map<string, number>()
  members.forEach((m) => balances.set(m.id, 0))

  for (const exp of expenses) {
    const currentPaid = balances.get(exp.paid_by_member_id) || 0
    balances.set(exp.paid_by_member_id, currentPaid + Number(exp.amount))

    const splits = Array.isArray(exp.split_among) ? exp.split_among : []
    for (const split of splits) {
      const currentShare = balances.get(split.member_id) || 0
      balances.set(split.member_id, currentShare - Number(split.amount))
    }
  }

  // Debtors (owe money, net < 0) and Creditors (owed money, net > 0)
  const debtors: { memberId: string; amount: number }[] = []
  const creditors: { memberId: string; amount: number }[] = []

  for (const [memberId, balance] of balances.entries()) {
    const rounded = Math.round(balance * 100) / 100
    if (rounded < -0.01) {
      debtors.push({ memberId, amount: Math.abs(rounded) })
    } else if (rounded > 0.01) {
      creditors.push({ memberId, amount: rounded })
    }
  }

  // Sort descending by amount
  debtors.sort((a, b) => b.amount - a.amount)
  creditors.sort((a, b) => b.amount - a.amount)

  const payments: SettleUpPayment[] = []
  let dIdx = 0
  let cIdx = 0

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx]
    const creditor = creditors[cIdx]

    const settleAmt = Math.min(debtor.amount, creditor.amount)
    if (settleAmt > 0.009) {
      const fromMem = memberMap.get(debtor.memberId)
      const toMem = memberMap.get(creditor.memberId)

      payments.push({
        fromMemberId: debtor.memberId,
        fromName: fromMem?.name || "Member",
        toMemberId: creditor.memberId,
        toName: toMem?.name || "Member",
        toUpiId: toMem?.upi_id || null,
        toMaskedUpiId: maskUpiId(toMem?.upi_id),
        amount: Math.round(settleAmt * 100) / 100,
      })
    }

    debtor.amount = Math.round((debtor.amount - settleAmt) * 100) / 100
    creditor.amount = Math.round((creditor.amount - settleAmt) * 100) / 100

    if (debtor.amount <= 0.01) dIdx++
    if (creditor.amount <= 0.01) cIdx++
  }

  return payments
}

// ---------------------------------------------------------------------------
// Database Operations
// ---------------------------------------------------------------------------

export async function createGroup({
  ownerUserId,
  name,
  currency = "INR",
  allowMemberEntries = false,
  memberNames,
  ownerName,
  ownerUpi,
  iconUrl,
  bannerUrl,
}: {
  ownerUserId: string
  name: string
  currency?: string
  allowMemberEntries?: boolean
  memberNames: string[]
  ownerName?: string
  ownerUpi?: string
  iconUrl?: string
  bannerUrl?: string
}): Promise<Group> {
  const shareSlug = generateSlug()
  const groupId = crypto.randomUUID()

  // Insert group
  const groupRes = await query(
    `INSERT INTO public.groups (
      id, owner_user_id, name, currency, share_slug, allow_member_entries, icon_url, banner_url, created_at, last_activity_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
    RETURNING *`,
    [groupId, ownerUserId, name.trim(), currency, shareSlug, allowMemberEntries, iconUrl || null, bannerUrl || null]
  )
  const group = mapRow<Group>(groupRes.rows[0])

  // Insert owner as first member
  const ownerMemberId = crypto.randomUUID()
  await query(
    `INSERT INTO public.group_members (
      id, group_id, name, upi_id, claimed_by_user_id, created_at
    ) VALUES ($1, $2, $3, $4, $5, NOW())`,
    [ownerMemberId, groupId, (ownerName || "You").trim(), ownerUpi ? ownerUpi.trim().toLowerCase() : null, ownerUserId]
  )

  // Insert other members
  for (const rawName of memberNames) {
    const clean = rawName.trim()
    if (clean) {
      await query(
        `INSERT INTO public.group_members (
          id, group_id, name, created_at
        ) VALUES ($1, $2, $3, NOW())`,
        [crypto.randomUUID(), groupId, clean]
      )
    }
  }

  return group
}

export async function getUserGroups(ownerUserId: string): Promise<Group[]> {
  const res = await query(
    `SELECT g.*,
       COUNT(DISTINCT m.id)::int as member_count,
       COALESCE(SUM(e.amount), 0)::numeric as total_spent
     FROM public.groups g
     LEFT JOIN public.group_members m ON m.group_id = g.id
     LEFT JOIN public.group_expenses e ON e.group_id = g.id
     WHERE g.owner_user_id = $1 AND g.archived_at IS NULL
     GROUP BY g.id
     ORDER BY g.last_activity_at DESC`,
    [ownerUserId]
  )
  return res.rows.map((r) => mapRow<Group>(r))
}

export async function getGroupById(groupId: string, userId?: string): Promise<{
  group: Group
  members: GroupMember[]
  expenses: GroupExpense[]
  settlements: SettleUpPayment[]
} | null> {
  const gRes = await query("SELECT * FROM public.groups WHERE id = $1 LIMIT 1", [groupId])
  if (gRes.rows.length === 0) return null
  const group = mapRow<Group>(gRes.rows[0])

  const mRes = await query(
    "SELECT * FROM public.group_members WHERE group_id = $1 ORDER BY created_at ASC",
    [groupId]
  )
  const members = mRes.rows.map((r) => mapRow<GroupMember>(r))

  const eRes = await query(
    `SELECT e.*, m.name as payer_name
     FROM public.group_expenses e
     JOIN public.group_members m ON m.id = e.paid_by_member_id
     WHERE e.group_id = $1
     ORDER BY e.created_at DESC`,
    [groupId]
  )
  const expenses = eRes.rows.map((r) => mapRow<GroupExpense>(r))

  const settlements = calculateMinimumSettlements(members, expenses)

  return { group, members, expenses, settlements }
}

export async function getGroupByShareSlug(shareSlug: string): Promise<{
  group: Group
  members: (GroupMember & { masked_upi_id?: string })[]
  expenses: GroupExpense[]
  settlements: SettleUpPayment[]
} | null> {
  const gRes = await query("SELECT * FROM public.groups WHERE share_slug = $1 LIMIT 1", [shareSlug])
  if (gRes.rows.length === 0) return null
  const group = mapRow<Group>(gRes.rows[0])

  const fullData = await getGroupById(group.id)
  if (!fullData) return null

  const safeMembers = fullData.members.map((m) => ({
    ...m,
    masked_upi_id: maskUpiId(m.upi_id),
    upi_id: m.upi_id ? maskUpiId(m.upi_id) : null,
  }))

  return {
    ...fullData,
    members: safeMembers,
  }
}

export async function addGroupExpense({
  groupId,
  paidByMemberId,
  amount,
  note,
  splitAmong,
  createdVia = "owner",
}: {
  groupId: string
  paidByMemberId: string
  amount: number
  note: string
  splitAmong: { member_id: string; amount: number }[]
  createdVia?: "owner" | "member"
}): Promise<GroupExpense> {
  const expenseId = crypto.randomUUID()
  const res = await query(
    `INSERT INTO public.group_expenses (
      id, group_id, paid_by_member_id, amount, note, split_among, created_at, created_via
    ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)
    RETURNING *`,
    [expenseId, groupId, paidByMemberId, amount, note.trim(), JSON.stringify(splitAmong), createdVia]
  )

  await query("UPDATE public.groups SET last_activity_at = NOW() WHERE id = $1", [groupId])

  return mapRow<GroupExpense>(res.rows[0])
}

export async function deleteGroup(groupId: string, ownerUserId: string): Promise<boolean> {
  const res = await query(
    "DELETE FROM public.groups WHERE id = $1 AND owner_user_id = $2 RETURNING id",
    [groupId, ownerUserId]
  )
  return res.rows.length > 0
}

export async function claimGroupMember(
  groupId: string,
  memberId: string,
  userId: string
): Promise<boolean> {
  const res = await query(
    `UPDATE public.group_members
     SET claimed_by_user_id = $1
     WHERE id = $2 AND group_id = $3
     RETURNING id`,
    [userId, memberId, groupId]
  )
  return res.rows.length > 0
}

export async function generateSplitFromGroup(
  groupId: string,
  ownerUserId: string
): Promise<{ slug: string; collectorToken: string }> {
  const fullData = await getGroupById(groupId)
  if (!fullData) {
    throw new Error("Group not found")
  }
  if (fullData.group.owner_user_id !== ownerUserId) {
    throw new Error("Only group owner can generate split settlement")
  }

  const { group, members, expenses, settlements } = fullData

  const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(String(e.amount || 0)), 0)

  const mappedSettlements = settlements.map((s) => ({
    from: s.fromMemberId,
    to: s.toMemberId,
    amount: s.amount,
    status: "unpaid" as const,
  }))

  const collectorToken = generateCollectorToken()
  const collectorTokenHash = hashCollectorToken(collectorToken)
  const slug = generateSlug()

  const expiry = new Date()
  expiry.setDate(expiry.getDate() + 30)

  await createSplitSession({
    slug,
    title: group.name,
    members: members.map((m) => ({
      id: m.id,
      name: m.name,
      paymentMethod: "upi",
      paymentId: m.upi_id || "",
      upiId: m.upi_id || "",
    })),
    expenses: expenses.map((e) => ({
      id: e.id,
      title: e.note,
      amount: parseFloat(String(e.amount)),
      paidBy: e.paid_by_member_id,
      splitType: "custom",
      splits: e.split_among,
    })),
    settlements: mappedSettlements,
    total_amount: totalSpent,
    expires_at: expiry.toISOString(),
    owner_user_id: ownerUserId,
    kind: "group_khata",
    locale: "en",
    currency: group.currency || "INR",
    collector_token_hash: collectorTokenHash,
    group_id: groupId,
    banner_url: group.banner_url || undefined,
    icon_url: group.icon_url || undefined,
  })

  return { slug, collectorToken }
}
