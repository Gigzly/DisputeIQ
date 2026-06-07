import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

const COLS = 'id, shop_domain, plan, win_rate, total_disputes, total_recovered, owner_email, user_id'

export async function GET(req: NextRequest) {
  const user_id = req.nextUrl.searchParams.get('user_id')
  const shop    = req.nextUrl.searchParams.get('shop')
  const email   = req.nextUrl.searchParams.get('email')

  if (!user_id && !shop && !email) return NextResponse.json({ store: null })

  const admin = createSupabaseAdmin()
  let store: any = null

  // Priority: user_id (permanent link) → shop_domain → email
  if (user_id) {
    const { data } = await admin.from('shopify_stores').select(COLS).eq('user_id', user_id).single()
    store = data
  }
  if (!store && shop) {
    const { data } = await admin.from('shopify_stores').select(COLS).eq('shop_domain', shop).single()
    store = data
  }
  if (!store && email) {
    const { data } = await admin.from('shopify_stores').select(COLS).eq('owner_email', email).single()
    store = data
  }

  return NextResponse.json({ store: store || null })
}

export async function PATCH(req: NextRequest) {
  const { shop_domain, owner_email } = await req.json()
  if (!shop_domain || !owner_email) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const admin = createSupabaseAdmin()
  await admin.from('shopify_stores').update({ owner_email }).eq('shop_domain', shop_domain)

  return NextResponse.json({ success: true })
}
