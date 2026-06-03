'use client'
import { useState } from 'react'

const PLANS = [
  {
    key: 'starter', name: 'Starter', price: 99, period: 'mo',
    sub: 'Up to $250k GMV · 20 disputes/month',
    features: ['20 dispute responses/month','All 40 reason codes','Shopify integration','Win rate dashboard','Email support','14-day free trial'],
  },
  {
    key: 'growth', name: 'Growth', price: 199, period: 'mo',
    sub: 'Up to $1M GMV · Unlimited disputes', featured: true,
    features: ['Unlimited dispute responses','All 40 reason codes','Auto-evidence assembly','Fraud pattern detection','Revenue recovery reports','Priority support','14-day free trial'],
  },
  {
    key: 'scale', name: 'Scale', price: 399, period: 'mo',
    sub: 'Up to $5M GMV · Multi-store',
    features: ['Everything in Growth','Multi-store support','API access','Custom reason code rules','Dedicated onboarding','Slack support channel','14-day free trial'],
  },
]

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null)
  const shopId = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('shop_id') || ''
    : ''

  const checkout = async (plan: string) => {
    if (!shopId) { window.location.href = '/'; return }
    setLoading(plan)
    const res  = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, shop_id: shopId }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else setLoading(null)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#f9fafb', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', padding:'60px 24px' }}>
      <div style={{ maxWidth:900, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ fontWeight:800, fontSize:22, letterSpacing:-0.5, marginBottom:16 }}>
            Dispute<span style={{ color:'#16a34a' }}>IQ</span>
          </div>
          <h1 style={{ fontSize:36, fontWeight:900, letterSpacing:-1.5, marginBottom:12 }}>
            Choose your plan
          </h1>
          <p style={{ fontSize:16, color:'#6b7280' }}>
            14-day free trial on all plans. No credit card required to start.
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:18, alignItems:'start' }}>
          {PLANS.map(plan => (
            <div key={plan.key} style={{
              background:'#fff',
              border: plan.featured ? '2px solid #16a34a' : '1px solid #e5e7eb',
              borderRadius:16, padding:28, position:'relative',
            }}>
              {plan.featured && (
                <div style={{ position:'absolute', top:-13, left:'50%', transform:'translateX(-50%)', background:'#16a34a', color:'#fff', padding:'4px 16px', borderRadius:20, fontSize:12, fontWeight:700, whiteSpace:'nowrap' }}>
                  Most popular
                </div>
              )}
              <div style={{ fontSize:14, color:'#6b7280', fontWeight:500, marginBottom:6 }}>{plan.name}</div>
              <div style={{ fontSize:44, fontWeight:900, letterSpacing:-2, marginBottom:2 }}>${plan.price}</div>
              <div style={{ fontSize:13, color:'#6b7280', marginBottom:6 }}>per {plan.period}</div>
              <div style={{ fontSize:12, color:'#9ca3af', marginBottom:22 }}>{plan.sub}</div>
              <ul style={{ listStyle:'none', marginBottom:24 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ fontSize:14, color:'#374151', padding:'7px 0', borderBottom:'1px solid #f3f4f6', display:'flex', gap:8, alignItems:'flex-start' }}>
                    <span style={{ color:'#16a34a', fontWeight:800, flexShrink:0, marginTop:1 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => checkout(plan.key)}
                disabled={loading === plan.key}
                style={{
                  width:'100%', padding:'13px 0', borderRadius:10, fontSize:14, fontWeight:600,
                  cursor: loading === plan.key ? 'not-allowed' : 'pointer', border:'none',
                  background: plan.featured ? '#16a34a' : '#0a0a0a',
                  color:'#fff', opacity: loading === plan.key ? 0.7 : 1,
                }}
              >
                {loading === plan.key ? 'Redirecting...' : 'Start free trial'}
              </button>
            </div>
          ))}
        </div>

        <div style={{ textAlign:'center', marginTop:32, fontSize:13, color:'#9ca3af' }}>
          All plans include a 14-day free trial. No credit card required. Cancel anytime.
        </div>
      </div>
    </div>
  )
}
