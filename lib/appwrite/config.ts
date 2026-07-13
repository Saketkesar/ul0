// Central Appwrite identifiers shared by the server client, setup script, and
// migration script. Keep collection IDs here so there is a single source of truth.

export const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1"
export const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID || ""
export const APPWRITE_DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "ul0"

// The default platform host that pre-existing (non custom-domain) links belong to.
export const DEFAULT_HOST = "ul0.site"

export const COLLECTIONS = {
  links: "links",
  clicks: "clicks",
  accounts: "accounts",
  domains: "domains",
  subscriptions: "subscriptions",
  split_sessions: "split_sessions",
} as const

export type CollectionId = (typeof COLLECTIONS)[keyof typeof COLLECTIONS]
