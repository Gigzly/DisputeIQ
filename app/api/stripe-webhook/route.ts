import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createSupabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PLAN_MAP: Record<string, string> = {
  [process.env.STRIPE_DIQ_STARTER!]: 'starter',
  [process.env.STRIPE_DIQ_GROWTH!]:  'growth',
  [process.env.STRIPE_DIQ_SCALE!]:   'scale',
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body, sig, process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
  }

  const admin = createSupabaseAdmin()

  switch (event.type) {

    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const shopId  = session.metadata?.shop_id
      const priceId = session.metadata?.price_id
      if (!shopId || !priceId) break

      const plan = PLAN_MAP[priceId] || 'growth'
      await admin.from('shopify_stores').update({
        plan,
        stripe_customer_id:     session.customer as string,
        stripe_subscription_id: session.subscription as string,
      }).eq('id', shopId)

      // Alert founder
      await notifyFounder(`New DisputeIQ ${plan} customer — shop ID: ${shopId}`)
      break
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice
      // Subscription renewal — log it, no action needed for DisputeIQ (no credit resets)
      console.log(`[stripe] Invoice paid: ${invoice.id} — subscription renewed`)
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await admin.from('shopify_stores').update({
        plan:                   'cancelled',
        stripe_subscription_id: null,
      }).eq('stripe_subscription_id', sub.id)
      break
    }

    case 'customer.subscription.updated': {
      const sub     = event.data.object as Stripe.Subscription
      const priceId = sub.items.data[0]?.price.id
      const plan    = PLAN_MAP[priceId] || 'growth'
      await admin.from('shopify_stores').update({ plan })
        .eq('stripe_subscription_id', sub.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}

async function notifyFounder(message: string) {
  if (!process.env.RESEND_API_KEY || !process.env.FOUNDER_EMAIL) return
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from:    'DisputeIQ Alerts <alerts@disputeiq.co>',
      to:      process.env.FOUNDER_EMAIL,
      subject: '💰 New DisputeIQ customer',
      html:    `<p>${message}</p><p>Check Stripe dashboard for details.</p>`,
    }),
  }).catch(console.error)
}
