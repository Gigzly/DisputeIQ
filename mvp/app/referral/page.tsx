'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Referral() {
  const [copied, setCopied]   = useState(false)
  const [refLink, setRefLink] = useState('')

  useEffect(() => {
    // Build referral link from shop domain stored after OAuth
    const shop = localStorage.getItem('disputeiq_shop') || sessionStorage.getItem('disputeiq_shop')
    const ref  = shop ? shop.replace('.myshopify.com', '') : 'friend'
    setRefLink(`https://disputeiq.co/install?ref=${encodeURIComponent(ref)}`)
  }, [])

  const copy = () => {
    navigator.clipboard.writeText(refLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', color: '#111827' }}>
      <nav style={{ background: '#fff', borderBottom: '1px solid #f3f4f6', padding: '0 40px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: 18, textDecoration: 'none', color: '#111827' }}>Dispute<span style={{ color: '#16a34a' }}>IQ</span></Link>
        <Link href="/dashboard" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none' }}>← Dashboard</Link>
      </nav>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '64px 24px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>🤝</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 12 }}>Refer a merchant, get a free month</h1>
          <p style={{ fontSize: 17, color: '#6b7280', lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
            For every merchant you refer who installs DisputeIQ and connects their store, you get one month free on your plan (or €25 credit on the free tier).
          </p>
        </div>

        {/* Referral link */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '28px 32px', marginBottom: 32, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Your referral link</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 9, padding: '11px 14px', fontSize: 13, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'ui-monospace,monospace' }}>
              {refLink || 'Loading…'}
            </div>
            <button onClick={copy}
              style={{ background: copied ? '#16a34a' : '#111827', color: '#fff', border: 'none', borderRadius: 9, padding: '11px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', transition: 'background .15s', flexShrink: 0 }}>
              {copied ? '✓ Copied' : 'Copy link'}
            </button>
          </div>
          <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>Share this link with other Shopify merchants. When they install and connect, your reward is applied automatically.</p>
        </div>

        {/* How it works */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '28px 32px', marginBottom: 32, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 20 }}>How it works</div>
          {[
            { n: '1', title: 'Share your link', desc: 'Send your unique referral link to Shopify merchants — on Twitter, in merchant communities, or directly.' },
            { n: '2', title: 'They install DisputeIQ', desc: 'They click your link, connect their Shopify store, and start their free trial or free plan.' },
            { n: '3', title: 'You get rewarded', desc: 'Once they\'ve been active for 7 days, your account is credited with one free month (paid plans) or €25 credit (free plan).' },
          ].map(step => (
            <div key={step.n} style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14, fontWeight: 800, color: '#15803d' }}>{step.n}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 3 }}>{step.title}</div>
                <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Rewards breakdown */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 16, padding: '24px 28px', marginBottom: 40 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#15803d', marginBottom: 16 }}>Reward per successful referral</div>
          {[
            { plan: 'Free plan',     reward: '€25 credit toward future commission invoices' },
            { plan: 'Starter plan',  reward: '1 month free (€99 value)' },
            { plan: 'Growth plan',   reward: '1 month free (€199 value)' },
            { plan: 'Scale plan',    reward: '1 month free (€399 value)' },
          ].map(row => (
            <div key={row.plan} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #dcfce7', fontSize: 14 }}>
              <span style={{ color: '#166534', fontWeight: 500 }}>{row.plan}</span>
              <span style={{ color: '#15803d', fontWeight: 600 }}>{row.reward}</span>
            </div>
          ))}
          <p style={{ fontSize: 12, color: '#16a34a', marginTop: 12, marginBottom: 0 }}>No cap on referrals. Refer 12 merchants on any paid plan and get a full year free.</p>
        </div>

        {/* Social share nudge */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>Works best in Shopify merchant communities, LinkedIn, and direct message.</p>
          <p style={{ fontSize: 13, color: '#9ca3af' }}>
            Questions? <a href="mailto:conor@disputeiq.co" style={{ color: '#16a34a', textDecoration: 'none', fontWeight: 500 }}>conor@disputeiq.co</a>
          </p>
        </div>
      </div>
    </div>
  )
}
