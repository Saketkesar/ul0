import test from "node:test"
import assert from "node:assert/strict"
import { parseReceiptText } from "../lib/split/receipt-ocr.ts"

test("Receipt OCR parser extracts item names, quantities, and prices", () => {
  const sampleReceipt = `
    CAFE COFFEE DAY
    Table 4 - Cashier: Alex
    -----------------------
    2x Cold Coffee 360.00
    1 Veggie Burger 180.00
    Garlic Bread 120.00
    -----------------------
    GST 5% 33.00
    Grand Total 693.00
    Thank you for visiting!
  `

  const result = parseReceiptText(sampleReceipt)

  assert.equal(result.items.length, 3)
  assert.equal(result.items[0].name, "Cold Coffee")
  assert.equal(result.items[0].qty, 2)
  assert.equal(result.items[0].price, 360)

  assert.equal(result.items[1].name, "Veggie Burger")
  assert.equal(result.items[1].qty, 1)
  assert.equal(result.items[1].price, 180)

  assert.equal(result.items[2].name, "Garlic Bread")
  assert.equal(result.items[2].qty, 1)
  assert.equal(result.items[2].price, 120)

  assert.equal(result.detectedTax, 33)
  assert.equal(result.detectedTotal, 693)
})

test("Receipt OCR parser handles empty or corrupt text gracefully", () => {
  const result = parseReceiptText("Random blurry garbage with no numbers")
  assert.deepEqual(result.items, [])
  assert.equal(result.detectedTotal, undefined)
})
