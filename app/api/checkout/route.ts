import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createSupabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PRICES: Record<string, string> = {
  starter: process.env.STRIPE_DIQ_STARTER!,
  growth:  process.env.STRIPE_DIQ_GROWTH!,
  scale:   process.env.STRIPE_DIQ_SCALE!,
}

const schema = z.object({
  plan:    z.enum(['starter', 'growth', 'scale']),
  shop_id: z.string().uuid(),
})

export async function POST(req: NextRequest) {
  const body   = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const admin = createSupabaseAdmin()
  const { data: store } = await admin
    .from('shopify_stores')
    .select('shop_domain, owner_email')
    .eq('id', parsed.data.shop_id)
    .single()

  if (!store) {
    return NextResponse.json({ error: 'Store not found' }, { status: 404 })
  }

  const priceId = PRICES[parsed.data.plan]
  const session = await stripe.checkout.sessions.create({
    mode:                 'subscription',
    payment_method_types: ['card'],
    line_items:           [{ price: priceId, quantity: 1 }],
    success_url:          `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=1&shop=${store.shop_domain}`,
    cancel_url:           `${process.env.NEXT_PUBLIC_APP_URL}/pricing?shop=${store.shop_domain}`,
    customer_email:       store.owner_email || undefined,
    subscription_data:    { trial_period_days: 14 },
    metadata: {
      product:  'disputeiq',
      shop_id:  parsed.data.shop_id,
      price_id: priceId,
    },
  })

  return NextResponse.json({ url: session.url })
}
