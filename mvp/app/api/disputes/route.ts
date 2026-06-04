import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const shop  = req.nextUrl.searchParams.get('shop')
  const email = req.nextUrl.searchParams.get('email')

  if (!shop && !email) return NextResponse.json({ error: 'Missing shop or email' }, { status: 400 })

  const admin = createSupabaseAdmin()

  const storeRes = shop
    ? await admin.from('shopify_stores').select('id, win_rate, total_disputes, total_recovered').eq('shop_domain', shop).single()
    : await admin.from('shopify_stores').select('id, win_rate, total_disputes, total_recovered').eq('owner_email', email!).single()

  const store = storeRes.data
  if (!store) {
    return NextResponse.json({ disputes: [], stats: { total: 0, won: 0, pending: 0, recovered: 0, win_rate: 0 } })
  }

  const { data: disputes } = await admin
    .from('disputes')
    .select('*')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const pending   = (disputes || []).filter(d => ['pending','response_generated'].includes(d.status)).length
  const won       = (disputes || []).filter(d => d.outcome === 'won').length
  const recovered = (disputes || []).filter(d => d.outcome === 'won').reduce((s, d) => s + (d.amount || 0), 0)

  return NextResponse.json({
    disputes: disputes || [],
    stats: {
      total:     store.total_disputes || (disputes || []).length,
      won,
      pending,
      recovered: Math.round(recovered),
      win_rate:  store.win_rate || 0,
    },
  })
}
