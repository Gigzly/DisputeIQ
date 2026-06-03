import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase'
import { ShopifyClient } from '@/lib/shopify'
import { generateDisputeResponse } from '@/lib/generate-response'

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { order_id, amount, currency, reason_code, network, due_by } = await req.json()
  const admin = createSupabaseAdmin()

  // Find store by user email
  const { data: store } = await admin.from('shopify_stores')
    .select('*').eq('owner_email', user.email).single()
  if (!store) return NextResponse.json({ error: 'No store connected' }, { status: 404 })

  // Save dispute
  const { data: dispute } = await admin.from('disputes').insert({
    store_id: store.id,
    shopify_dispute_id: `manual_${Date.now()}`,
    order_id, amount: parseFloat(amount), currency, reason_code, network,
    status: 'pending', due_by: due_by || null,
  }).select('id').single()

  if (!dispute) return NextResponse.json({ error: 'Failed to create dispute' }, { status: 500 })

  // Try to build evidence and generate response
  try {
    const client = new ShopifyClient(store.shop_domain, store.access_token)
    const evidence = await client.buildEvidence(order_id)
    const response = await generateDisputeResponse(evidence, reason_code, network, parseFloat(amount), currency)
    await admin.from('disputes').update({
      evidence, generated_response: response, status: 'response_generated'
    }).eq('id', dispute.id)
  } catch (e) {
    console.error('Evidence/generation failed:', e)
  }

  return NextResponse.json({ success: true, dispute_id: dispute.id })
}
