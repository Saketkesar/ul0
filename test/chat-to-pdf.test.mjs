import test from "node:test"
import assert from "node:assert/strict"
import { validateShareUrl, parseFallbackText } from "../lib/chat-to-pdf/extractor.ts"
import { classifyContent } from "../lib/chat-to-pdf/classifier.ts"
import { checkRateLimit } from "../lib/chat-to-pdf/rate-limiter.ts"

test("validateShareUrl: SSRF and domain restrictions", () => {
  // Valid Claude share URL
  const claudeValid = validateShareUrl("https://claude.ai/share/12345-abcd")
  assert.equal(claudeValid.valid, true)
  assert.equal(claudeValid.normalizedUrl, "https://claude.ai/share/12345-abcd")

  // Valid ChatGPT share URL
  const gptValid = validateShareUrl("https://chatgpt.com/share/67123-abcd")
  assert.equal(gptValid.valid, true)
  assert.equal(gptValid.normalizedUrl, "https://chatgpt.com/share/67123-abcd")

  // Reject local IP / SSRF
  const localIp = validateShareUrl("http://127.0.0.1/share/test")
  assert.equal(localIp.valid, false)

  const internalIp = validateShareUrl("http://192.168.1.5/share/test")
  assert.equal(internalIp.valid, false)

  const localhost = validateShareUrl("http://localhost:3000/share/test")
  assert.equal(localhost.valid, false)

  // Reject other domains
  const otherDomain = validateShareUrl("https://evil.com/share/1234")
  assert.equal(otherDomain.valid, false)

  // Reject invalid paths
  const invalidPath = validateShareUrl("https://claude.ai/login")
  assert.equal(invalidPath.valid, false)
})

test("classifyContent: classification rules for notes, code, and chat", () => {
  // 1. Code classification (>= 3 code blocks)
  const codeMessages = [
    {
      role: "user",
      text: "Show me 3 implementations",
      html: "<p>Show me 3 implementations</p>",
    },
    {
      role: "assistant",
      text: "Here are 3 blocks:\n```js\nconst a = 1;\n```\n```python\nb = 2\n```\n```go\nvar c = 3\n```",
      html: `
        <pre><code class="language-javascript">const a = 1;</code></pre>
        <pre><code class="language-python">b = 2</code></pre>
        <pre><code class="language-go">var c = 3</code></pre>
      `,
    },
  ]
  assert.equal(classifyContent(codeMessages), "code")

  // 2. Notes classification (few user turns <= 2, headings/lists >= 2)
  const notesMessages = [
    {
      role: "user",
      text: "Summarize this paper",
      html: "<p>Summarize this paper</p>",
    },
    {
      role: "assistant",
      text: "Summary:\n\n## Key Findings\n- Finding 1\n- Finding 2\n\n## Recommendations\n1. Do this\n2. Do that",
      html: `
        <h2>Key Findings</h2>
        <ul><li>Finding 1</li><li>Finding 2</li></ul>
        <h2>Recommendations</h2>
        <ol><li>Do this</li><li>Do that</li></ol>
      `,
    },
  ]
  assert.equal(classifyContent(notesMessages), "notes")

  // 3. Conversational chat (multiple turns, back-and-forth)
  const chatMessages = [
    { role: "user", text: "Hi", html: "<p>Hi</p>" },
    { role: "assistant", text: "Hello! How can I help?", html: "<p>Hello! How can I help?</p>" },
    { role: "user", text: "Can you tell me a joke?", html: "<p>Can you tell me a joke?</p>" },
    { role: "assistant", text: "Why did the chicken cross the road?", html: "<p>Why did the chicken cross the road?</p>" },
    { role: "user", text: "Why?", html: "<p>Why?</p>" },
    { role: "assistant", text: "To get to the other side!", html: "<p>To get to the other side!</p>" },
  ]
  assert.equal(classifyContent(chatMessages), "chat")
})

test("parseFallbackText: parses markdown and dialogue", () => {
  const text = `User: What is TypeScript?

Assistant: TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.

## Features
- Static typing
- Interfaces`

  const parsed = parseFallbackText(text)
  assert.equal(parsed.length, 2)
  assert.equal(parsed[0].role, "user")
  assert.equal(parsed[1].role, "assistant")
  assert.match(parsed[1].html, /TypeScript is a typed superset/)
})

test("checkRateLimit: enforces 10 requests per minute per IP", () => {
  const testIp = "203.0.113.42"
  for (let i = 0; i < 10; i++) {
    const res = checkRateLimit(testIp)
    assert.equal(res.allowed, true)
  }
  const blockedRes = checkRateLimit(testIp)
  assert.equal(blockedRes.allowed, false)
  assert.equal(blockedRes.remaining, 0)
})
