'use client'
import { useState } from 'react'
import Link from 'next/link'

const PLANS = [
  {
    key: 'starter', name: 'Starter', monthly: 99, annual: 79,
    sub: 'Up to $250k GMV · 20 disputes/month',
    features: ['20 dispute responses/month', 'All 22 reason codes mapped', 'Shopify integration', 'Win rate dashboard', 'Email alerts on new disputes', '14-day free trial'],
  },
  {
    key: 'growth', name: 'Growth', monthly: 199, annual: 159, featured: true,
    sub: 'Up to $1M GMV · Unlimited disputes',
    features: ['Unlimited dispute responses', 'All 22 reason codes', 'CE3.0 detection', 'Auto-evidence assembly', '48h deadline reminders', 'CSV export', 'Priority support', '14-day free trial'],
  },
  {
    key: 'scale', name: 'Scale', monthly: 399, annual: 319,
    sub: 'Up to $5M GMV · Multi-store',
    features: ['Everything in Growth', 'Multi-store support', 'Fraud pattern detection', 'Revenue recovery reports', 'API access', 'Slack support', 'Dedicated onboarding', '14-day free trial'],
  },
]

const FAQ = [
  { q: 'Do I need a credit card to start?', a: 'No. The 14-day free trial starts immediately when you connect your Shopify store. No card required until you choose a paid plan.' },
  { q: 'Does DisputeIQ submit the response for me?', a: 'We auto-submit to Shopify Payments via their API (Growth/Scale). For Stripe merchants, we generate the letter and open the right page directly. You can also copy and submit manually — it takes about 2 minutes.' },
  { q: 'What\'s the difference between annual and monthly?', a: 'Annual billing saves 20% and is billed as one payment per year. You can cancel before renewal for a full refund of unused months.' },
  { q: 'What if I have fewer than 20 disputes per month?', a: 'Starter is likely the right fit. If you never hit the limit, you only pay for what you need. Most merchants on Starter upgrade within 3 months as they start winning more disputes and see the ROI.' },
  { q: 'Does it work with Stripe?', a: 'Yes. DisputeIQ generates the evidence and response letter. For Stripe disputes, we open your Stripe dashboard directly to the right dispute page. Stripe auto-submission is on the roadmap for Q3 2026.' },
  { q: 'What if I cancel mid-month?', a: 'Monthly plans cancel at the end of the billing period. Annual plans can be cancelled for a prorated refund on unused months. No lock-in.' },
]

export default function Pricing() {
  const [annual, setAnnual]    = useState(false)
  const [loading, setLoading]  = useState<string | null>(null)
  const [openFaq, setOpenFaq]  = useState<number | null>(null)

  const checkout = async (plan: string) => {
    setLoading(plan)
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const shopId = urlParams.get('shop_id')
      if (!shopId) { window.location.href = '/dashboard'; return }
      const res = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, shop_id: shopId, annual }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (e) { console.error(e) }
    setLoading(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', color: '#111827' }}>
      {/* Nav */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #f3f4f6', padding: '0 40px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: 18, textDecoration: 'none', color: '#111827' }}>
          Dispute<span style={{ color: '#16a34a' }}>IQ</span>
        </Link>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link href="/auth/login" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none' }}>Sign in</Link>
          <Link href="/auth/signup" style={{ background: '#16a34a', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Start free trial</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: -1.5, marginBottom: 12 }}>Simple, honest pricing</h1>
          <p style={{ fontSize: 16, color: '#6b7280', marginBottom: 28 }}>14-day free trial on all plans. Most merchants recover the plan cost in the first month.</p>

          {/* Annual/monthly toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: '#f3f4f6', borderRadius: 10, padding: '6px 8px' }}>
            <button onClick={() => setAnnual(false)}
              style={{ padding: '7px 18px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', background: !annual ? '#fff' : 'transparent', color: !annual ? '#111827' : '#6b7280', boxShadow: !annual ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
              Monthly
            </button>
            <button onClick={() => setAnnual(true)}
              style={{ padding: '7px 18px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', background: annual ? '#fff' : 'transparent', color: annual ? '#111827' : '#6b7280', boxShadow: annual ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              Annual
              <span style={{ fontSize: 11, background: '#16a34a', color: '#fff', padding: '2px 7px', borderRadius: 20, fontWeight: 700 }}>Save 20%</span>
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, marginBottom: 48, alignItems: 'start' }}>
          {PLANS.map(plan => {
            const price = annual ? plan.annual : plan.monthly
            return (
              <div key={plan.key} style={{ background: '#fff', border: plan.featured ? '2px solid #16a34a' : '1px solid #e5e7eb', borderRadius: 16, padding: 28, position: 'relative' }}>
                {plan.featured && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: '#16a34a', color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
                    Most popular
                  </div>
                )}
                <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 600, marginBottom: 8 }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 2 }}>
                  <span style={{ fontSize: 42, fontWeight: 900, letterSpacing: -2 }}>${price}</span>
                  <span style={{ fontSize: 14, color: '#6b7280' }}>/mo</span>
                </div>
                {annual && (
                  <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 600, marginBottom: 4 }}>
                    Billed ${price * 12}/year · save ${(plan.monthly - plan.annual) * 12}/yr
                  </div>
                )}
                <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 24 }}>{plan.sub}</div>
                <ul style={{ listStyle: 'none', marginBottom: 24, padding: 0 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ fontSize: 14, color: '#374151', padding: '7px 0', borderBottom: '1px solid #f3f4f6', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ color: '#16a34a', fontWeight: 800, flexShrink: 0 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => checkout(plan.key)} disabled={loading === plan.key}
                  style={{ width: '100%', padding: '13px 0', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: loading === plan.key ? 'not-allowed' : 'pointer', border: 'none', fontFamily: 'inherit', background: plan.featured ? '#16a34a' : '#111827', color: '#fff', opacity: loading === plan.key ? 0.7 : 1 }}>
                  {loading === plan.key ? 'Redirecting…' : 'Start free trial'}
                </button>
              </div>
            )
          })}
        </div>

        {/* Trust signals */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', marginBottom: 56, padding: '20px 0', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' }}>
          {['14-day free trial', 'No credit card required', 'Cancel anytime', 'GDPR compliant', 'Read-only Shopify access'].map(item => (
            <div key={item} style={{ fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span> {item}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.5, textAlign: 'center', marginBottom: 32 }}>Frequently asked questions</h2>
          {FAQ.map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' as const }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>{faq.q}</span>
                <span style={{ fontSize: 18, color: '#9ca3af', flexShrink: 0, marginLeft: 16 }}>{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, paddingBottom: 18, paddingRight: 24 }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
            Questions? <a href="mailto:hello@disputeiq.co" style={{ color: '#16a34a', textDecoration: 'none', fontWeight: 600 }}>Email us</a> or read the{' '}
            <Link href="/blog" style={{ color: '#16a34a', textDecoration: 'none', fontWeight: 600 }}>chargeback guides</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
