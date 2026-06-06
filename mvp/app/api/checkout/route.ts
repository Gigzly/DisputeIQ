import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://dispute-iq-wcev.vercel.app'

const PRICES: Record<string, string | undefined> = {
  starter: process.env.STRIPE_DIQ_STARTER,
  growth:  process.env.STRIPE_DIQ_GROWTH,
  scale:   process.env.STRIPE_DIQ_SCALE,
}

const schema = z.object({
  plan:    z.enum(['starter', 'growth', 'scale']),
  shop_id: z.string().uuid(),
  annual:  z.boolean().optional(),
})

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const plan = body.plan as string

  // Free plan — no payment needed
  if (plan === 'free') {
    return NextResponse.json({ url: `${APP_URL}/auth/signup?plan=free` })
  }

  // Stripe not configured — redirect to signup instead of crashing
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ url: `${APP_URL}/auth/signup?plan=${plan || 'growth'}` })
  }

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
  // Price ID not configured — redirect to signup
  if (!priceId) {
    return NextResponse.json({ url: `${APP_URL}/auth/signup?plan=${parsed.data.plan}` })
  }

  try {
    const Stripe  = (await import('stripe')).default
    const stripe  = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const session = await stripe.checkout.sessions.create({
      mode:                 'subscription',
      payment_method_types: ['card'],
      line_items:           [{ price: priceId, quantity: 1 }],
      success_url:          `${APP_URL}/dashboard?upgraded=1&shop=${store.shop_domain}`,
      cancel_url:           `${APP_URL}/pricing`,
      customer_email:       store.owner_email || undefined,
      subscription_data:    { trial_period_days: 14 },
      metadata: {
        product:  'disputeiq',
        shop_id:  parsed.data.shop_id,
        price_id: priceId,
      },
    })
    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error('Stripe checkout error:', e)
    return NextResponse.json({ url: `${APP_URL}/auth/signup?plan=${parsed.data.plan}` })
  }
}
