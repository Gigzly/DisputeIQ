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
    .select('id')
    .eq('shop_domain', shop)
    .single()

  if (!store) return NextResponse.json({ received: true })

  // Calculate chargeback risk score for this order
  const riskScore = scoreOrder(order)

  // Store high-risk orders for prevention alerts
  if (riskScore >= 60) {
    await admin.from('order_risk_flags').upsert({
      store_id:      store.id,
      order_id:      String(order.id),
      order_number:  String(order.order_number),
      amount:        parseFloat(order.total_price || '0'),
      currency:      order.currency || 'USD',
      risk_score:    riskScore,
      risk_factors:  getRiskFactors(order),
      created_at:    order.created_at || new Date().toISOString(),
    }, { onConflict: 'order_id' }).catch(() => {}) // table may not exist yet — non-fatal
  }

  return NextResponse.json({ received: true, risk_score: riskScore })
}

function scoreOrder(order: any): number {
  let score = 0

  // High-risk indicators
  if (order.billing_address?.address1 !== order.shipping_address?.address1) score += 20
  if (!order.email)                                                            score += 15
  if (parseFloat(order.total_price || '0') > 500)                            score += 10
  if (order.financial_status === 'pending')                                   score += 10
  if (order.customer?.orders_count === 0)                                     score += 15
  if (!order.customer)                                                        score += 20
  if (order.tags?.includes('high-risk'))                                      score += 25

  // Low-risk signals (reduce score)
  if ((order.customer?.orders_count || 0) > 3)                               score -= 10
  if (order.billing_address?.address1 === order.shipping_address?.address1)  score -= 10

  return Math.max(0, Math.min(100, score))
}

function getRiskFactors(order: any): string[] {
  const factors: string[] = []
  if (order.billing_address?.address1 !== order.shipping_address?.address1) factors.push('Billing ≠ shipping address')
  if (!order.email)            factors.push('No email on order')
  if (parseFloat(order.total_price || '0') > 500) factors.push('High-value order (>$500)')
  if (order.customer?.orders_count === 0)          factors.push('First-time customer')
  if (!order.customer)         factors.push('Guest checkout')
  return factors
}

function verifyWebhook(body: string, hmac: string): boolean {
  const secret = process.env.SHOPIFY_API_SECRET!
  const digest = crypto.createHmac('sha256', secret).update(body, 'utf8').digest('base64')
  try { return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmac)) }
  catch { return false }
}
