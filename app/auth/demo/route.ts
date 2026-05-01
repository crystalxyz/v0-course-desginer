import { NextResponse, type NextRequest } from "next/server"

const DEMO_USER_COOKIE = "course-designer-demo-user"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const next = url.searchParams.get("next") ?? "/courses"
  const safeNext = next.startsWith("/") ? next : "/courses"
  const response = NextResponse.redirect(new URL(safeNext, request.url))
  response.cookies.set(DEMO_USER_COOKIE, "1", {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
  return response
}
