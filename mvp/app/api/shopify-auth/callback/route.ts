import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

export async function GET(req: NextRequest) {
  const shop  = req.nextUrl.searchParams.get('shop')
  const code  = req.nextUrl.searchParams.get('code')
  const hmac  = req.nextUrl.searchParams.get('hmac')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dispute-iq-wcev.vercel.app'
  const apiKey = process.env.SHOPIFY_API_KEY!
  const secret = process.env.SHOPIFY_API_SECRET!

  if (!shop || !code || !hmac) {
    return NextResponse.redirect(`${appUrl}/?error=missing_params`)
  }

  const params: Record<string,string> = {}
  req.nextUrl.searchParams.forEach((val, key) => { if (key !== 'hmac') params[key] = val })
  const message = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&')
  const digest  = crypto.createHmac('sha256', secret).update(message).digest('hex')
  if (digest !== hmac) {
    return NextResponse.redirect(`${appUrl}/?error=invalid_hmac`)
  }

  const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: apiKey, client_secret: secret, code }),
  })
  if (!tokenRes.ok) return NextResponse.redirect(`${appUrl}/?error=token_failed`)

  const { access_token: token } = await tokenRes.json()
  if (!token) return NextResponse.redirect(`${appUrl}/?error=no_token`)

  const shopRes = await fetch(`https://${shop}/admin/api/2024-01/shop.json`, {
    headers: { 'X-Shopify-Access-Token': token },
  })
  const { shop: shopData } = await shopRes.json()
  const email = shopData?.email || ''
  const name  = shopData?.name  || shop

  const admin = createSupabaseAdmin()
  await admin.from('shopify_stores').upsert({
    shop_domain:  shop,
    access_token: token,
    owner_email:  email,
    shop_name:    name,
    plan:         'trial',
  }, { onConflict: 'shop_domain' })

  return NextResponse.redirect(`${appUrl}/dashboard?shop=${shop}&installed=1`)
}
