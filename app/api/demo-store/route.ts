import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const admin = createSupabaseAdmin()

  const { data: existing } = await admin
    .from('shopify_stores').select('id,shop_domain').eq('owner_email', user.email).single()
  if (existing) return NextResponse.json({ store: existing, demo: true })

  const demoShop = `demo-${user.id.slice(0,8)}.myshopify.com`
  const { data: store } = await admin
    .from('shopify_stores')
    .insert({ shop_domain:demoShop, access_token:'demo_token', owner_email:user.email, plan:'trial', win_rate:0.28, total_disputes:3, total_recovered:220 })
    .select('id,shop_domain').single()

  if (store) {
    await admin.from('disputes').insert([
      {
        store_id:store.id, shopify_dispute_id:'demo_001', order_id:'5001234567',
        amount:149.99, currency:'USD', reason:'Item not received', reason_code:'13.1', network:'visa',
        status:'response_generated', due_by:new Date(Date.now()+5*24*60*60*1000).toISOString(),
        generated_response:{
          summary:'Customer claims item was not received. Tracking shows successful delivery. Strong case for reversal.',
          evidence_strength:'high', win_probability:0.74,
          response_letter:'Dear Dispute Resolution Team,\n\nWe dispute chargeback for Order #5001234567, $149.99, Visa 13.1 (Merchandise Not Received).\n\nTracking number 1Z999AA10123456784 confirms DELIVERED to the billing address on the expected date. The customer did not contact us prior to filing this dispute.\n\nWe request reversal.\n\nRegards,\nDisputeIQ on behalf of merchant',
          key_arguments:['Carrier tracking confirms delivery','No prior contact from customer','AVS match on transaction'],
          recommended_action:'Submit with tracking screenshot. Due in 5 days.',
          evidence_checklist:[
            {item:'Carrier tracking showing Delivered',available:true,required:true,importance:'critical'},
            {item:'Customer communication log',available:true,required:false,importance:'medium'},
            {item:'Signature confirmation',available:false,required:false,importance:'low'},
          ]
        }
      },
      {
        store_id:store.id, shopify_dispute_id:'demo_002', order_id:'5001234568',
        amount:89.00, currency:'USD', reason:'Fraud - card absent', reason_code:'10.4', network:'visa',
        status:'response_generated', due_by:new Date(Date.now()+2*24*60*60*1000).toISOString(),
        generated_response:{
          summary:'Fraud dispute with AVS match and prior purchase history. Moderate win probability — act quickly, due in 2 days.',
          evidence_strength:'medium', win_probability:0.52,
          response_letter:'Dear Dispute Resolution Team,\n\nWe dispute chargeback for Order #5001234568, $89.00, Visa 10.4.\n\nFull AVS match, CVV match, and 3 prior orders from this card with no disputes. IP geolocation matches billing city.\n\nWe request reversal.\n\nRegards,\nDisputeIQ on behalf of merchant',
          key_arguments:['Full AVS match','CVV match confirmed','3 prior orders from same card'],
          recommended_action:'URGENT — due in 2 days. Submit immediately with order history screenshot.',
          evidence_checklist:[
            {item:'AVS result code',available:true,required:true,importance:'critical'},
            {item:'CVV result',available:true,required:true,importance:'high'},
            {item:'Prior purchase history',available:true,required:false,importance:'high'},
            {item:'3DS authentication',available:false,required:false,importance:'critical'},
          ]
        }
      },
      {
        store_id:store.id, shopify_dispute_id:'demo_003', order_id:'5001234560',
        amount:220.00, currency:'USD', reason:'Item not as described', reason_code:'4853', network:'mastercard',
        status:'won', outcome:'won', due_by:null,
        generated_response:{
          summary:'Won — product listing matched description. $220 recovered.',
          evidence_strength:'high', win_probability:0.82,
          response_letter:'', key_arguments:[], recommended_action:'Already won.',
          evidence_checklist:[]
        }
      }
    ])
  }

  return NextResponse.json({ store, demo: true })
}
