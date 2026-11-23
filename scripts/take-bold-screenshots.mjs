import { chromium } from "playwright"
import path from "path"

const ARTIFACT_DIR = "/Users/saketkesar/.gemini/antigravity/brain/d3c1abe0-7076-44c0-8f54-6079da8fc644"

async function run() {
  const browser = await chromium.launch({ headless: true })
  
  // 1. Desktop 1440px: Bold Landing page full
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    await page.goto("https://ul0.site/split", { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(2000)
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "boldtheme-1440.png"), fullPage: true })
    console.log("Captured boldtheme-1440.png")
    
    // Also capture hero close-up
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "boldtheme-hero-1440.png") })
    console.log("Captured boldtheme-hero-1440.png")
    await page.close()
  }

  // 2. Mobile 390px: Bold Landing page full
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
    await page.goto("https://ul0.site/split", { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(2000)
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "boldtheme-390.png"), fullPage: true })
    console.log("Captured boldtheme-390.png")
    await page.close()
  }

  // 3. Desktop 1440px: Dashboard (PC UI with Sidebar)
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    await page.goto("https://ul0.site/split/dashboard", { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(2000)
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "dashboard-1440.png") })
    console.log("Captured dashboard-1440.png")
    await page.close()
  }

  // 4. Mobile 390px: Dashboard (Mobile UI with Floating Actions and Hisab Tab)
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
    await page.goto("https://ul0.site/split/dashboard", { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(2000)
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "dashboard-390.png") })
    console.log("Captured dashboard-390.png")
    await page.close()
  }

  await browser.close()
  console.log("Done taking all updated screenshots.")
}

run().catch((e) => {
  console.error("Screenshot error:", e)
  process.exit(1)
})
