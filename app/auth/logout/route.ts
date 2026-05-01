import { NextResponse, type NextRequest } from "next/server"

const DEMO_USER_COOKIE = "course-designer-demo-user"

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url))
  response.cookies.delete(DEMO_USER_COOKIE)

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const { createClient } = await import("@/lib/supabase/server")
    const supabase = await createClient()
    await supabase.auth.signOut()
  }

  return response
}

export async function GET(request: NextRequest) {
  return POST(request)
}
