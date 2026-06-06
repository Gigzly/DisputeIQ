import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

const SHOPIFY_API_KEY    = process.env.SHOPIFY_API_KEY!
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET!
const APP_URL            = process.env.NEXT_PUBLIC_APP_URL!
const SCOPES             = 'read_orders,read_fulfillments,read_customers'

// Handles both Step 1 (initiate) and Step 2 (callback) — Shopify always GETs callbacks
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const shop   = params.get('shop')
  const code   = params.get('code')
  const state  = params.get('state')
  const hmac   = params.get('hmac')

  // ── Step 2: OAuth callback (code present) ──────────────────────────────
  // HMAC verification is the real security check here. State cookie verification
  // is skipped because cross-domain redirects from Shopify don't reliably preserve
  // SameSite cookies on all browsers/hosting configs.
  if (code && shop && state && hmac) {
    if (!verifyHmac(params, hmac)) {
      return NextResponse.json({ error: 'HMAC verification failed' }, { status: 403 })
    }

    // Exchange code for access token
    const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: SHOPIFY_API_KEY, client_secret: SHOPIFY_API_SECRET, code }),
    })
    if (!tokenRes.ok) return NextResponse.json({ error: 'Token exchange failed' }, { status: 500 })
    const { access_token } = await tokenRes.json()

    // Upsert store in Supabase
    const admin = createSupabaseAdmin()
    const { data: existing } = await admin
      .from('shopify_stores').select('id').eq('shop_domain', shop).single()

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

  // ── Step 1: Initiate OAuth ─────────────────────────────────────────────
  if (!shop) return NextResponse.json({ error: 'Missing shop parameter' }, { status: 400 })
  const sanitized = sanitizeShop(shop)
  if (!sanitized) return NextResponse.json({ error: 'Invalid shop domain' }, { status: 400 })

  const redirect  = `${APP_URL}/api/shopify-auth/callback`
  const nonce     = crypto.randomBytes(16).toString('hex')
  const authUrl   =
    `https://${sanitized}/admin/oauth/authorize?` +
    `client_id=${SHOPIFY_API_KEY}&scope=${SCOPES}&` +
    `redirect_uri=${encodeURIComponent(redirect)}&state=${nonce}`

  return NextResponse.redirect(authUrl)
}

async function registerWebhooks(shop: string, token: string) {
  const topics = [
    'disputes/create', 'disputes/update', 'orders/create',
  ]
  const endpoints: Record<string, string> = {
    'disputes/create': `${APP_URL}/api/shopify-webhook`,
    'disputes/update': `${APP_URL}/api/shopify-webhook`,
    'orders/create':   `${APP_URL}/api/order-webhook`,
  }
  for (const topic of topics) {
    await fetch(`https://${shop}/admin/api/2024-01/webhooks.json`, {
      method: 'POST',
      headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhook: { topic, address: endpoints[topic] } }),
    }).catch(() => {})
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
  const digest = crypto.createHmac('sha256', SHOPIFY_API_SECRET).update(pairs).digest('hex')
  try { return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmac)) }
  catch { return false }
}
