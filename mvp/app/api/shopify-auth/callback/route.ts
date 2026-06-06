import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

const SHOPIFY_API_KEY    = process.env.SHOPIFY_API_KEY!
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET!
const APP_URL            = process.env.NEXT_PUBLIC_APP_URL!

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const shop   = params.get('shop')
  const code   = params.get('code')
  const state  = params.get('state')
  const hmac   = params.get('hmac')

  if (!shop || !code || !state || !hmac) {
    return NextResponse.json({ error: 'Missing OAuth parameters' }, { status: 400 })
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

  if (!tokenRes.ok) {
    return NextResponse.json({ error: 'Token exchange failed' }, { status: 500 })
  }

  const { access_token } = await tokenRes.json()

  // Upsert store in Supabase
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
      shop_domain: shop, access_token, plan: 'trial', credits_remaining: 5,
    })
  }

  // Register webhooks (non-fatal)
  await registerWebhooks(shop, access_token)

  return NextResponse.redirect(`${APP_URL}/dashboard?shop=${shop}&installed=1`)
}

async function registerWebhooks(shop: string, token: string) {
  const hooks = [
    { topic: 'disputes/create', address: `${APP_URL}/api/shopify-webhook` },
    { topic: 'disputes/update', address: `${APP_URL}/api/shopify-webhook` },
    { topic: 'orders/create',   address: `${APP_URL}/api/order-webhook` },
  ]
  for (const wh of hooks) {
    await fetch(`https://${shop}/admin/api/2024-01/webhooks.json`, {
      method: 'POST',
      headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhook: wh }),
    }).catch(() => {})
  }
}

function verifyHmac(params: URLSearchParams, hmac: string): boolean {
  const pairs = Array.from(params.entries())
    .filter(([k]) => k !== 'hmac' && k !== 'signature')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('&')
  const digest = crypto.createHmac('sha256', SHOPIFY_API_SECRET).update(pairs).digest('hex')
  try { return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmac)) }
  catch { return false }
}
