import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const shop = req.nextUrl.searchParams.get('shop')
  if (!shop) return NextResponse.json({ error: 'Missing shop' }, { status: 400 })

  const admin = createSupabaseAdmin()

  const { data: store } = await admin
    .from('shopify_stores')
    .select('id')
    .eq('shop_domain', shop)
    .single()

  if (!store) return NextResponse.json({ activities: [] })

  const { data: disputes } = await admin
    .from('disputes')
    .select('id, order_id, amount, currency, status, outcome, reason_code, network, created_at')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false })
    .limit(30)

  const activities = (disputes || []).flatMap((d: any) => {
    const base = { dispute_id: d.id, order_id: d.order_id, amount: d.amount, currency: d.currency, reason_code: d.reason_code, network: d.network, timestamp: d.created_at }
    const events = [{ ...base, id: `${d.id}-detected`, type: 'dispute_detected' }]
    if (['response_generated','submitted','won','lost'].includes(d.status)) {
      events.push({ ...base, id: `${d.id}-response`, type: 'response_generated' })
    }
    if (d.outcome) {
      events.push({ ...base, id: `${d.id}-outcome`, type: d.outcome === 'won' ? 'dispute_won' : 'dispute_lost' })
    }
    return events
  })

  return NextResponse.json({ activities })
}
