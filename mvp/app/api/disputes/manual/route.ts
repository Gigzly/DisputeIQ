import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import { ShopifyClient } from '@/lib/shopify'
import { generateDisputeResponse } from '@/lib/generate-response'

export async function POST(req: NextRequest) {
  const { shop, order_id, amount, currency, reason_code, network, due_by } = await req.json()

  if (!order_id || !amount) return NextResponse.json({ error: 'order_id and amount are required' }, { status: 400 })

  const admin = createSupabaseAdmin()
  let store: any = null

  if (shop) {
    // No auth required — look up store by shop domain
    const { data } = await admin
      .from('shopify_stores')
      .select('*')
      .eq('shop_domain', shop)
      .single()
    store = data
  } else {
    // Auth fallback — identify store via Bearer token
    const token = (req.headers.get('authorization') || '').replace('Bearer ', '')
    if (token) {
      const { data: { user } } = await admin.auth.getUser(token)
      if (user) {
        const { data: byUser } = await admin.from('shopify_stores').select('*').eq('user_id', user.id).single()
        store = byUser
        if (!store) {
          const { data: byEmail } = await admin.from('shopify_stores').select('*').eq('owner_email', user.email || '').single()
          store = byEmail
        }
      }
    }
  }

  if (!store) return NextResponse.json({
    error: 'No store found. Pass shop: "yourstore.myshopify.com" in the request body, or include a valid auth token.',
    hint: 'Add shop param to the request body',
  }, { status: 404 })

  const { data: dispute } = await admin.from('disputes').insert({
    store_id:           store.id,
    shopify_dispute_id: `manual_${Date.now()}`,
    order_id,
    amount:             parseFloat(amount),
    currency:           currency || 'USD',
    reason_code,
    network,
    status:             'pending',
    due_by:             due_by || null,
  }).select('id').single()

  if (!dispute) return NextResponse.json({ error: 'Failed to create dispute' }, { status: 500 })

  // Best-effort evidence assembly and response generation
  try {
    const client   = new ShopifyClient(store.shop_domain, store.access_token)
    const evidence = await client.buildEvidence(order_id)
    const response = await generateDisputeResponse(
      evidence, reason_code, network, parseFloat(amount), currency || 'USD'
    )
    await admin.from('disputes').update({
      evidence, generated_response: response, status: 'response_generated',
    }).eq('id', dispute.id)
  } catch (e) {
    console.error('Evidence/generation failed:', e)
  }

  return NextResponse.json({ success: true, dispute_id: dispute.id })
}
