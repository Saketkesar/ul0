// Lazy loader for document auto-crop using OpenCV.js + jscanify.
// Everything loads at runtime from a CDN (client only) so it never affects the
// build or initial bundle size. All functions fail gracefully: if the CV engine
// can't load, callers fall back to using the full, uncropped image.

declare global {
  interface Window {
    cv?: any
    jscanify?: any
  }
}

const OPENCV_URL = "https://docs.opencv.org/4.10.0/opencv.js"
const JSCANIFY_URL = "https://cdn.jsdelivr.net/npm/jscanify@1.4.0/src/jscanify.min.js"

let loaderPromise: Promise<any | null> | null = null

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
    if (existing) {
      if (existing.dataset.loaded === "true") return resolve()
      existing.addEventListener("load", () => resolve())
      existing.addEventListener("error", () => reject(new Error(`Failed: ${src}`)))
      return
    }
    const script = document.createElement("script")
    script.src = src
    script.async = true
    script.addEventListener("load", () => {
      script.dataset.loaded = "true"
      resolve()
    })
    script.addEventListener("error", () => reject(new Error(`Failed: ${src}`)))
    document.head.appendChild(script)
  })
}

function waitForOpenCV(timeoutMs = 20000): Promise<any> {
  return new Promise((resolve, reject) => {
    const start = Date.now()
    const check = () => {
      const cv = window.cv
      if (cv && cv.Mat) return resolve(cv)
      if (cv && typeof cv.then === "function") {
        cv.then((real: any) => resolve(real)).catch(reject)
        return
      }
      if (Date.now() - start > timeoutMs) return reject(new Error("OpenCV load timeout"))
      setTimeout(check, 100)
    }
    check()
  })
}

// Returns a jscanify scanner instance, or null if the CV engine is unavailable.
export async function getScanner(): Promise<any | null> {
  if (loaderPromise) return loaderPromise
  loaderPromise = (async () => {
    try {
      await loadScript(OPENCV_URL)
      await waitForOpenCV()
      await loadScript(JSCANIFY_URL)
      if (!window.jscanify) return null
      return new window.jscanify()
    } catch (err) {
      console.warn("Scanner engine unavailable, falling back to full image:", err)
      return null
    }
  })()
  return loaderPromise
}

// Attempts to auto-detect the document in `source` and return a deskewed,
// cropped canvas. Falls back to a canvas of the full source on any failure.
export async function autoCropToCanvas(
  source: HTMLImageElement | HTMLCanvasElement,
): Promise<HTMLCanvasElement> {
  const srcW = source instanceof HTMLImageElement ? source.naturalWidth : source.width
  const srcH = source instanceof HTMLImageElement ? source.naturalHeight : source.height

  const fallback = () => {
    const c = document.createElement("canvas")
    c.width = srcW
    c.height = srcH
    c.getContext("2d")!.drawImage(source, 0, 0, srcW, srcH)
    return c
  }

  try {
    const scanner = await getScanner()
    if (!scanner) return fallback()
    // jscanify.extractPaper auto-finds the largest quadrilateral and warps it.
    const result: HTMLCanvasElement = scanner.extractPaper(source, srcW, srcH)
    if (result && result.width > 0 && result.height > 0) return result
    return fallback()
  } catch (err) {
    console.warn("Auto-crop failed, using full image:", err)
    return fallback()
  }
}

// Apply a scan-style filter to a canvas. mode: "color" | "gray" | "bw".
export function applyFilter(canvas: HTMLCanvasElement, mode: "color" | "gray" | "bw"): HTMLCanvasElement {
  if (mode === "color") return canvas
  const ctx = canvas.getContext("2d")!
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const d = img.data
  for (let i = 0; i < d.length; i += 4) {
    const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
    let v = lum
    if (mode === "bw") {
      // Boost contrast for a crisp black-and-white scan look.
      v = lum > 135 ? 255 : lum < 90 ? 0 : (lum - 90) * (255 / 45)
    }
    d[i] = d[i + 1] = d[i + 2] = v
  }
  ctx.putImageData(img, 0, 0)
  return canvas
}
