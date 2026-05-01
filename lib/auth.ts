// Auth helpers. Two layers:
//  1. Supabase (if NEXT_PUBLIC_SUPABASE_URL is set) — full email magic-link auth.
//  2. Demo-user cookie — instant sign-in for live demos when Supabase isn't
//     configured (or when the user clicks "Continue as demo user").
//
// The middleware and server actions check both layers, so the app works
// out-of-the-box without any environment variables.

import { cookies } from "next/headers"

export const DEMO_USER_COOKIE = "course-designer-demo-user"
export const DEMO_USER_VALUE = "demo@coursedesigner.app"

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export interface AuthUser {
  id: string
  email: string
  source: "supabase" | "demo"
}

// Server-side resolution. Prefers Supabase session when available, falls back
// to the demo cookie. Returns null when neither is present.
export async function getAuthUser(): Promise<AuthUser | null> {
  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import("@/lib/supabase/server")
      const supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        return {
          id: data.user.id,
          email: data.user.email ?? "(unknown)",
          source: "supabase",
        }
      }
    } catch {
      // Fall through to cookie check.
    }
  }
  const cookieStore = await cookies()
  const demo = cookieStore.get(DEMO_USER_COOKIE)
  if (demo?.value) {
    return { id: "demo-user", email: DEMO_USER_VALUE, source: "demo" }
  }
  return null
}
