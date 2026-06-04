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

  if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 })

  const { data: disputes } = await admin
    .from('disputes')
    .select('order_id, amount, currency, network, reason_code, reason, status, outcome, due_by, created_at, generated_response')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false })

  const headers = [
    'Order ID', 'Amount', 'Currency', 'Network', 'Reason Code', 'Reason',
    'Status', 'Outcome', 'Win Probability', 'Evidence Strength', 'Due By', 'Created At',
  ]

  const rows = (disputes || []).map(d => [
    d.order_id || '',
    d.amount?.toFixed(2) || '',
    d.currency || '',
    (d.network || '').toUpperCase(),
    d.reason_code || '',
    d.reason || '',
    d.status || '',
    d.outcome || '',
    d.generated_response ? `${Math.round(d.generated_response.win_probability * 100)}%` : '',
    d.generated_response?.evidence_strength || '',
    d.due_by ? new Date(d.due_by).toISOString().split('T')[0] : '',
    d.created_at ? new Date(d.created_at).toISOString().split('T')[0] : '',
  ])

  const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`
  const csv = [headers, ...rows].map(row => row.map(escape).join(',')).join('\r\n')
  const date = new Date().toISOString().split('T')[0]

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="disputes-${shop}-${date}.csv"`,
    },
  })
}
