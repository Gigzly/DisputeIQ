import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chargeback Prevention for Shopify Merchants',
  description: 'Stop chargebacks before they happen. Learn the order signals that predict disputes and how DisputeIQ flags high-risk orders automatically.',
}

const RISK_SIGNALS = [
  { signal: 'Billing address ≠ shipping address', risk: 'High', tip: 'Flag orders where billing and shipping countries differ. Legitimate customers rarely ship to different countries than their card\'s billing address.' },
  { signal: 'First-time customer, high-value order', risk: 'High', tip: 'Fraudsters test stolen cards with small purchases first. A brand-new customer placing a $500+ order has no purchase history to validate against.' },
  { signal: 'Guest checkout (no account)', risk: 'Medium', tip: 'Accounts create friction for fraudsters. Guest checkout removes that friction. Not always fraud, but worth noting on high-value orders.' },
  { signal: 'Order placed at unusual hours', risk: 'Medium', tip: 'Orders placed at 2–5am in the customer\'s local timezone are worth a second look, especially combined with other risk factors.' },
  { signal: 'Multiple orders in short window', risk: 'High', tip: 'Multiple orders from different "customers" to the same shipping address is a strong fraud signal — card testing or reshipping fraud.' },
  { signal: 'Express shipping on first order', risk: 'Medium', tip: 'Fraudsters want the goods fast before the stolen card is cancelled. Express shipping on a first order from a new customer is a yellow flag.' },
]

const PREVENTION_TACTICS = [
  {
    title: 'Add tracking to every order',
    desc: 'Carrier tracking showing delivered status is the single strongest piece of evidence for "not received" disputes (Visa 13.1, MC 4855). No tracking = near-certain loss if disputed.',
    impact: 'Very high',
  },
  {
    title: 'Require signature on high-value orders',
    desc: 'For orders over $200–300, signature confirmation eliminates "not received" disputes entirely. The cost ($3–5) is trivial vs the chargeback cost ($50–100 in fees alone).',
    impact: 'High',
  },
  {
    title: 'Send delivery confirmation emails',
    desc: 'When your carrier marks an order delivered, send the customer an email with the tracking link. This creates a paper trail showing they were notified — kills "I never got it" claims.',
    impact: 'High',
  },
  {
    title: 'Clear refund policy at checkout',
    desc: 'Force customers to check a box accepting your refund policy. Screenshot the policy page. This wins "credit not processed" disputes (Visa 13.6, Amex C02) when the refund wasn\'t owed.',
    impact: 'High',
  },
  {
    title: 'Use 3D Secure for fraud-prone cards',
    desc: '3DS authentication is an automatic win for card-absent fraud disputes (Visa 10.4, MC 4837, Amex FR2). Shopify Payments supports 3DS — enable it for orders flagged as high-risk.',
    impact: 'Very high',
  },
  {
    title: 'Log all customer communications',
    desc: 'Every email, chat, and support ticket should be logged with timestamps. A customer who emailed after the expected delivery date without complaint is implicitly acknowledging receipt.',
    impact: 'Medium',
  },
]

export default function Prevention() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', color: '#111827' }}>
      <nav style={{ borderBottom: '1px solid #f3f4f6', padding: '0 40px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: 18, textDecoration: 'none', color: '#111827' }}>
          Dispute<span style={{ color: '#16a34a' }}>IQ</span>
        </Link>
        <Link href="/auth/signup" style={{ background: '#16a34a', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
          Get started free
        </Link>
      </nav>

      <div style={{ maxWidth: 840, margin: '0 auto', padding: '56px 24px 80px' }}>
        <div style={{ marginBottom: 8 }}>
          <Link href="/" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>← Home</Link>
        </div>

        <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 16, marginTop: 16 }}>
          Chargeback prevention for Shopify merchants
        </h1>
        <p style={{ fontSize: 17, color: '#374151', lineHeight: 1.8, marginBottom: 48, maxWidth: 640 }}>
          Winning disputes after they happen is good. Preventing them is better. Here's how to reduce your chargeback rate — and what to do when you can't avoid them.
        </p>

        {/* Risk signals */}
        <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, marginBottom: 8 }}>
          Order signals that predict chargebacks
        </h2>
        <p style={{ fontSize: 15, color: '#6b7280', marginBottom: 28, lineHeight: 1.7 }}>
          DisputeIQ scores every new order for chargeback risk. These are the factors that matter most:
        </p>
        <div style={{ marginBottom: 52 }}>
          {RISK_SIGNALS.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, padding: '20px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ flexShrink: 0, marginTop: 3 }}>
                <span style={{
                  fontSize: 11, padding: '3px 9px', borderRadius: 20, fontWeight: 700,
                  background: s.risk === 'High' ? '#fef2f2' : '#fffbeb',
                  color: s.risk === 'High' ? '#dc2626' : '#92400e',
                }}>
                  {s.risk} risk
                </span>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: '#111827' }}>{s.signal}</div>
                <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65 }}>{s.tip}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Prevention tactics */}
        <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, marginBottom: 8 }}>
          What actually prevents chargebacks
        </h2>
        <p style={{ fontSize: 15, color: '#6b7280', marginBottom: 32, lineHeight: 1.7 }}>
          In order of impact. These aren't theoretical — they're what separates merchants with 0.2% chargeback rates from those with 2%+.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 56 }}>
          {PREVENTION_TACTICS.map((t, i) => (
            <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#111827', flex: 1, paddingRight: 12 }}>{t.title}</div>
                <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 700, flexShrink: 0,
                  background: t.impact === 'Very high' ? '#f0fdf4' : t.impact === 'High' ? '#eff6ff' : '#f3f4f6',
                  color: t.impact === 'Very high' ? '#15803d' : t.impact === 'High' ? '#1e40af' : '#6b7280',
                }}>
                  {t.impact} impact
                </span>
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.65 }}>{t.desc}</div>
            </div>
          ))}
        </div>

        {/* When you can't prevent */}
        <div style={{ background: '#111827', borderRadius: 16, padding: '36px 40px' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: -0.3 }}>
            When a chargeback gets through anyway
          </div>
          <p style={{ fontSize: 15, color: '#9ca3af', lineHeight: 1.75, marginBottom: 28 }}>
            Even the best prevention can't stop all chargebacks. When one arrives, the difference between winning and losing is submitting the right evidence for the right reason code, before the deadline. DisputeIQ does that automatically.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/auth/signup" style={{ background: '#16a34a', color: '#fff', padding: '13px 24px', borderRadius: 9, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
              Start free trial →
            </Link>
            <Link href="/blog/how-to-win-shopify-chargebacks" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '13px 24px', borderRadius: 9, fontSize: 14, fontWeight: 500, textDecoration: 'none', display: 'inline-block' }}>
              How to win chargebacks →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
