import test from "node:test"
import assert from "node:assert/strict"

// 1. SSRF Regex tests
import { isValidAppsScriptUrl, APPS_SCRIPT_URL_REGEX } from "../lib/forms/client.js"

test("SSRF regex only permits official Google Apps Script /exec URLs", () => {
  // Valid consumer deployment URL
  assert.equal(
    isValidAppsScriptUrl("https://script.google.com/macros/s/AKfycbx_1234567890abcdef-XYZ/exec"),
    true
  )
  // Valid Google Workspace deployment URL
  assert.equal(
    isValidAppsScriptUrl("https://script.google.com/a/macros/mycompany.com/s/AKfycbx_12345/exec"),
    true
  )

  // Invalid hosts / attacks
  assert.equal(isValidAppsScriptUrl("https://attacker.com/macros/s/123/exec"), false)
  assert.equal(isValidAppsScriptUrl("http://script.google.com/macros/s/123/exec"), false) // no plain http
  assert.equal(isValidAppsScriptUrl("https://script.google.com/evil/s/123/exec"), false)
  assert.equal(isValidAppsScriptUrl("https://script.google.com/macros/s/123/dev"), false) // must be /exec
  assert.equal(isValidAppsScriptUrl("https://script.google.com.attacker.com/macros/s/123/exec"), false)
  assert.equal(isValidAppsScriptUrl("https://127.0.0.1/macros/s/123/exec"), false)
  assert.equal(isValidAppsScriptUrl("https://localhost:3000/exec"), false)
})

// 2. Submission Zod Schema Validation
import { buildSubmissionSchema } from "../lib/forms/schema.js"

test("buildSubmissionSchema validates types, lengths, required rules, and honeypot", () => {
  const fields = [
    { id: "1", key: "full_name", type: "short_text", label: "Full Name", required: true },
    { id: "2", key: "email", type: "email", label: "Work Email", required: true },
    { id: "3", key: "age", type: "number", label: "Age", required: false, min: 18, max: 120 },
    { id: "4", key: "website", type: "url", label: "Website", required: false },
    { id: "5", key: "h1", type: "heading", label: "Heading Block", required: false }, // should be ignored
  ]

  const schema = buildSubmissionSchema(fields)

  // Valid submission
  const valid = schema.safeParse({
    full_name: "Alice Smith",
    email: "alice@example.com",
    age: "25",
    website: "https://example.com",
    _hp: "",
  })
  assert.equal(valid.success, true)
  assert.equal(valid.data.age, 25)

  // Invalid email
  const invalidEmail = schema.safeParse({
    full_name: "Alice",
    email: "not-an-email",
  })
  assert.equal(invalidEmail.success, false)

  // Missing required name
  const missingName = schema.safeParse({
    full_name: "",
    email: "alice@example.com",
  })
  assert.equal(missingName.success, false)

  // Bot honeypot caught
  const botSubmission = schema.safeParse({
    full_name: "SpamBot",
    email: "bot@spam.com",
    _hp: "I am a bot",
  })
  assert.equal(botSubmission.success, false)
})
