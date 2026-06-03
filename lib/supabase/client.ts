import { createClient as createSupabaseClient } from "@supabase/supabase-js"

let client: ReturnType<typeof createSupabaseClient> | null = null

// This prevents the SecurityError in restricted contexts like iframes
if (typeof window !== "undefined" && typeof navigator !== "undefined") {
  if (!navigator.locks) {
    // @ts-expect-error - Polyfilling navigator.locks
    navigator.locks = {
      request: async (_name: string, callback: () => Promise<unknown>) => {
        return await callback()
      },
    }
  } else {
    // Override existing locks.request to avoid SecurityError in restricted contexts
    const originalRequest = navigator.locks.request.bind(navigator.locks)
    // @ts-expect-error - Overriding navigator.locks.request
    navigator.locks.request = async (
      name: string,
      optionsOrCallback: LockOptions | (() => Promise<unknown>),
      maybeCallback?: () => Promise<unknown>,
    ) => {
      const callback = typeof optionsOrCallback === "function" ? optionsOrCallback : maybeCallback!
      try {
        return await originalRequest(name, optionsOrCallback as LockOptions, maybeCallback as () => Promise<unknown>)
      } catch {
        // If LockManager fails (SecurityError), just run the callback directly
        return await callback()
      }
    }
  }
}

export function createClient() {
  if (client) return client

  client = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      flowType: "pkce",
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })

  return client
}
