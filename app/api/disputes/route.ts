import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const shop = req.nextUrl.searchParams.get('shop')
  if (!shop) return NextResponse.json({ error: 'Missing shop' }, { status: 400 })

  const admin = createSupabaseAdmin()

  const { data: store } = await admin
    .from('shopify_stores')
    .select('id, win_rate, total_disputes, total_recovered')
    .eq('shop_domain', shop)
    .single()

  if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 })

  const { data: disputes } = await admin
    .from('disputes')
    .select('*')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const pending   = (disputes || []).filter(d => d.status === 'pending' || d.status === 'response_generated').length
  const won       = (disputes || []).filter(d => d.outcome === 'won').length
  const recovered = (disputes || [])
    .filter(d => d.outcome === 'won')
    .reduce((sum, d) => sum + (d.amount || 0), 0)

  return NextResponse.json({
    disputes: disputes || [],
    stats: {
      total:     store.total_disputes || 0,
      won,
      pending,
      recovered: Math.round(recovered),
      win_rate:  store.win_rate || 0,
    },
  })
}
