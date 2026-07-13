import "server-only"

/**
 * Vercel Domains API wrapper.
 *
 * Uses the Vercel REST API to add/remove/verify custom domains on the
 * Vercel project. Requires:
 *   - VERCEL_AUTH_TOKEN — a Vercel personal access token or team token
 *   - VERCEL_PROJECT_ID — the project ID (or name) to attach domains to
 *   - VERCEL_TEAM_ID (optional) — if using a team scope
 *
 * API docs: https://vercel.com/docs/rest-api/endpoints/projects/domains
 */

const VERCEL_API = "https://api.vercel.com"

function getHeaders(): HeadersInit {
  const token = process.env.VERCEL_AUTH_TOKEN
  if (!token) throw new Error("VERCEL_AUTH_TOKEN is not set")
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
}

function getProjectId(): string {
  const id = process.env.VERCEL_PROJECT_ID
  if (!id) throw new Error("VERCEL_PROJECT_ID is not set")
  return id
}

function teamQuery(): string {
  const teamId = process.env.VERCEL_TEAM_ID
  return teamId ? `?teamId=${teamId}` : ""
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VercelDomainResponse {
  name: string
  apexName: string
  verified: boolean
  /** Verification entries needed. */
  verification?: Array<{
    type: string
    domain: string
    value: string
    reason: string
  }>
  error?: { code: string; message: string }
}

export interface VercelDomainConfig {
  configuredBy: string | null
  acceptedChallenges: string[]
  misconfigured: boolean
}

// ---------------------------------------------------------------------------
// API Functions
// ---------------------------------------------------------------------------

/**
 * Add a domain to the Vercel project.
 * Returns the domain object with verification details.
 */
export async function addDomainToVercel(
  domain: string,
): Promise<VercelDomainResponse> {
  const projectId = getProjectId()
  const res = await fetch(
    `${VERCEL_API}/v10/projects/${projectId}/domains${teamQuery()}`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ name: domain }),
    },
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(
      data?.error?.message ?? `Vercel API error: ${res.status}`,
    )
  }

  return data as VercelDomainResponse
}

/**
 * Remove a domain from the Vercel project.
 */
export async function removeDomainFromVercel(domain: string): Promise<void> {
  const projectId = getProjectId()
  const res = await fetch(
    `${VERCEL_API}/v9/projects/${projectId}/domains/${domain}${teamQuery()}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    },
  )

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(
      (data as Record<string, any>)?.error?.message ??
        `Vercel API error: ${res.status}`,
    )
  }
}

/**
 * Get domain configuration (verification + SSL status).
 */
export async function getDomainConfig(
  domain: string,
): Promise<VercelDomainConfig> {
  const res = await fetch(
    `${VERCEL_API}/v6/domains/${domain}/config${teamQuery()}`,
    {
      method: "GET",
      headers: getHeaders(),
    },
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(
      (data as Record<string, any>)?.error?.message ??
        `Vercel API error: ${res.status}`,
    )
  }

  return data as VercelDomainConfig
}

/**
 * Get full domain info from the project (includes verification array).
 */
export async function getDomainFromVercel(
  domain: string,
): Promise<VercelDomainResponse> {
  const projectId = getProjectId()
  const res = await fetch(
    `${VERCEL_API}/v9/projects/${projectId}/domains/${domain}${teamQuery()}`,
    {
      method: "GET",
      headers: getHeaders(),
    },
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(
      (data as Record<string, any>)?.error?.message ??
        `Vercel API error: ${res.status}`,
    )
  }

  return data as VercelDomainResponse
}

/**
 * Check whether a domain is verified and correctly configured.
 * Combines project domain info + domain config check.
 */
export async function checkDomainStatus(domain: string): Promise<{
  verified: boolean
  sslReady: boolean
  misconfigured: boolean
  verification: VercelDomainResponse["verification"]
}> {
  const [domainInfo, config] = await Promise.all([
    getDomainFromVercel(domain),
    getDomainConfig(domain).catch(() => null),
  ])

  return {
    verified: domainInfo.verified,
    sslReady: config ? !config.misconfigured : false,
    misconfigured: config?.misconfigured ?? true,
    verification: domainInfo.verification,
  }
}
