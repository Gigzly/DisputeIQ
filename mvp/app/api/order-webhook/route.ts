import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const hmac    = req.headers.get('x-shopify-hmac-sha256') || ''
  const shop    = req.headers.get('x-shopify-shop-domain') || ''

  if (!verifyWebhook(rawBody, hmac)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const order = JSON.parse(rawBody)
  const admin  = createSupabaseAdmin()

  const { data: store } = await admin
    .from('shopify_stores')
    .select('id, owner_email, shop_domain')
    .eq('shop_domain', shop)
    .single()

  if (!store) return NextResponse.json({ received: true })

  const riskScore  = scoreOrder(order)
  const riskFactors = getRiskFactors(order)

  if (riskScore >= 60) {
    try {
      await admin.from('order_risk_flags').upsert({
        store_id:     store.id,
        order_id:     String(order.id),
        order_number: String(order.order_number),
        amount:       parseFloat(order.total_price || '0'),
        currency:     order.currency || 'USD',
        risk_score:   riskScore,
        risk_factors: riskFactors,
        created_at:   order.created_at || new Date().toISOString(),
      }, { onConflict: 'order_id' })
    } catch {
      // Table may not exist yet — non-fatal
    }

    // Check for card testing burst: 3+ high-risk orders in 24h from this store
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    try {
      const { data: recentFlags, count } = await admin
        .from('order_risk_flags')
        .select('id', { count: 'exact' })
        .eq('store_id', store.id)
        .gte('created_at', since24h)
        .gte('risk_score', 60)

      if ((count || 0) >= 3) {
        await sendCardTestingAlert(store.owner_email, store.shop_domain, count || 0, parseFloat(order.total_price || '0'), order.currency)
      } else if (riskScore >= 80) {
        await sendHighRiskAlert(store.owner_email, store.shop_domain, order, riskScore, riskFactors)
      }
    } catch {
      // Non-fatal
    }
  }

  return NextResponse.json({ received: true, risk_score: riskScore })
}

function scoreOrder(order: any): number {
  let score = 0
  if (order.billing_address?.address1 !== order.shipping_address?.address1) score += 20
  if ((order.billing_address?.country_code || '') !== (order.shipping_address?.country_code || '')) score += 15
  if (!order.email)                                                             score += 15
  if (parseFloat(order.total_price || '0') > 500)                             score += 10
  if (order.financial_status === 'pending')                                    score += 10
  if ((order.customer?.orders_count || 0) === 0)                              score += 15
  if (!order.customer)                                                         score += 20
  if (order.tags?.includes('high-risk'))                                       score += 25
  if ((order.customer?.orders_count || 0) > 3)                               score -= 10
  return Math.max(0, Math.min(100, score))
}

function getRiskFactors(order: any): string[] {
  const factors: string[] = []
  if ((order.billing_address?.country_code || '') !== (order.shipping_address?.country_code || ''))
    factors.push('Billing and shipping countries differ')
  if (order.billing_address?.address1 !== order.shipping_address?.address1)
    factors.push('Billing ≠ shipping address')
  if (!order.email)            factors.push('No email on order')
  if (parseFloat(order.total_price || '0') > 500) factors.push('High-value order (>$500)')
  if ((order.customer?.orders_count || 0) === 0)  factors.push('First-time customer')
  if (!order.customer)         factors.push('Guest checkout')
  return factors
}

async function sendHighRiskAlert(email: string, shop: string, order: any, score: number, factors: string[]) {
  if (!process.env.RESEND_API_KEY || !email) return
  const from = process.env.RESEND_VERIFIED_DOMAIN
    ? 'DisputeIQ <conor@disputeiq.co>'
    : 'DisputeIQ <onboarding@resend.dev>'

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from, to: email,
      subject: `⚠️ High-risk order on ${shop} — risk score ${score}/100`,
      html: `<div style="font-family:-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <h2 style="color:#dc2626">High-risk order detected</h2>
        <p>Order #${order.order_number} on <strong>${shop}</strong> has a chargeback risk score of <strong>${score}/100</strong>.</p>
        <p><strong>Amount:</strong> ${order.currency} ${order.total_price}</p>
        <p><strong>Risk factors:</strong></p>
        <ul>${factors.map(f => `<li>${f}</li>`).join('')}</ul>
        <p style="color:#6b7280;font-size:13px">Consider reviewing this order before fulfilling.</p>
      </div>`,
    }),
  }).catch(() => {})
}

async function sendCardTestingAlert(email: string, shop: string, count: number, amount: number, currency: string) {
  if (!process.env.RESEND_API_KEY || !email) return
  const from = process.env.RESEND_VERIFIED_DOMAIN
    ? 'DisputeIQ <conor@disputeiq.co>'
    : 'DisputeIQ <onboarding@resend.dev>'

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from, to: email,
      subject: `🚨 Card testing detected on ${shop} — ${count} high-risk orders in 24h`,
      html: `<div style="font-family:-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <h2 style="color:#dc2626">Possible card testing attack</h2>
        <p><strong>${shop}</strong> has received <strong>${count} high-risk orders in the last 24 hours</strong>.
        This pattern is consistent with card testing fraud — where fraudsters test stolen cards with small purchases.</p>
        <p><strong>Recommended action:</strong> Review recent orders in Shopify and consider enabling payment fraud prevention rules.</p>
        <p style="color:#6b7280;font-size:13px">DisputeIQ chargeback prevention · conor@disputeiq.co</p>
      </div>`,
    }),
  }).catch(() => {})
}

function verifyWebhook(body: string, hmac: string): boolean {
  const secret = process.env.SHOPIFY_API_SECRET!
  const digest = crypto.createHmac('sha256', secret).update(body, 'utf8').digest('base64')
  try { return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmac)) }
  catch { return false }
}
