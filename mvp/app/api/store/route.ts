import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  const shop  = req.nextUrl.searchParams.get('shop')

  if (!email && !shop) return NextResponse.json({ store: null })

  const admin = createSupabaseAdmin()
  const query = admin
    .from('shopify_stores')
    .select('id, shop_domain, plan, win_rate, total_disputes, total_recovered, owner_email')

  const { data: store } = shop
    ? await query.eq('shop_domain', shop).single()
    : await query.eq('owner_email', email!).single()

  return NextResponse.json({ store: store || null })
}

export async function PATCH(req: NextRequest) {
  const { shop_domain, owner_email } = await req.json()
  if (!shop_domain || !owner_email) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const admin = createSupabaseAdmin()
  await admin.from('shopify_stores')
    .update({ owner_email })
    .eq('shop_domain', shop_domain)

  return NextResponse.json({ success: true })
}
