import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPublicPath = path === "/" || path === "/register" || path === "/forgot-password" || path === "/reset-password"

  const token = request.cookies.get("token")?.value || ""

  if (isPublicPath && token && path !== "/forgot-password" && path !== "/reset-password") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/register", "/forgot-password", "/reset-password", "/dashboard/:path*"],
}
