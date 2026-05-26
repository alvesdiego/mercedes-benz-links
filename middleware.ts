import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { isAllowedOrigin } from '@/lib/cors'

const PROTECTED_PATHS = ['/dashboard']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestOrigin = request.headers.get('origin')

  // ── Preflight handling for API routes ───────────────────────────────────
  if (request.method === 'OPTIONS' && pathname.startsWith('/api/')) {
    if (requestOrigin && !isAllowedOrigin(requestOrigin)) {
      return new NextResponse(null, { status: 403 })
    }
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': requestOrigin ?? '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
        'Vary': 'Origin',
      },
    })
  }

  // ── CORS enforcement for API routes ─────────────────────────────────────
  if (requestOrigin && pathname.startsWith('/api/') && !isAllowedOrigin(requestOrigin)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // ── Auth protection for admin/dashboard routes ──────────────────────────
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p))
  if (!isProtected && pathname !== '/login') {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(
              name,
              value,
              options as Parameters<typeof supabaseResponse.cookies.set>[2]
            )
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname === '/login' && user) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    return NextResponse.redirect(dashboardUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf|eot)$).*)',
  ],
}
