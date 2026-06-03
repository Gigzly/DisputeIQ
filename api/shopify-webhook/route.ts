import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createSupabaseAdmin } from '@/lib/supabase'
import { ShopifyClient } from '@/lib/shopify'
import { generateDisputeResponse } from '@/lib/generate-response'

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const hmac    = req.headers.get('x-shopify-hmac-sha256') || ''
  const topic   = req.headers.get('x-shopify-topic') || ''
  const shop    = req.headers.get('x-shopify-shop-domain') || ''

  // Verify webhook authenticity
  if (!verifyWebhook(rawBody, hmac)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = JSON.parse(rawBody)
  const admin   = createSupabaseAdmin()

  // Look up the store
  const { data: store, error } = await admin
    .from('shopify_stores')
    .select('*')
    .eq('shop_domain', shop)
    .single()

  if (error || !store) {
    console.error(`[webhook] Store not found: ${shop}`)
    return NextResponse.json({ received: true }) // ack to Shopify
  }

  if (topic === 'disputes/create') {
    await handleDisputeCreate(payload, store, admin)
  } else if (topic === 'disputes/update') {
    await handleDisputeUpdate(payload, store, admin)
  }

  return NextResponse.json({ received: true })
}

async function handleDisputeCreate(payload: any, store: any, admin: any) {
  const disputeId = String(payload.id)
  const orderId   = String(payload.order_id)

  // Check for duplicate
  const { data: existing } = await admin
    .from('disputes')
    .select('id')
    .eq('shopify_dispute_id', disputeId)
    .single()

  if (existing) return

  // Save dispute immediately — don't wait for evidence
  const { data: dispute } = await admin.from('disputes').insert({
    store_id:           store.id,
    shopify_dispute_id: disputeId,
    order_id:           orderId,
    amount:             parseFloat(payload.amount || '0'),
    currency:           payload.currency || 'USD',
    reason:             payload.reason || '',
    reason_code:        payload.reason_code || '',
    network:            detectNetwork(payload.reason_code || ''),
    status:             'pending',
    due_by:             payload.evidence_due_by || null,
  }).select('id').single()

  if (!dispute) return

  // Now build evidence and generate response async
  try {
    const client   = new ShopifyClient(store.shop_domain, store.access_token)
    const evidence = await client.buildEvidence(orderId)
    const response = await generateDisputeResponse(
      evidence,
      payload.reason_code || '',
      detectNetwork(payload.reason_code || ''),
      parseFloat(payload.amount || '0'),
      payload.currency || 'USD'
    )

    await admin.from('disputes').update({
      evidence,
      generated_response: response,
      status: 'response_generated',
    }).eq('id', dispute.id)

    // Send alert email to merchant
    await sendDisputeAlert(store, dispute.id, response, payload)

  } catch (err) {
    console.error(`[webhook] Evidence/generation failed for dispute ${disputeId}:`, err)
    // Dispute saved — merchant can manually trigger generation from dashboard
  }
}

async function handleDisputeUpdate(payload: any, store: any, admin: any) {
  const disputeId = String(payload.id)
  const updates: any = {}

  if (payload.status === 'won')  { updates.status = 'won';  updates.outcome = 'won' }
  if (payload.status === 'lost') { updates.status = 'lost'; updates.outcome = 'lost' }

  if (Object.keys(updates).length > 0) {
    await admin.from('disputes')
      .update(updates)
      .eq('shopify_dispute_id', disputeId)
      .eq('store_id', store.id)

    // Update win rate stats
    await recalcWinRate(store.id, admin)
  }
}

async function recalcWinRate(storeId: string, admin: any) {
  const { data } = await admin
    .from('disputes')
    .select('outcome')
    .eq('store_id', storeId)
    .not('outcome', 'is', null)

  if (!data?.length) return
  const won      = data.filter((d: any) => d.outcome === 'won').length
  const winRate  = won / data.length
  await admin.from('shopify_stores')
    .update({ win_rate: winRate, total_disputes: data.length })
    .eq('id', storeId)
}

async function sendDisputeAlert(store: any, disputeDbId: string, response: any, payload: any) {
  if (!process.env.RESEND_API_KEY) return
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from:    'DisputeIQ <alerts@disputeiq.co>',
      to:      store.owner_email,
      subject: `⚡ New chargeback — response ready (win probability: ${Math.round(response.win_probability * 100)}%)`,
      html: `
        <p>A new chargeback has arrived for your store <strong>${store.shop_domain}</strong>.</p>
        <p><strong>Amount:</strong> ${payload.currency} ${payload.amount}</p>
        <p><strong>Reason:</strong> ${payload.reason_code} — ${payload.reason}</p>
        <p><strong>Due by:</strong> ${payload.evidence_due_by ? new Date(payload.evidence_due_by).toDateString() : 'Check portal'}</p>
        <p><strong>Win probability:</strong> ${Math.round(response.win_probability * 100)}%</p>
        <p><strong>Evidence strength:</strong> ${response.evidence_strength}</p>
        <p>Your dispute response has been generated and is ready to review.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/disputes/${disputeDbId}" style="background:#16a34a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;margin-top:8px">Review and submit response →</a></p>
        <p style="color:#6b7280;font-size:13px;margin-top:24px">DisputeIQ · You can manage alert preferences in your dashboard</p>
      `,
    }),
  }).catch(e => console.error('Alert email failed:', e))
}

function detectNetwork(reasonCode: string): string {
  if (!reasonCode) return 'visa'
  if (reasonCode.startsWith('48') || reasonCode.startsWith('49')) return 'mastercard'
  if (/^[A-Z]/.test(reasonCode)) return 'amex'
  return 'visa'
}

function verifyWebhook(body: string, hmac: string): boolean {
  const secret = process.env.SHOPIFY_API_SECRET!
  const digest = crypto.createHmac('sha256', secret).update(body, 'utf8').digest('base64')
  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmac))
  } catch {
    return false
  }
}
