import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

export async function GET(req: NextRequest) {
  const shop   = req.nextUrl.searchParams.get('shop')
  const code   = req.nextUrl.searchParams.get('code')
  const hmac   = req.nextUrl.searchParams.get('hmac')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dispute-iq-wcev.vercel.app'
  const apiKey = process.env.SHOPIFY_API_KEY!
  const secret = process.env.SHOPIFY_API_SECRET!

  if (!shop || !code || !hmac) {
    return NextResponse.redirect(`${appUrl}/?error=missing_params`)
  }

  // Verify HMAC
  const params: Record<string, string> = {}
  req.nextUrl.searchParams.forEach((val, key) => { if (key !== 'hmac') params[key] = val })
  const message = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&')
  const digest  = crypto.createHmac('sha256', secret).update(message).digest('hex')
  if (digest !== hmac) {
    return NextResponse.redirect(`${appUrl}/?error=invalid_hmac`)
  }

  // Exchange code for access token
  const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ client_id: apiKey, client_secret: secret, code }),
  })
  if (!tokenRes.ok) return NextResponse.redirect(`${appUrl}/?error=token_failed`)

  const { access_token: shopifyToken } = await tokenRes.json()
  if (!shopifyToken) return NextResponse.redirect(`${appUrl}/?error=no_token`)

  // Fetch store info from Shopify
  const shopRes = await fetch(`https://${shop}/admin/api/2024-01/shop.json`, {
    headers: { 'X-Shopify-Access-Token': shopifyToken },
  })
  const { shop: shopData } = await shopRes.json()
  const email = shopData?.email || ''
  const name  = shopData?.name  || shop

  const admin = createSupabaseAdmin()

  // Save / update store record
  await admin.from('shopify_stores').upsert({
    shop_domain:  shop,
    access_token: shopifyToken,
    owner_email:  email,
    shop_name:    name,
    plan:         'trial',
  }, { onConflict: 'shop_domain' })

  // Synthetic email if Shopify didn't provide one
  const storeEmail = email || `${shop.replace(/[^a-z0-9]/gi, '-')}@noemail.disputeiq`

  // Create Supabase user (auto-confirmed, no password — magic link only)
  let userId: string | undefined
  const { data: newUser } = await admin.auth.admin.createUser({
    email:         storeEmail,
    email_confirm: true,
  })
  if (newUser?.user) {
    userId = newUser.user.id
  } else {
    // User already exists — find by listing
    const { data: { users } } = await admin.auth.admin.listUsers({ perPage: 1000 })
    const existing = users?.find(u => u.email === storeEmail)
    if (existing) userId = existing.id
  }

  // Permanently link store row to Supabase user
  if (userId) {
    await admin.from('shopify_stores').update({ user_id: userId }).eq('shop_domain', shop)
  }

  // Generate a magic link — Supabase verifies it and passes real session tokens
  // to our callback page via URL hash, establishing a proper persistent session
  const callbackUrl = `${appUrl}/auth/shopify-callback?shop=${encodeURIComponent(shop)}&installed=1`
  const { data: linkData } = await admin.auth.admin.generateLink({
    type:    'magiclink',
    email:   storeEmail,
    options: { redirectTo: callbackUrl },
  })

  if (linkData?.properties?.action_link) {
    return NextResponse.redirect(linkData.properties.action_link)
  }

  // Fallback if magic link generation fails — go direct to dashboard with shop param
  return NextResponse.redirect(`${appUrl}/dashboard?shop=${encodeURIComponent(shop)}&installed=1`)
}
