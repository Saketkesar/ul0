export type DocType = "notes" | "code" | "chat"

export interface ChatMessage {
  role: "user" | "assistant"
  html: string
  text: string
}

export interface ConvertOptions {
  url?: string
  text?: string
}

export interface ConvertResult {
  pdfBuffer: Buffer
  docType: DocType
  title: string
  messageCount: number
}
