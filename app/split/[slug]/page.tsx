import { notFound } from "next/navigation"
import { SplitViewClient } from "./split-view-client"
import { getSplitSessionBySlug } from "@/lib/appwrite/splits"

interface Props {
  params: Promise<{ slug: string }>
}

// Validate and sanitize slug to prevent injection
function sanitizeSlug(slug: string): string | null {
  // Only allow alphanumeric, dash, and underscore
  const sanitized = slug.replace(/[^a-zA-Z0-9-_]/g, '')
  
  // Must be between 1-50 characters
  if (sanitized.length < 1 || sanitized.length > 50) {
    return null
  }
  
  // No path traversal attempts
  if (sanitized.includes('..') || sanitized !== slug) {
    return null
  }
  
  return sanitized
}

export default async function SplitViewPage({ params }: Props) {
  const { slug } = await params
  
  // Sanitize slug input
  const sanitizedSlug = sanitizeSlug(slug)
  if (!sanitizedSlug) {
    notFound()
  }
  
  // Fetch the split session from Appwrite
  const session = await getSplitSessionBySlug(sanitizedSlug)

  if (!session) {
    notFound()
  }

  // Check if session is expired
  if (session.expires_at && new Date(session.expires_at) < new Date()) {
    notFound()
  }

  return (
    <SplitViewClient
      session={session}
      slug={sanitizedSlug}
    />
  )
}

