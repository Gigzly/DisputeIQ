import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { outcome } = await req.json()
  if (!['won', 'lost'].includes(outcome)) {
    return NextResponse.json({ error: 'Outcome must be won or lost' }, { status: 400 })
  }

  const admin = createSupabaseAdmin()

  const { data: dispute, error } = await admin
    .from('disputes')
    .update({ status: outcome, outcome })
    .eq('id', params.id)
    .select('store_id, amount')
    .single()

  if (error || !dispute) {
    return NextResponse.json({ error: 'Dispute not found' }, { status: 404 })
  }

  // Recalculate win rate and total recovered
  const { data: allDisputes } = await admin
    .from('disputes')
    .select('outcome, amount')
    .eq('store_id', dispute.store_id)
    .not('outcome', 'is', null)

  if (allDisputes?.length) {
    const wonDisputes = allDisputes.filter((d: any) => d.outcome === 'won')
    const winRate     = wonDisputes.length / allDisputes.length
    const recovered   = wonDisputes.reduce((sum: number, d: any) => sum + (d.amount || 0), 0)

    await admin
      .from('shopify_stores')
      .update({ win_rate: winRate, total_disputes: allDisputes.length, total_recovered: recovered })
      .eq('id', dispute.store_id)
  }

  // Trigger commission calculation for free plan stores that just won
  if (outcome === 'won') {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
    fetch(`${appUrl}/api/commission`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dispute_id: params.id }),
    }).catch(() => {})
  }

  return NextResponse.json({ success: true })
}
