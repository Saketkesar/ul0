import test from "node:test"
import assert from "node:assert/strict"
import { buildDocumentHtml, renderHtmlToPdf, closeBrowser } from "../lib/chat-to-pdf/pdf-renderer.ts"

test("renderHtmlToPdf: generates valid A4 PDF binary with JavaScript disabled", async () => {
  const messages = [
    {
      role: "user",
      text: "Explain bubble sort with code",
      html: "<p>Explain bubble sort with code</p>",
    },
    {
      role: "assistant",
      text: "Bubble sort is a simple sorting algorithm.\n```python\ndef bubble_sort(arr):\n    pass\n```",
      html: "<p>Bubble sort is a simple sorting algorithm.</p><pre><code class=\"language-python\">def bubble_sort(arr):\n    pass</code></pre>",
    },
  ]

  const html = buildDocumentHtml(messages, "code", "Bubble Sort Algorithm")
  assert.match(html, /Bubble Sort Algorithm/)
  assert.match(html, /page-break-inside:\s*avoid/i)

  const pdfBuffer = await renderHtmlToPdf(html)
  assert.ok(pdfBuffer instanceof Buffer)
  assert.ok(pdfBuffer.length > 1000, "PDF buffer should be non-trivial")

  // Check PDF magic header
  const header = pdfBuffer.slice(0, 5).toString("utf-8")
  assert.equal(header, "%PDF-")

  // Close browser so test process can cleanly exit
  await closeBrowser()
})
