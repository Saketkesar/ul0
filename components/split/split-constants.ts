import { UL0IconName } from "@/components/ul0-icon"

export interface CategoryPreset {
  label: string
  title: string
  icon: UL0IconName
}

export const CATEGORY_PRESETS: CategoryPreset[] = [
  { label: "Food", title: "Dinner", icon: "billing" },
  { label: "Trip", title: "Trip", icon: "flag" },
  { label: "Rent", title: "Flat Rent", icon: "home" },
  { label: "Match fee", title: "Match fee", icon: "sparkles" },
  { label: "Groceries", title: "Groceries", icon: "cart" },
  { label: "Other", title: "Expense", icon: "splitbill" },
]

export const COMMON_UPI_PROVIDERS = [
  "@oksbi",
  "@okhdfcbank",
  "@okicici",
  "@okaxis",
  "@paytm",
  "@ybl",
  "@ibl",
] as const

export const EXPIRY_OPTIONS = [
  { label: "7 days", days: 7 },
  { label: "30 days (Default)", days: 30 },
  { label: "90 days (Trips)", days: 90 },
]

/** Largest-remainder method guarantees that shares sum to the exact paise */
export function distributeWithLargestRemainder(total: number, weights: number[]): number[] {
  const sumWeights = weights.reduce((a, b) => a + b, 0)
  if (sumWeights === 0) return weights.map(() => 0)

  const totalPaise = Math.round(total * 100)
  const exactPaise = weights.map(w => (w / sumWeights) * totalPaise)
  const floorPaise = exactPaise.map(p => Math.floor(p))
  const remainders = exactPaise.map((p, idx) => ({ remainder: p - floorPaise[idx], idx }))

  const allocatedSum = floorPaise.reduce((a, b) => a + b, 0)
  const diff = totalPaise - allocatedSum

  remainders.sort((a, b) => b.remainder - a.remainder)

  for (let i = 0; i < diff; i++) {
    floorPaise[remainders[i].idx] += 1
  }

  return floorPaise.map(p => p / 100)
}

export type ReminderTone = "polite" | "firm" | "funny"
export type ReminderLang = "en" | "hi" | "hinglish"

export function buildReminderMessage({
  friendName,
  title,
  amount,
  settleUrl,
  payByDate,
  tone,
  lang,
}: {
  friendName: string
  title: string
  amount: number
  settleUrl: string
  payByDate?: string | null
  tone: ReminderTone
  lang: ReminderLang
}): string {
  const formattedAmount = `₹${amount.toFixed(2)}`
  const formattedDate = payByDate
    ? ` by ${new Date(payByDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
    : ""

  if (lang === "hi") {
    if (tone === "polite") {
      return `नमस्ते ${friendName}! '${title}' के बिल में आपका हिस्सा ${formattedAmount} है${formattedDate}। कृपया यहाँ से UPI द्वारा भुगतान करें:\n${settleUrl}`
    } else if (tone === "firm") {
      return `${friendName}, '${title}' के बिल का बकाया ${formattedAmount} कृपया तुरंत चुकाएँ${formattedDate}। लिंक:\n${settleUrl}`
    } else {
      return `अरे ${friendName}! '${title}' का बिल भर दो, हिसाब साफ़ तो दोस्ती पक्की 😜 (${formattedAmount})\nयहाँ क्लिक करें: ${settleUrl}`
    }
  }

  if (lang === "hinglish") {
    if (tone === "polite") {
      return `Hey ${friendName}! '${title}' ka your share is ${formattedAmount}${formattedDate}. Please settle via UPI here:\n${settleUrl}`
    } else if (tone === "firm") {
      return `${friendName}, '${title}' ka ${formattedAmount} pending hai${formattedDate}. Please clear the payment now:\n${settleUrl}`
    } else {
      return `Oy ${friendName}! '${title}' ka bill bhar do warna dosti khatam 😜 Total: ${formattedAmount}\nTap here to pay: ${settleUrl}`
    }
  }

  // English
  if (tone === "polite") {
    return `Hey ${friendName}! Gentle reminder for '${title}' — your share is ${formattedAmount}${formattedDate}. You can pay directly via UPI here:\n${settleUrl}`
  } else if (tone === "firm") {
    return `Hi ${friendName}, payment of ${formattedAmount} for '${title}' is due${formattedDate}. Please settle it today:\n${settleUrl}`
  } else {
    return `Hey ${friendName}! Time to settle up for '${title}' (${formattedAmount}) before karma catches up 😜\nTap your name to pay: ${settleUrl}`
  }
}
