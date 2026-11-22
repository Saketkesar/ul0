/**
 * On-device client-side Receipt OCR Parser using Tesseract.js WASM.
 * The photo is NEVER uploaded to any server; all OCR runs in-browser.
 */

export interface ParsedReceiptItem {
  id: string
  name: string
  price: number
  qty: number
}

export interface ParsedReceiptResult {
  items: ParsedReceiptItem[]
  detectedTax?: number
  detectedServiceCharge?: number
  detectedTotal?: number
  rawText: string
}

/**
 * Parses raw OCR text into structured items, taxes, and total.
 * Handles Indian receipt formats (GST, CGST/SGST, Swiggy, Zomato, Blinkit, Zepto, restaurant paper bills).
 */
export function parseReceiptText(text: string): ParsedReceiptResult {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  const items: ParsedReceiptItem[] = []
  let detectedTax: number | undefined
  let detectedServiceCharge: number | undefined
  let detectedTotal: number | undefined

  // Regular expressions to identify prices and noise
  const priceRegex = /(?:rs\.?|inr|₹)?\s*([0-9]+(?:\.[0-9]{1,2})?)\s*$/i
  const taxKeywords = /(?:gst|cgst|sgst|vat|tax)/i
  const serviceKeywords = /(?:service\s*(?:charge|fee)|svc)/i
  const totalKeywords = /(?:grand\s*total|net\s*payable|total\s*due|final\s*amount|total\s*amount|total)/i
  const ignoreKeywords = /(?:order|invoice|table|bill\s*no|date|time|cashier|welcome|thank\s*you|subtotal)/i

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Check for Total line
    if (totalKeywords.test(line)) {
      const match = line.match(priceRegex)
      if (match) {
        const amt = parseFloat(match[1])
        if (!isNaN(amt) && amt > 0) {
          detectedTotal = amt
          continue
        }
      }
    }

    // Check for Tax line
    if (taxKeywords.test(line)) {
      const match = line.match(priceRegex)
      if (match) {
        const amt = parseFloat(match[1])
        if (!isNaN(amt)) {
          detectedTax = (detectedTax || 0) + amt
          continue
        }
      }
    }

    // Check for Service Charge line
    if (serviceKeywords.test(line)) {
      const match = line.match(priceRegex)
      if (match) {
        const amt = parseFloat(match[1])
        if (!isNaN(amt)) {
          detectedServiceCharge = (detectedServiceCharge || 0) + amt
          continue
        }
      }
    }

    // Skip metadata lines
    if (ignoreKeywords.test(line)) {
      continue
    }

    // Parse potential item line (e.g. "2 Butter Naan 160.00" or "Cappuccino 220")
    const priceMatch = line.match(priceRegex)
    if (priceMatch) {
      const price = parseFloat(priceMatch[1])
      if (isNaN(price) || price <= 0) continue

      // Extract item name and optional quantity
      let itemText = line.substring(0, priceMatch.index).trim()
      // Remove trailing dots, dashes or currency symbols
      itemText = itemText.replace(/[\.\-:\/₹]+$/, "").trim()

      if (itemText.length < 2) continue

      let qty = 1
      // Check if line starts with quantity like "2x" or "2 " or "Qty: 2"
      const qtyMatch = itemText.match(/^(?:qty\s*:?\s*)?([1-9][0-9]?)\s*(?:x|\*|\s)\s*(.*)/i)
      if (qtyMatch) {
        qty = parseInt(qtyMatch[1], 10) || 1
        itemText = qtyMatch[2].trim()
      }

      if (itemText.length >= 2) {
        items.push({
          id: `item-${Date.now()}-${items.length}`,
          name: itemText,
          price,
          qty,
        })
      }
    }
  }

  return {
    items,
    detectedTax,
    detectedServiceCharge,
    detectedTotal,
    rawText: text,
  }
}

/**
 * Lazy loads Tesseract.js and executes OCR on an image file.
 * Progress callback provides 0-100 percentage.
 */
export async function scanReceiptWithTesseract(
  imageFile: File | Blob,
  onProgress?: (progress: number) => void
): Promise<ParsedReceiptResult> {
  try {
    const Tesseract = await import("tesseract.js")
    const { data } = await Tesseract.recognize(imageFile, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text" && typeof m.progress === "number" && onProgress) {
          onProgress(Math.round(m.progress * 100))
        }
      },
    })

    return parseReceiptText(data.text || "")
  } catch (error) {
    console.warn("Tesseract OCR failed:", error)
    // Return empty result rather than throwing, as per specification
    return {
      items: [],
      rawText: "",
    }
  }
}
