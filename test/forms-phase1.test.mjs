import test from "node:test"
import assert from "node:assert/strict"

// 1. Test Slug rules
import { validateFormSlug, RESERVED_FORM_SLUGS } from "../lib/forms/slug.js"

test("validateFormSlug rejects empty, too short, too long, and invalid chars", () => {
  assert.equal(validateFormSlug("").valid, false)
  assert.equal(validateFormSlug("ab").valid, false) // min 3
  assert.equal(validateFormSlug("a".repeat(41)).valid, false) // max 40
  assert.equal(validateFormSlug("-start").valid, false)
  assert.equal(validateFormSlug("end-").valid, false)
  assert.equal(validateFormSlug("double--hyphen").valid, false)
  assert.equal(validateFormSlug("invalid_char").valid, false)
  assert.equal(validateFormSlug("hello world").valid, false)
})

test("validateFormSlug rejects reserved words", () => {
  for (const reserved of ["api", "admin", "login", "new", "settings"]) {
    const res = validateFormSlug(reserved)
    assert.equal(res.valid, false)
    assert.match(res.error, /reserved/)
  }
})

test("validateFormSlug accepts clean slugs", () => {
  assert.equal(validateFormSlug("customer-feedback").valid, true)
  assert.equal(validateFormSlug("rsvp-2026").valid, true)
  assert.equal(validateFormSlug("vip-waitlist").sanitized, "vip-waitlist")
})

// 2. Test Encryption round-trip
import { encryptSecret, decryptSecret, generateScriptSecret } from "../lib/forms/crypto.js"

test("encryptSecret and decryptSecret round-trip preserves secret", () => {
  const secret = generateScriptSecret()
  assert.ok(secret.length >= 32)
  const encrypted = encryptSecret(secret)
  assert.notEqual(encrypted, secret)
  assert.ok(encrypted.includes(":"))
  const decrypted = decryptSecret(encrypted)
  assert.equal(decrypted, secret)
})

// 3. Test Phishing detection
import { hasPhishingKeywords } from "../lib/forms/schema.js"

test("hasPhishingKeywords flags sensitive fields", () => {
  assert.equal(hasPhishingKeywords("Enter your password"), true)
  assert.equal(hasPhishingKeywords("Credit Card Number"), true)
  assert.equal(hasPhishingKeywords("CVV Code"), true)
  assert.equal(hasPhishingKeywords("Aadhaar Number"), true)
  assert.equal(hasPhishingKeywords("SSN"), true)
  assert.equal(hasPhishingKeywords("Your favorite color"), false)
  assert.equal(hasPhishingKeywords("Email Address"), false)
})
