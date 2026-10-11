#!/usr/bin/env node
/**
 * WCAG 2.2 AA Contrast Checker for design tokens.
 * Verifies that text/surface token pairs meet >= 4.5:1 contrast in both light and dark modes.
 */

function hexToRgb(hex) {
  let clean = hex.replace("#", "").trim()
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("")
  }
  const num = parseInt(clean, 16)
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  }
}

function relativeLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hexToRgb(hex1))
  const l2 = relativeLuminance(hexToRgb(hex2))
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

const lightPairs = [
  { name: "Light Background vs Foreground", bg: "#FFFFFF", fg: "#0B1412", min: 4.5 },
  { name: "Light Primary Button Text", bg: "#168270", fg: "#FFFFFF", min: 4.5 },
  { name: "Light Card vs Muted Text", bg: "#FFFFFF", fg: "#5B6B67", min: 4.5 },
  { name: "Light Destructive Button Text", bg: "#D92D20", fg: "#FFFFFF", min: 4.5 },
  { name: "Light UI Border against White", bg: "#FFFFFF", fg: "#168270", min: 3.0 },
]

const darkPairs = [
  { name: "Dark Background vs Foreground", bg: "#08100E", fg: "#ECF5F2", min: 4.5 },
  { name: "Dark Primary Button Text", bg: "#1FA087", fg: "#08100E", min: 4.5 },
  { name: "Dark Card vs Muted Text", bg: "#0D1815", fg: "#8DA39D", min: 4.5 },
  { name: "Dark Destructive Button Text", bg: "#D92D20", fg: "#FFFFFF", min: 4.5 },
  { name: "Dark UI Border against Surface", bg: "#08100E", fg: "#1FA087", min: 3.0 },
]

console.log("==========================================")
console.log("  UL0 WCAG 2.2 AA Contrast Verification  ")
console.log("==========================================")

let failed = false

console.log("\n[Light Mode Token Checks]")
for (const p of lightPairs) {
  const ratio = contrastRatio(p.bg, p.fg)
  const passed = ratio >= p.min
  console.log(`  ${passed ? "✓ PASS" : "✗ FAIL"}: ${p.name} - ${ratio.toFixed(2)}:1 (required >= ${p.min}:1)`)
  if (!passed) failed = true
}

console.log("\n[Dark Mode Token Checks]")
for (const p of darkPairs) {
  const ratio = contrastRatio(p.bg, p.fg)
  const passed = ratio >= p.min
  console.log(`  ${passed ? "✓ PASS" : "✗ FAIL"}: ${p.name} - ${ratio.toFixed(2)}:1 (required >= ${p.min}:1)`)
  if (!passed) failed = true
}

if (failed) {
  console.error("\n[Error] Token contrast test failed!")
  process.exit(1)
} else {
  console.log("\n✓ All core design token pairs pass WCAG 2.2 AA contrast standards.\n")
}
