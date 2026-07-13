import "server-only"
import { Client, Databases, Query, ID } from "node-appwrite"
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from "./config"

// Server-side Appwrite client using the secret API key. Never import this from
// client components — it is guarded by "server-only".
export function getAdminClient(): Client {
  const apiKey = process.env.APPWRITE_API_KEY
  if (!APPWRITE_PROJECT_ID || !apiKey) {
    throw new Error(
      "Appwrite is not configured. Set APPWRITE_PROJECT_ID and APPWRITE_API_KEY in your environment.",
    )
  }
  return new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID).setKey(apiKey)
}

export function getDatabases(): Databases {
  return new Databases(getAdminClient())
}

export function isAppwriteConfigured(): boolean {
  return Boolean(APPWRITE_PROJECT_ID && process.env.APPWRITE_API_KEY)
}

export { Query, ID }
