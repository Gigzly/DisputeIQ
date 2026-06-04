import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams.toString()
  const base   = req.nextUrl.origin
  return NextResponse.redirect(`${base}/api/shopify-auth?${params}`)
}
