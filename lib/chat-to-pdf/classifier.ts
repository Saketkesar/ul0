import type { ChatMessage, DocType } from "./types.ts"

/**
 * Classifies conversation into:
 * - "code": 3 or more code blocks
 * - "notes": few user turns (<= 2) and many headings/lists (>= 2)
 * - "chat": default conversation style
 */
export function classifyContent(messages: ChatMessage[]): DocType {
  let userTurns = 0
  let codeBlockCount = 0
  let headingAndListCount = 0

  for (const msg of messages) {
    if (msg.role === "user") {
      userTurns++
    }

    const html = msg.html || ""
    const text = msg.text || ""

    // Count code blocks: <pre>, <code> or markdown ```
    const preMatches = html.match(/<pre\b[^>]*>/gi) || []
    const codeTagMatches = html.match(/<code\b[^>]*class=["'][^"']*language-[^"']*["']/gi) || []
    const mdCodeBlocks = text.match(/```[\s\S]*?```/g) || []

    const blocksInMsg = Math.max(preMatches.length, codeTagMatches.length, mdCodeBlocks.length)
    codeBlockCount += blocksInMsg

    // Count headings and lists
    const headingMatches = html.match(/<h[1-6]\b[^>]*>/gi) || []
    const listMatches = html.match(/<(ul|ol)\b[^>]*>/gi) || []
    const mdHeadings = text.match(/^#{1,6}\s+/gm) || []
    const mdLists = text.match(/^[-*+]\s+|^[0-9]+\.\s+/gm) || []

    headingAndListCount += Math.max(headingMatches.length, mdHeadings.length)
    headingAndListCount += Math.max(listMatches.length, Math.min(mdLists.length, 5))
  }

  // 1. Code classification: 3+ code blocks
  if (codeBlockCount >= 3) {
    return "code"
  }

  // 2. Notes classification: few user turns (<= 2) AND structured content (headings/lists >= 2)
  if (userTurns <= 2 && headingAndListCount >= 2) {
    return "notes"
  }

  // 3. Otherwise: standard conversational chat
  return "chat"
}
