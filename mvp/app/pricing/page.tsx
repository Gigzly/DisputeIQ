'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const PLANS = [
  {
    key: 'free', name: 'Free', monthly: 0, annual: 0,
    sub: 'No monthly fee — pay only when you win',
    popular: false,
    features: ['Unlimited dispute responses', 'All 22 reason codes', 'CE 3.0 detection', 'Email deadline alerts', '48h reminder emails', '25% commission on won disputes only'],
  },
  {
    key: 'starter', name: 'Starter', monthly: 99, annual: 83,
    sub: 'Up to 20 disputes/month · No commission',
    popular: false,
    features: ['20 dispute responses/month', 'All 22 reason codes', 'CE 3.0 detection', 'Auto-submit to Shopify Payments', 'Email deadline alerts', 'CSV export', 'No commission on wins'],
  },
  {
    key: 'growth', name: 'Growth', monthly: 199, annual: 166,
    sub: 'Unlimited disputes · No commission',
    popular: true,
    features: ['Unlimited dispute responses', 'All 22 reason codes', 'CE 3.0 detection', 'Auto-submit to Shopify Payments', '48h deadline reminders', 'CSV export', 'Fraud risk monitoring', 'Priority support', 'No commission on wins'],
  },
  {
    key: 'scale', name: 'Scale', monthly: 399, annual: 332,
    sub: 'Multi-store · Up to $5M GMV',
    popular: false,
    features: ['Everything in Growth', 'Multi-store support', 'API access', 'Dedicated onboarding', 'Slack support', 'Custom reason code rules', 'No commission on wins'],
  },
]

const FAQ = [
  { q: 'How does the free plan work?', a: 'No monthly fee. We charge 25% commission only on disputes you win. If DisputeIQ recovers €200 for you, we invoice €50. If you lose the dispute, you pay nothing. Commission invoices are sent by email within 7 days of marking a dispute won.' },
  { q: 'When does it make sense to upgrade from free?', a: "If you're recovering more than €396/month from won disputes, the Starter plan (€99/mo, no commission) saves you money. Use the calculator below to find your break-even point." },
  { q: 'Do I need a credit card to start?', a: 'No. The free plan and free trials start immediately when you connect your Shopify store. No card required until you choose a paid plan.' },
  { q: 'Does DisputeIQ submit the response for me?', a: 'On Starter, Growth, and Scale plans, we auto-submit to Shopify Payments via their API. On the free plan, we generate the response and open the right page in Shopify Payments — you paste and submit. Either way it takes under 2 minutes.' },
  { q: "What's the difference between annual and monthly?", a: 'Annual billing saves approximately 17%. Billed as one payment per year. You can cancel before renewal for a refund on unused months.' },
  { q: 'Does it work with Stripe and PayPal?', a: 'DisputeIQ generates the evidence and response letter for any payment processor. For Stripe, we open your Stripe dashboard directly to the right dispute page. Stripe auto-submission is on the roadmap.' },
  { q: 'What if I cancel mid-month?', a: 'Monthly plans cancel at the end of the billing period — no partial refunds. Annual plans: contact conor@disputeiq.co for a prorated refund on unused months.' },
]

export default function Pricing() {
  const [annual, setAnnual]         = useState(false)
  const [openFaq, setOpenFaq]       = useState<number | null>(null)
  const [recovery, setRecovery]     = useState(200)
  const [currentPlan, setCurrentPlan] = useState<string | null>(null)
  const [shopId, setShopId]         = useState<string>('')
  const [checkingOut, setCheckingOut] = useState<string | null>(null)

  useEffect(() => {
    const loadPlan = async () => {
      const savedShop = localStorage.getItem('disputeiq_shop') || sessionStorage.getItem('disputeiq_shop')
      if (!savedShop) return
      const res = await fetch(`/api/store?shop=${encodeURIComponent(savedShop)}`)
      if (res.ok) {
        const { store } = await res.json()
        if (store) {
          setCurrentPlan(store.plan || null)
          setShopId(store.id || '')
        }
      }
    }
    loadPlan()
  }, [])

  const commissionCost = recovery * 0.25
  const starterSaving  = commissionCost - 99
  const breakEven      = Math.ceil(99 / 0.25)

  const checkout = async (planKey: string, skipTrial = false) => {
    if (planKey === 'free') { window.location.href = '/auth/signup'; return }
    const key = planKey + (skipTrial ? '_skip' : '_trial')
    setCheckingOut(key)
    const id = shopId || (() => {
      const s = localStorage.getItem('disputeiq_shop') || sessionStorage.getItem('disputeiq_shop')
      return s ? '' : ''
    })()
    if (!id) { window.location.href = '/auth/signup'; return }
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planKey, shop_id: id, annual, skip_trial: skipTrial }),
    })
    const data = await res.json()
    if (data.url) { window.location.href = data.url; return }
    setCheckingOut(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', color: '#111827' }}>
      <nav style={{ background: '#fff', borderBottom: '1px solid #f3f4f6', padding: '0 40px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: 18, textDecoration: 'none', color: '#111827' }}>Dispute<span style={{ color: '#16a34a' }}>IQ</span></Link>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link href="/dashboard" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none' }}>Dashboard</Link>
          <Link href="/auth/signup" style={{ background: '#16a34a', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Start free</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f0fdf4', color: '#15803d', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 20, border: '1px solid #bbf7d0' }}>
            Free tier available — pay 25% only when you win
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: -1.5, marginBottom: 12 }}>Simple, honest pricing</h1>
          <p style={{ fontSize: 16, color: '#6b7280', marginBottom: 28 }}>Start free. Pay only when you win — or upgrade to a flat plan.</p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: '#f3f4f6', borderRadius: 10, padding: '6px 8px' }}>
            <button onClick={() => setAnnual(false)}
              style={{ padding: '7px 18px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', background: !annual ? '#fff' : 'transparent', color: !annual ? '#111827' : '#6b7280', boxShadow: !annual ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
              Monthly
            </button>
            <button onClick={() => setAnnual(true)}
              style={{ padding: '7px 18px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', background: annual ? '#fff' : 'transparent', color: annual ? '#111827' : '#6b7280', boxShadow: annual ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              Annual
              <span style={{ fontSize: 11, background: '#16a34a', color: '#fff', padding: '2px 7px', borderRadius: 20, fontWeight: 700 }}>Save ~17%</span>
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 48, alignItems: 'start' }}>
          {PLANS.map(plan => {
            const price     = plan.key === 'free' ? 0 : (annual ? plan.annual : plan.monthly)
            const isCurrent = currentPlan === plan.key
            const isPopular = plan.popular && !isCurrent

            return (
              <div key={plan.key} style={{
                background: '#fff',
                border: isCurrent ? '2px solid #2563eb' : isPopular ? '2px solid #16a34a' : '1px solid #e5e7eb',
                borderRadius: 16, padding: 24, position: 'relative',
              }}>
                {/* Badge */}
                {isCurrent && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: '#2563eb', color: '#fff', padding: '4px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
                    Current plan
                  </div>
                )}
                {!isCurrent && isPopular && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: '#16a34a', color: '#fff', padding: '4px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
                    Most popular
                  </div>
                )}

                <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 600, marginBottom: 8 }}>{plan.name}</div>

                {plan.key === 'free' ? (
                  <div>
                    <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1.5, marginBottom: 2 }}>€0</div>
                    <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 600, marginBottom: 4 }}>+ 25% commission on wins</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 2 }}>
                      <span style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1.5 }}>€{price}</span>
                      <span style={{ fontSize: 13, color: '#6b7280' }}>/mo</span>
                    </div>
                    {annual && <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 600, marginBottom: 4 }}>Billed €{price * 12}/year</div>}
                  </div>
                )}

                <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 20, lineHeight: 1.4 }}>{plan.sub}</div>

                <ul style={{ listStyle: 'none', marginBottom: 22, padding: 0 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ fontSize: 13, color: '#374151', padding: '5px 0', borderBottom: '1px solid #f3f4f6', display: 'flex', gap: 7, alignItems: 'flex-start', lineHeight: 1.4 }}>
                      <span style={{ color: '#16a34a', fontWeight: 800, flexShrink: 0, marginTop: 1 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>

                {/* Action area */}
                {isCurrent ? (
                  <div style={{ width: '100%', padding: '12px 0', textAlign: 'center', borderRadius: 10, fontSize: 13, fontWeight: 600, background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}>
                    ✓ Your current plan
                  </div>
                ) : plan.key === 'free' ? (
                  <button onClick={() => checkout('free')}
                    style={{ width: '100%', padding: '12px 0', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: 'inherit', background: '#111827', color: '#fff' }}>
                    Get started free
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button
                      onClick={() => checkout(plan.key, false)}
                      disabled={!!checkingOut}
                      style={{ width: '100%', padding: '12px 0', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: checkingOut ? 'default' : 'pointer', border: 'none', fontFamily: 'inherit', background: isPopular ? '#16a34a' : '#374151', color: '#fff', opacity: checkingOut && checkingOut !== plan.key + '_trial' ? 0.6 : 1 }}>
                      {checkingOut === plan.key + '_trial' ? 'Opening…' : 'Start 14-day trial'}
                    </button>
                    <button
                      onClick={() => checkout(plan.key, true)}
                      disabled={!!checkingOut}
                      style={{ width: '100%', padding: '10px 0', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: checkingOut ? 'default' : 'pointer', border: '1.5px solid #e5e7eb', fontFamily: 'inherit', background: '#fff', color: '#374151', opacity: checkingOut && checkingOut !== plan.key + '_skip' ? 0.6 : 1 }}>
                      {checkingOut === plan.key + '_skip' ? 'Opening…' : 'Subscribe now →'}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Break-even calculator */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '32px 36px', marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.3, marginBottom: 6 }}>When should you upgrade from free?</h2>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 28 }}>
            The Starter plan (€99/mo) saves money once you're recovering more than €{breakEven}/month in won disputes.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
                Monthly recovery from won disputes: <span style={{ color: '#16a34a' }}>€{recovery}</span>
              </label>
              <input type="range" min={0} max={2000} step={50} value={recovery}
                onChange={e => setRecovery(Number(e.target.value))}
                style={{ width: '100%', appearance: 'none', height: 4, borderRadius: 2, background: '#e5e7eb', cursor: 'pointer' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                <span>€0</span><span>€2,000</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, minWidth: 320 }}>
              <div style={{ background: '#f7f7f8', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Free plan cost</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#111827' }}>€{Math.round(commissionCost)}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>25% commission</div>
              </div>
              <div style={{ background: starterSaving > 0 ? '#f0fdf4' : '#f7f7f8', border: starterSaving > 0 ? '1px solid #bbf7d0' : 'none', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Starter saves</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: starterSaving > 0 ? '#16a34a' : '#374151' }}>
                  {starterSaving > 0 ? `€${Math.round(starterSaving)}` : `−€${Math.round(Math.abs(starterSaving))}`}
                </div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>vs free plan</div>
              </div>
            </div>
          </div>
          {starterSaving > 0 && (
            <div style={{ marginTop: 20, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#15803d' }}>
              At €{recovery}/month in recovery, upgrading to Starter saves you €{Math.round(starterSaving)}/month (€{Math.round(starterSaving * 12)}/year).
            </div>
          )}
        </div>

        {/* Trust strip */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap', marginBottom: 56, padding: '20px 0', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' }}>
          {['14-day free trial on paid plans', 'No credit card to start', 'Cancel anytime', 'GDPR compliant', 'Irish law governing'].map(item => (
            <div key={item} style={{ fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>{item}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.5, textAlign: 'center', marginBottom: 32 }}>Frequently asked questions</h2>
          {FAQ.map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' as const }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>{faq.q}</span>
                <span style={{ fontSize: 20, color: '#9ca3af', flexShrink: 0, marginLeft: 16 }}>{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, paddingBottom: 18, paddingRight: 24 }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <p style={{ fontSize: 14, color: '#6b7280' }}>
            Questions? Email <a href="mailto:conor@disputeiq.co" style={{ color: '#16a34a', textDecoration: 'none', fontWeight: 600 }}>conor@disputeiq.co</a>
          </p>
        </div>
      </div>
    </div>
  )
}
