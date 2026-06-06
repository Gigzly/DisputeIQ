import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

const COMMISSION_RATE = 0.25

export async function POST(req: NextRequest) {
  const { dispute_id } = await req.json()
  if (!dispute_id) return NextResponse.json({ error: 'Missing dispute_id' }, { status: 400 })

  const admin = createSupabaseAdmin()

  const { data: dispute } = await admin
    .from('disputes')
    .select('id, store_id, amount, currency, order_id, outcome')
    .eq('id', dispute_id)
    .single()

  if (!dispute) return NextResponse.json({ error: 'Dispute not found' }, { status: 404 })
  if (dispute.outcome !== 'won') return NextResponse.json({ error: 'Commission only applies to won disputes' }, { status: 400 })

  const { data: store } = await admin
    .from('shopify_stores')
    .select('id, plan, shop_domain, owner_email')
    .eq('id', dispute.store_id)
    .single()

  if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 })
  if (store.plan !== 'free') return NextResponse.json({ commission: null, reason: 'Not on free plan' })

  // Check if commission already exists for this dispute
  const { data: existing } = await admin
    .from('commissions')
    .select('id')
    .eq('dispute_id', dispute_id)
    .single()

  if (existing) return NextResponse.json({ commission: null, reason: 'Already created' })

  const commission_amount = Math.round((dispute.amount || 0) * COMMISSION_RATE * 100) / 100

  const { data: commission } = await admin
    .from('commissions')
    .insert({
      store_id:          store.id,
      dispute_id:        dispute.id,
      dispute_amount:    dispute.amount,
      commission_amount,
      commission_rate:   COMMISSION_RATE,
      currency:          dispute.currency || 'USD',
      status:            'pending',
    })
    .select('id, commission_amount, currency')
    .single()

  // Send invoice email
  await sendCommissionInvoice(store.owner_email, {
    shop_domain:       store.shop_domain,
    order_id:          dispute.order_id,
    dispute_amount:    dispute.amount,
    commission_amount,
    currency:          dispute.currency || 'USD',
    commission_id:     commission?.id || '',
  })

  return NextResponse.json({ success: true, commission })
}

export async function GET(req: NextRequest) {
  const shop = req.nextUrl.searchParams.get('shop')
  if (!shop) return NextResponse.json({ error: 'Missing shop' }, { status: 400 })

  const admin = createSupabaseAdmin()

  const { data: store } = await admin
    .from('shopify_stores')
    .select('id')
    .eq('shop_domain', shop)
    .single()

  if (!store) return NextResponse.json({ commissions: [], total_due: 0 })

  const { data: commissions } = await admin
    .from('commissions')
    .select('id, dispute_id, dispute_amount, commission_amount, currency, status, created_at')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false })

  const total_due = (commissions || [])
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + (c.commission_amount || 0), 0)

  return NextResponse.json({ commissions: commissions || [], total_due: Math.round(total_due * 100) / 100 })
}

async function sendCommissionInvoice(email: string, data: {
  shop_domain: string; order_id: string; dispute_amount: number
  commission_amount: number; currency: string; commission_id: string
}) {
  if (!process.env.RESEND_API_KEY || !email) return
  const from   = process.env.RESEND_VERIFIED_DOMAIN
    ? 'DisputeIQ <conor@disputeiq.co>'
    : 'DisputeIQ <onboarding@resend.dev>'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://disputeiq.co'

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from, to: email,
      subject: `DisputeIQ commission invoice — ${data.currency} ${data.commission_amount.toFixed(2)}`,
      html: `
        <div style="font-family:-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:24px">
          <h2 style="color:#111827">Commission invoice — you won a dispute 🏆</h2>
          <p style="color:#374151">Hi, your store <strong>${data.shop_domain}</strong> won a dispute.
          On the free plan, DisputeIQ charges 25% of the recovered amount.</p>
          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:18px;margin:20px 0">
            <p style="margin:0 0 8px"><strong>Order:</strong> ${data.order_id}</p>
            <p style="margin:0 0 8px"><strong>Dispute amount recovered:</strong> ${data.currency} ${data.dispute_amount.toFixed(2)}</p>
            <p style="margin:0 0 8px"><strong>Commission (25%):</strong> ${data.currency} ${data.commission_amount.toFixed(2)}</p>
            <p style="margin:0"><strong>Invoice ref:</strong> ${data.commission_id}</p>
          </div>
          <p style="color:#6b7280;font-size:14px">
            Payment instructions will follow. Or upgrade to a subscription plan and pay nothing per dispute —
            <a href="${appUrl}/pricing" style="color:#16a34a">see plans</a>.
          </p>
          <p style="color:#9ca3af;font-size:12px;margin-top:24px">DisputeIQ · conor@disputeiq.co</p>
        </div>`,
    }),
  }).catch(e => console.error('Commission invoice failed:', e))
}
