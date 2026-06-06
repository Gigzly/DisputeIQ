import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chargeback Prevention for Shopify Merchants',
  description: 'Stop chargebacks before they happen. Risk scoring, high-risk order detection, and prevention tips for Shopify merchants.',
}

const TIPS = [
  { icon: '📦', title: 'Add tracking to every order', impact: 'Very high', desc: 'Carrier tracking showing "Delivered" is the strongest evidence for not-received disputes (Visa 13.1, MC 4855). No tracking = near-certain loss if disputed.' },
  { icon: '✍️', title: 'Require signature on high-value orders', impact: 'High', desc: 'For orders over €200, signature confirmation eliminates not-received disputes entirely. The €4–6 cost is trivial vs the €50+ dispute fee.' },
  { icon: '📧', title: 'Send delivery confirmation emails', impact: 'High', desc: 'When your carrier marks an order delivered, email the customer with the tracking link. This creates a paper trail that\'s powerful evidence in disputes.' },
  { icon: '🔒', title: 'Use 3D Secure (required under PSD2)', impact: 'Very high', desc: '3DS authentication is an automatic win for fraud disputes (Visa 10.4, MC 4837). Under EU PSD2, 3DS is mandatory for most e-commerce — make sure it\'s enabled.' },
  { icon: '📋', title: 'Show refund policy at checkout', impact: 'High', desc: 'Force customers to accept your refund policy at checkout. Screenshot it. This wins "credit not processed" disputes (Visa 13.6, Amex C02) when a refund wasn\'t owed.' },
  { icon: '💬', title: 'Log all customer communications', impact: 'Medium', desc: 'Every email and chat should be timestamped and logged. A customer who emailed after delivery without complaint is implicitly acknowledging receipt.' },
]

export default function Prevention() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', color: '#111827' }}>
      <nav style={{ borderBottom: '1px solid #f3f4f6', padding: '0 40px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: 18, textDecoration: 'none', color: '#111827' }}>Dispute<span style={{ color: '#16a34a' }}>IQ</span></Link>
        <Link href="/auth/signup" style={{ background: '#16a34a', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Get started free</Link>
      </nav>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '56px 24px 80px' }}>
        <div style={{ marginBottom: 8 }}>
          <Link href="/" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>← Home</Link>
        </div>

        <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 16, marginTop: 16 }}>
          Chargeback prevention
        </h1>
        <p style={{ fontSize: 17, color: '#374151', lineHeight: 1.8, marginBottom: 48, maxWidth: 640 }}>
          Winning disputes after they happen is good. Preventing them is better. DisputeIQ monitors every order for chargeback risk and alerts you to high-risk patterns before they become disputes.
        </p>

        {/* Monitoring status */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14, padding: '20px 24px', marginBottom: 48, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 12, height: 12, background: '#16a34a', borderRadius: '50%', flexShrink: 0, boxShadow: '0 0 0 4px rgba(22,163,74,0.2)' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#15803d' }}>Order monitoring active</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
              Every new order is scored for chargeback risk. High-risk orders and card testing bursts trigger immediate alerts.
            </div>
          </div>
        </div>

        {/* Risk signals */}
        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 8 }}>What we monitor</h2>
        <p style={{ fontSize: 15, color: '#6b7280', marginBottom: 28, lineHeight: 1.7 }}>
          DisputeIQ scores every incoming order against these signals. A score ≥60 triggers a high-risk alert. Three high-risk orders in 24 hours triggers a card testing alert.
        </p>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: 14, overflow: 'hidden', marginBottom: 56 }}>
          {[
            { signal: 'Billing and shipping countries differ',     risk: 'High', score: '+20' },
            { signal: 'First-time customer on a high-value order', risk: 'High', score: '+25' },
            { signal: 'Guest checkout (no account)',               risk: 'Medium', score: '+20' },
            { signal: 'Order total exceeds €500',                  risk: 'Medium', score: '+10' },
            { signal: '3+ high-risk orders in 24h',               risk: 'Critical', score: 'Alert' },
            { signal: 'Repeat customer with 3+ prior orders',     risk: 'Low',  score: '−10' },
          ].map((row, i, arr) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 60px', padding: '14px 20px', borderBottom: i < arr.length - 1 ? '1px solid #f3f4f6' : 'none', background: '#fff', alignItems: 'center' }}>
              <div style={{ fontSize: 14, color: '#374151' }}>{row.signal}</div>
              <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, fontWeight: 600, justifySelf: 'start',
                background: row.risk === 'Critical' ? '#fef2f2' : row.risk === 'High' ? '#fef9c3' : row.risk === 'Low' ? '#f0fdf4' : '#f3f4f6',
                color: row.risk === 'Critical' ? '#dc2626' : row.risk === 'High' ? '#854d0e' : row.risk === 'Low' ? '#15803d' : '#374151',
              }}>{row.risk}</span>
              <div style={{ fontSize: 13, fontWeight: 700, color: row.score.startsWith('−') ? '#16a34a' : row.score === 'Alert' ? '#dc2626' : '#374151', textAlign: 'right' }}>{row.score}</div>
            </div>
          ))}
        </div>

        {/* Prevention tips */}
        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 8 }}>Prevention tactics that actually work</h2>
        <p style={{ fontSize: 15, color: '#6b7280', marginBottom: 32, lineHeight: 1.7 }}>Ranked by impact. These separate merchants with 0.2% chargeback rates from those with 2%+.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 56 }}>
          {TIPS.map((tip, i) => (
            <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{tip.icon}</span>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{tip.title}</div>
                </div>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 700, flexShrink: 0, marginLeft: 8,
                  background: tip.impact === 'Very high' ? '#f0fdf4' : '#eff6ff',
                  color: tip.impact === 'Very high' ? '#15803d' : '#1e40af',
                }}>{tip.impact}</span>
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.65 }}>{tip.desc}</div>
            </div>
          ))}
        </div>

        {/* Community insight */}
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 14, padding: '24px 28px', marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>From the community</div>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.75, marginBottom: 16, fontStyle: 'italic' }}>
            "Adding signature confirmation to orders over €150 cut our chargeback rate in half within three months. It felt expensive at first — it's not. One prevented chargeback covers the cost of 10 signatures."
          </p>
          <div style={{ fontSize: 13, color: '#6b7280' }}>— Emerson Wong, Shopify merchant, €1.1M GMV</div>
        </div>

        <div style={{ background: '#111827', borderRadius: 16, padding: '36px 40px' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 12 }}>When prevention isn't enough</div>
          <p style={{ fontSize: 15, color: '#9ca3af', lineHeight: 1.7, marginBottom: 28 }}>
            Even the best prevention can't stop all chargebacks. When one gets through, DisputeIQ detects it automatically and generates the correct response — matched to the exact reason code — before you even see the email.
          </p>
          <Link href="/auth/signup" style={{ background: '#16a34a', color: '#fff', padding: '13px 28px', borderRadius: 9, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
            Start free →
          </Link>
        </div>
      </div>
    </div>
  )
}
