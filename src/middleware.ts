import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Define protected routes and their required roles
  const protectedRoutes = {
    '/admin-dashboard/': ['college_admin', 'product_owner'],
    '/admin-dashboard/batch': ['college_admin', 'product_owner'],
    '/admin-dashboard/student': ['college_admin', 'product_owner'],
    '/admin-dashboard/faculty': ['college_admin', 'product_owner'],
    '/admin-dashboard/question': ['college_admin', 'product_owner', 'faculty'],
    '/admin-dashboard/analytics': ['college_admin', 'product_owner'],
  }

  // Check if the current path requires authentication
  const requiredRoles = protectedRoutes[pathname as keyof typeof protectedRoutes]
  
  if (requiredRoles) {
    // Check for access token in cookies
    const accessToken = request.cookies.get('access_token')?.value
    
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Allow access to public routes
  const publicRoutes = ['/login', '/register', '/api']
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin-dashboard/:path*',
    '/login',
    '/register',
  ]
}
