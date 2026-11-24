import test from "node:test"
import assert from "node:assert/strict"
import { renderEmail } from "../lib/split/email-templates.ts"
import { renderSplitActionPage } from "../lib/split/page-renderer.ts"

test("renderEmail generates valid HTML for all 7 templates", () => {
  const templates = [
    "welcome",
    "split-created",
    "marked-paid",
    "invited",
    "nudge",
    "settled",
    "weekly-recap",
  ]

  for (const t of templates) {
    const { html, subject } = renderEmail(t, {
      friend_name: "Dev Saini",
      name: "Dev Saini",
      amount: "₹600",
      share_amount: "₹600",
      split_name: "Toit Dinner",
      total: "₹2,400",
      people_count: 4,
      paid_count: 2,
      paid_percent: 50,
      confirm_url: "https://ul0.site/split/toit/confirm-payment",
      not_received_url: "https://ul0.site/split/toit/not-received",
      split_url: "https://ul0.site/split/toit",
    })

    assert.ok(html.length > 500, `Template ${t} should produce substantial HTML`)
    assert.ok(subject.length > 0, `Template ${t} should produce a subject`)
    assert.ok(!html.includes("{{friend_name}}"), `Template ${t} should replace friend_name`)
  }
})

test("marked-paid template contains both confirm_url and not_received_url", () => {
  const { html } = renderEmail("marked-paid", {
    friend_name: "Priya",
    amount: "₹750",
    split_name: "Brunch",
    confirm_url: "https://ul0.site/split/brunch/confirm-payment?token=abc",
    not_received_url: "https://ul0.site/split/brunch/not-received?token=abc",
    split_url: "https://ul0.site/split/brunch",
  })

  assert.ok(html.includes("https://ul0.site/split/brunch/confirm-payment?token=abc"))
  assert.ok(html.includes("https://ul0.site/split/brunch/not-received?token=abc"))
})

test("renderSplitActionPage produces valid HTML with branding", () => {
  const html = renderSplitActionPage("confirm-payment", {
    slug: "toit-88",
    token: "sec123",
    friendName: "Aman",
    amount: 500,
  })

  assert.ok(html.includes("/ul0split-logo-dark.png"), "Header should use /ul0split-logo-dark.png")
  assert.ok(html.includes("ul0.site"), "Footer should contain ul0.site link")
  assert.ok(html.includes("/ul0.png"), "Footer should contain ul0.png logo")
  assert.ok(html.includes("/split/toit-88/not-received"), "Link should point to not-received page")
})
