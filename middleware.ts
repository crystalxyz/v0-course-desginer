import { NextResponse, type NextRequest } from "next/server"

// Routes that require auth.
const PROTECTED_PREFIXES = ["/new", "/courses"]

const DEMO_USER_COOKIE = "course-designer-demo-user"

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!isProtected(pathname)) return NextResponse.next()

  // Two valid sessions: Supabase auth cookie or demo-user cookie.
  const hasDemoCookie = Boolean(request.cookies.get(DEMO_USER_COOKIE)?.value)

  let hasSupabaseSession = false
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const { createServerClient } = await import("@supabase/ssr")
    const response = NextResponse.next()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )
    const { data } = await supabase.auth.getUser()
    hasSupabaseSession = Boolean(data.user)
    if (hasSupabaseSession || hasDemoCookie) return response
  } else if (hasDemoCookie) {
    return NextResponse.next()
  }

  // Not authenticated. Bounce to login, preserving the intended destination.
  const loginUrl = new URL("/auth/login", request.url)
  loginUrl.searchParams.set("next", pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  // Skip Next internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
