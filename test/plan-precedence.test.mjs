import test from "node:test"
import assert from "node:assert/strict"
import { createJiti } from "jiti"

const jiti = createJiti(process.cwd())
const { resolveActivePlan } = jiti("./lib/plan-rules.ts")

test("resolveActivePlan precedence rules", async (t) => {
  const dummyAuth = (hasResult = false) => ({
    has: () => hasResult,
  })

  await t.test("defaults to free_user when no plans or flags are present", () => {
    const res = resolveActivePlan(dummyAuth(false), null, null)
    assert.equal(res.slug, "free_user")
    assert.equal(res.limits.maxDomains, 1)
    assert.equal(res.limits.hasRegularAnalytics, false)
  })

  await t.test("respects DEV_PLAN_OVERRIDE in non-production", () => {
    const res = resolveActivePlan(dummyAuth(false), null, null, "pro_user", "development")
    assert.equal(res.slug, "pro_user")
    assert.equal(res.limits.maxDomains, 3)
  })

  await t.test("ignores DEV_PLAN_OVERRIDE in production", () => {
    const res = resolveActivePlan(dummyAuth(false), null, null, "pro_user", "production")
    assert.equal(res.slug, "free_user")
  })

  await t.test("resolves business_user from Clerk has()", () => {
    const auth = { has: ({ plan }) => plan === "business_user" }
    const res = resolveActivePlan(auth, null, null)
    assert.equal(res.slug, "business_user")
    assert.equal(res.limits.maxDomains, 10)
  })

  await t.test("resolves business_user from user.publicMetadata.plan", () => {
    const res = resolveActivePlan(dummyAuth(false), { publicMetadata: { plan: "business_user" } }, null)
    assert.equal(res.slug, "business_user")
  })

  await t.test("resolves business_user from accountDoc.plan", () => {
    const res = resolveActivePlan(dummyAuth(false), null, { plan: "business_user" })
    assert.equal(res.slug, "business_user")
  })

  await t.test("resolves pro_user from Clerk has()", () => {
    const auth = { has: ({ plan }) => plan === "pro_user" }
    const res = resolveActivePlan(auth, null, null)
    assert.equal(res.slug, "pro_user")
    assert.equal(res.limits.maxDomains, 3)
    assert.equal(res.limits.hasRegularAnalytics, true)
  })

  await t.test("resolves pro_user from user.publicMetadata.plan", () => {
    const res = resolveActivePlan(dummyAuth(false), { publicMetadata: { plan: "pro_user" } }, null)
    assert.equal(res.slug, "pro_user")
  })

  await t.test("resolves pro_user from accountDoc.plan or accountDoc.is_pro", () => {
    const res1 = resolveActivePlan(dummyAuth(false), null, { plan: "pro_user" })
    assert.equal(res1.slug, "pro_user")

    const res2 = resolveActivePlan(dummyAuth(false), null, { is_pro: true })
    assert.equal(res2.slug, "pro_user")
  })
})
