import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_ROUTES = [
  '/api/shopify-auth',
  '/api/shopify-webhook',
  '/api/stripe-webhook',
  '/api/waitlist',
  '/pricing',
  '/privacy',
  '/terms',
  '/_next',
  '/favicon',
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Always allow public routes
  if (PUBLIC_ROUTES.some(r => pathname.startsWith(r))) {
    return NextResponse.next()
  }

  // Dashboard requires shop param for now (OAuth-based, no user accounts)
  if (pathname.startsWith('/dashboard')) {
    const shop = req.nextUrl.searchParams.get('shop')
    if (!shop) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
