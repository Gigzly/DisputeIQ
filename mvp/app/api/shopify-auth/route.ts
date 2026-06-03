import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

const SHOPIFY_API_KEY    = process.env.SHOPIFY_API_KEY!
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET!
const APP_URL            = process.env.NEXT_PUBLIC_APP_URL!

const SCOPES = 'read_orders,read_fulfillments,read_customers,read_disputes'

// Step 1: Redirect merchant to Shopify OAuth
export async function GET(req: NextRequest) {
  const shop = req.nextUrl.searchParams.get('shop')
  if (!shop) return NextResponse.json({ error: 'Missing shop parameter' }, { status: 400 })

  const sanitized = sanitizeShop(shop)
  if (!sanitized) return NextResponse.json({ error: 'Invalid shop domain' }, { status: 400 })

  const state    = crypto.randomBytes(16).toString('hex')
  const redirect = `${APP_URL}/api/shopify-auth/callback`

  const authUrl = `https://${sanitized}/admin/oauth/authorize?` +
    `client_id=${SHOPIFY_API_KEY}&` +
    `scope=${SCOPES}&` +
    `redirect_uri=${encodeURIComponent(redirect)}&` +
    `state=${state}`

  const response = NextResponse.redirect(authUrl)
  response.cookies.set('shopify_state', state, { httpOnly: true, maxAge: 600 })
  return response
}

// Step 2: Handle OAuth callback
export async function POST(req: NextRequest) {
  const params   = req.nextUrl.searchParams
  const code     = params.get('code')
  const shop     = params.get('shop')
  const state    = params.get('state')
  const hmac     = params.get('hmac')
  const storedState = req.cookies.get('shopify_state')?.value

  if (!code || !shop || !state || !hmac) {
    return NextResponse.json({ error: 'Missing OAuth parameters' }, { status: 400 })
  }
  if (state !== storedState) {
    return NextResponse.json({ error: 'State mismatch — possible CSRF' }, { status: 403 })
  }
  if (!verifyHmac(params, hmac)) {
    return NextResponse.json({ error: 'HMAC verification failed' }, { status: 403 })
  }

  // Exchange code for access token
  const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id:     SHOPIFY_API_KEY,
      client_secret: SHOPIFY_API_SECRET,
      code,
    }),
  })
  if (!tokenRes.ok) return NextResponse.json({ error: 'Token exchange failed' }, { status: 500 })
  const { access_token } = await tokenRes.json()

  // Store shop in Supabase
  const admin = createSupabaseAdmin()
  const { data: existing } = await admin
    .from('shopify_stores')
    .select('id')
    .eq('shop_domain', shop)
    .single()

  if (existing) {
    await admin.from('shopify_stores')
      .update({ access_token, updated_at: new Date().toISOString() })
      .eq('shop_domain', shop)
  } else {
    await admin.from('shopify_stores').insert({
      shop_domain:  shop,
      access_token,
      plan:         'trial',
      credits_remaining: 5,
    })
  }

  // Register webhooks
  await registerWebhooks(shop, access_token)

  const response = NextResponse.redirect(`${APP_URL}/dashboard?shop=${shop}&installed=1`)
  response.cookies.delete('shopify_state')
  return response
}

async function registerWebhooks(shop: string, token: string) {
  const webhooks = [
    { topic: 'disputes/create', address: `${APP_URL}/api/shopify-webhook` },
    { topic: 'disputes/update', address: `${APP_URL}/api/shopify-webhook` },
  ]
  for (const wh of webhooks) {
    await fetch(`https://${shop}/admin/api/2024-01/webhooks.json`, {
      method: 'POST',
      headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhook: wh }),
    }).catch(() => {}) // non-fatal
  }
}

function sanitizeShop(shop: string): string | null {
  const clean = shop.replace(/^https?:\/\//, '').replace(/\/$/, '')
  return /^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/.test(clean) ? clean : null
}

function verifyHmac(params: URLSearchParams, hmac: string): boolean {
  const pairs = Array.from(params.entries())
    .filter(([k]) => k !== 'hmac' && k !== 'signature')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('&')

  const digest = crypto
    .createHmac('sha256', SHOPIFY_API_SECRET)
    .update(pairs)
    .digest('hex')
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmac))
}
