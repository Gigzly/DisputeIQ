import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { dispute_id, shop_domain } = await req.json()
  if (!dispute_id || !shop_domain) {
    return NextResponse.json({ error: 'Missing dispute_id or shop_domain' }, { status: 400 })
  }

  const admin = createSupabaseAdmin()

  const { data: dispute } = await admin
    .from('disputes')
    .select('shopify_dispute_id, generated_response')
    .eq('id', dispute_id)
    .single()

  if (!dispute) return NextResponse.json({ error: 'Dispute not found' }, { status: 404 })

  const { data: store } = await admin
    .from('shopify_stores')
    .select('access_token')
    .eq('shop_domain', shop_domain)
    .single()

  if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 })

  let shopifySubmitted = false

  // Only attempt Shopify API submission for real (non-demo) stores with a real dispute ID
  const isDemo = shop_domain.startsWith('demo-') || store.access_token === 'demo_token'
  if (dispute.shopify_dispute_id && !isDemo && dispute.generated_response) {
    try {
      const res = await fetch(
        `https://${shop_domain}/admin/api/2024-01/shopify_payments/disputes/${dispute.shopify_dispute_id}/dispute_evidence.json`,
        {
          method: 'PUT',
          headers: {
            'X-Shopify-Access-Token': store.access_token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dispute_evidence: {
              summary_of_dispute:       dispute.generated_response.summary || '',
              uncategorized_text:       dispute.generated_response.response_letter || '',
              refund_policy_disclosure: dispute.generated_response.recommended_action || '',
            },
          }),
        }
      )
      shopifySubmitted = res.ok
    } catch {
      // Non-fatal: still mark submitted in our system
    }
  }

  await admin.from('disputes').update({ status: 'submitted' }).eq('id', dispute_id)

  return NextResponse.json({ success: true, shopify_submitted: shopifySubmitted })
}
