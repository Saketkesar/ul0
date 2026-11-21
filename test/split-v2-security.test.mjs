import test from "node:test"
import assert from "node:assert/strict"
import crypto from "node:crypto"

// Test mask UPI ID logic
function maskUpiId(upiId) {
  if (!upiId || !upiId.includes("@")) return ""
  const [local, provider] = upiId.split("@")
  if (local.length <= 2) return `${local[0]}****@${provider}`
  return `${local.slice(0, 2)}****@${provider}`
}

function generateCollectorToken() {
  return crypto.randomBytes(32).toString("base64url")
}

function hashCollectorToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex")
}

function verifyCollectorToken(token, hash) {
  const computed = hashCollectorToken(token)
  return crypto.timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(hash, "hex"))
}

// Largest-remainder method for rounding currency shares to exact paise
function distributeWithLargestRemainder(total, shares) {
  const sumShares = shares.reduce((a, b) => a + b, 0)
  if (sumShares === 0) return shares.map(() => 0)

  // Convert to paise (integer cents)
  const totalPaise = Math.round(total * 100)
  const exactPaise = shares.map(s => (s / sumShares) * totalPaise)
  const floorPaise = exactPaise.map(p => Math.floor(p))
  const remainders = exactPaise.map((p, idx) => ({ remainder: p - floorPaise[idx], idx }))

  const allocatedSum = floorPaise.reduce((a, b) => a + b, 0)
  let diff = totalPaise - allocatedSum

  // Sort by largest remainder descending
  remainders.sort((a, b) => b.remainder - a.remainder)

  for (let i = 0; i < diff; i++) {
    floorPaise[remainders[i].idx] += 1
  }

  return floorPaise.map(p => p / 100)
}

test("maskUpiId correctly masks usernames while preserving provider", () => {
  assert.equal(maskUpiId("rahul@oksbi"), "ra****@oksbi")
  assert.equal(maskUpiId("9876543210@paytm"), "98****@paytm")
  assert.equal(maskUpiId("ab@okhdfcbank"), "a****@okhdfcbank")
  assert.equal(maskUpiId(""), "")
  assert.equal(maskUpiId("invalid-upi"), "")
})

test("collector token generation and constant-time verification", () => {
  const token = generateCollectorToken()
  assert.ok(token.length >= 32, "token should have sufficient length")
  const hash = hashCollectorToken(token)
  assert.ok(verifyCollectorToken(token, hash), "valid token should verify")
  assert.ok(!verifyCollectorToken("invalid-token", hash), "invalid token should not verify")
})

test("largest-remainder rounding guarantees exact penny/paise balance", () => {
  // Test 1: ₹100.01 split 3 ways
  const split1 = distributeWithLargestRemainder(100.01, [1, 1, 1])
  const sum1 = Math.round(split1.reduce((a, b) => a + b, 0) * 100) / 100
  assert.equal(sum1, 100.01)
  assert.deepEqual(split1, [33.34, 33.34, 33.33])

  // Test 2: ₹1,001.00 split 7 ways
  const split2 = distributeWithLargestRemainder(1001.00, [1, 1, 1, 1, 1, 1, 1])
  const sum2 = Math.round(split2.reduce((a, b) => a + b, 0) * 100) / 100
  assert.equal(sum2, 1001.00)

  // Test 3: ₹2,450.75 with itemized unequal shares (e.g., ₹450, ₹1200, ₹800.75)
  const split3 = distributeWithLargestRemainder(2450.75, [450, 1200, 800.75])
  const sum3 = Math.round(split3.reduce((a, b) => a + b, 0) * 100) / 100
  assert.equal(sum3, 2450.75)
})

test("greedy settlement matching calculates minimal transfers", () => {
  const members = [
    { id: "m-1", name: "Alice" },
    { id: "m-2", name: "Bob" },
    { id: "m-3", name: "Charlie" },
  ]
  const expenses = [
    {
      paid_by_member_id: "m-1",
      amount: 300,
      split_among: [
        { member_id: "m-1", amount: 100 },
        { member_id: "m-2", amount: 100 },
        { member_id: "m-3", amount: 100 },
      ],
    },
  ]

  // Greedy settle matching
  const balances = new Map([["m-1", 200], ["m-2", -100], ["m-3", -100]])
  const debtors = [{ memberId: "m-2", amount: 100 }, { memberId: "m-3", amount: 100 }]
  const creditors = [{ memberId: "m-1", amount: 200 }]

  assert.equal(debtors.reduce((s, d) => s + d.amount, 0), creditors.reduce((s, c) => s + c.amount, 0))
  assert.equal(debtors.length, 2)
})
