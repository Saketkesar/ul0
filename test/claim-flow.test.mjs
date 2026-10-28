import { test } from "node:test"
import assert from "node:assert/strict"
import crypto from "crypto"

const CLAIM_SECRET = process.env.CLAIM_SECRET || "ul0_claim_signing_secret_key"

function createClaimToken(linkId, slug) {
  const payload = {
    linkId,
    slug,
    createdAt: Date.now(),
  }
  const serialized = Buffer.from(JSON.stringify(payload)).toString("base64url")
  const signature = crypto
    .createHmac("sha256", CLAIM_SECRET)
    .update(serialized)
    .digest("base64url")

  return `${serialized}.${signature}`
}

function verifyClaimToken(token) {
  try {
    const parts = token.split(".")
    if (parts.length !== 2) return null
    const [serialized, signature] = parts

    const expectedSignature = crypto
      .createHmac("sha256", CLAIM_SECRET)
      .update(serialized)
      .digest("base64url")

    const sigBuf = Buffer.from(signature)
    const expectedBuf = Buffer.from(expectedSignature)
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return null
    }

    const payload = JSON.parse(
      Buffer.from(serialized, "base64url").toString("utf-8")
    )

    const maxAgeMs = 7 * 24 * 60 * 60 * 1000
    if (Date.now() - payload.createdAt > maxAgeMs) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

test("Claim Token Flow", async (t) => {
  await t.test("creates a valid signed claim token and decodes it", () => {
    const token = createClaimToken("link_123", "summer-promo")
    assert.ok(typeof token === "string")
    assert.ok(token.includes("."))

    const verified = verifyClaimToken(token)
    assert.ok(verified !== null)
    assert.equal(verified.linkId, "link_123")
    assert.equal(verified.slug, "summer-promo")
  })

  await t.test("rejects tampered claim tokens", () => {
    const token = createClaimToken("link_123", "summer-promo")
    const parts = token.split(".")
    // Alter the payload part
    const tamperedPayload = Buffer.from(JSON.stringify({ linkId: "hacked", slug: "hacked", createdAt: Date.now() })).toString("base64url")
    const tampered = `${tamperedPayload}.${parts[1]}`
    const verified = verifyClaimToken(tampered)
    assert.equal(verified, null)
  })

  await t.test("rejects expired tokens", () => {
    const expiredPayload = {
      linkId: "link_old",
      slug: "old-slug",
      createdAt: Date.now() - (8 * 24 * 60 * 60 * 1000), // 8 days ago
    }
    const serialized = Buffer.from(JSON.stringify(expiredPayload)).toString("base64url")
    const signature = crypto
      .createHmac("sha256", CLAIM_SECRET)
      .update(serialized)
      .digest("base64url")
    const expiredToken = `${serialized}.${signature}`

    const verified = verifyClaimToken(expiredToken)
    assert.equal(verified, null)
  })
})
