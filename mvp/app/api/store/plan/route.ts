import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

const VALID_PLANS = ['free', 'trial', 'starter', 'growth', 'scale']

export async function POST(req: NextRequest) {
  const { shop_domain, user_id, plan } = await req.json()

  if (!plan || !VALID_PLANS.includes(plan)) {
    return NextResponse.json({ error: `Invalid plan. Must be one of: ${VALID_PLANS.join(', ')}` }, { status: 400 })
  }
  if (!shop_domain && !user_id) {
    return NextResponse.json({ error: 'Provide shop_domain or user_id' }, { status: 400 })
  }

  const admin = createSupabaseAdmin()
  const q     = admin.from('shopify_stores').update({ plan })

  const { error } = shop_domain
    ? await q.eq('shop_domain', shop_domain)
    : await q.eq('user_id', user_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, plan })
}
