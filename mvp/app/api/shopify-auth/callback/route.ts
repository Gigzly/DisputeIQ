import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
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

  const params: Record<string, string> = {}
  req.nextUrl.searchParams.forEach((val, key) => { if (key !== 'hmac') params[key] = val })
  const message = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&')
  const digest  = crypto.createHmac('sha256', secret).update(message).digest('hex')
  if (digest !== hmac) {
    return NextResponse.redirect(`${appUrl}/?error=invalid_hmac`)
  }

  const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ client_id: apiKey, client_secret: secret, code }),
  })
  if (!tokenRes.ok) return NextResponse.redirect(`${appUrl}/?error=token_failed`)

  const { access_token: shopifyToken } = await tokenRes.json()
  if (!shopifyToken) return NextResponse.redirect(`${appUrl}/?error=no_token`)

  const shopRes = await fetch(`https://${shop}/admin/api/2024-01/shop.json`, {
    headers: { 'X-Shopify-Access-Token': shopifyToken },
  })
  const { shop: shopData } = await shopRes.json()
  const email = shopData?.email || ''
  const name  = shopData?.name  || shop

  const admin = createSupabaseAdmin()
  await admin.from('shopify_stores').upsert({
    shop_domain:  shop,
    access_token: shopifyToken,
    owner_email:  email,
    shop_name:    name,
    plan:         'trial',
  }, { onConflict: 'shop_domain' })

  // Deterministic password — derived from shop domain, never shown to the merchant
  const deterministicPassword =
    crypto.createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY || secret)
      .update(shop)
      .digest('hex')
      .slice(0, 32) + 'Dq!'

  // Use real email or a synthetic one if Shopify didn't provide one
  const storeEmail = email || `${shop.replace(/[^a-z0-9]/gi, '-')}@noemail.disputeiq`

  // Create the Supabase user (auto-confirmed) — or find the existing one
  let userId: string | undefined
  const { data: newUser } = await admin.auth.admin.createUser({
    email:         storeEmail,
    password:      deterministicPassword,
    email_confirm: true,
  })
  if (newUser?.user) {
    userId = newUser.user.id
  } else {
    // User already exists — find by email and reset password to stay in sync
    const { data: { users } } = await admin.auth.admin.listUsers({ perPage: 1000 })
    const existing = users?.find(u => u.email === storeEmail)
    if (existing) {
      userId = existing.id
      await admin.auth.admin.updateUserById(userId, { password: deterministicPassword })
    }
  }

  // Link store row to the Supabase user
  if (userId) {
    await admin.from('shopify_stores').update({ user_id: userId }).eq('shop_domain', shop)
  }

  // Sign in with the anon client to obtain session tokens for the client-side callback
  let accessToken  = ''
  let refreshToken = ''
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: signInData } = await anonClient.auth.signInWithPassword({
    email:    storeEmail,
    password: deterministicPassword,
  })
  accessToken  = signInData?.session?.access_token  || ''
  refreshToken = signInData?.session?.refresh_token || ''

  // Hand off to the client-side page which sets the session and redirects to dashboard
  const dest = new URL(`${appUrl}/auth/shopify-callback`)
  dest.searchParams.set('shop', shop)
  dest.searchParams.set('installed', '1')
  if (accessToken)  dest.searchParams.set('access_token', accessToken)
  if (refreshToken) dest.searchParams.set('refresh_token', refreshToken)

  return NextResponse.redirect(dest.toString())
}
