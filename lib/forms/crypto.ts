import crypto from "node:crypto"

/**
 * Derives a 32-byte Buffer from the FORMS_ENC_KEY or fallback secret.
 */
function getEncryptionKey(): Buffer {
  const envKey = process.env.FORMS_ENC_KEY || process.env.CLERK_SECRET_KEY || "ul0_default_secure_forms_key_32b!"
  // Normalize to 32 bytes using sha256
  return crypto.createHash("sha256").update(envKey).digest()
}

/**
 * Generates a cryptographically strong 32-byte random secret in base64url format.
 */
export function generateScriptSecret(): string {
  return crypto.randomBytes(32).toString("base64url")
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Output format: iv:authTag:ciphertext (hex encoded)
 */
export function encryptSecret(plainText: string): string {
  if (!plainText) return ""
  const key = getEncryptionKey()
  const iv = crypto.randomBytes(12) // 96-bit IV recommended for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)
  
  let encrypted = cipher.update(plainText, "utf8", "hex")
  encrypted += cipher.final("hex")
  const tag = cipher.getAuthTag().toString("hex")

  return `${iv.toString("hex")}:${tag}:${encrypted}`
}

/**
 * Decrypts an AES-256-GCM encrypted string.
 * Expects format: iv:authTag:ciphertext (hex encoded)
 */
export function decryptSecret(encryptedPayload: string): string {
  if (!encryptedPayload) return ""
  const parts = encryptedPayload.split(":")
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted secret format")
  }

  const [ivHex, tagHex, cipherHex] = parts
  const key = getEncryptionKey()
  const iv = Buffer.from(ivHex, "hex")
  const tag = Buffer.from(tagHex, "hex")
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)

  decipher.setAuthTag(tag)
  let decrypted = decipher.update(cipherHex, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}
