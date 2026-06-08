import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Visa 10.4 Chargeback: How to Write a Winning Response (2026 Guide)',
  description: 'Visa 10.4 is a card-absent fraud dispute. Here\'s exactly what evidence you need, how CE 3.0 can get an automatic reversal, and a template response.',
}

export default function Visa104Guide() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', color: '#374151' }}>
      <nav style={{ borderBottom: '1px solid #f3f4f6', padding: '0 40px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: 18, textDecoration: 'none', color: '#111827' }}>Dispute<span style={{ color: '#16a34a' }}>IQ</span></Link>
        <Link href="/auth/signup" style={{ background: '#16a34a', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Get started free</Link>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px 80px', lineHeight: 1.75 }}>
        <div style={{ marginBottom: 12 }}>
          <Link href="/blog" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>← All guides</Link>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#eff6ff', color: '#1d4ed8', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 16, border: '1px solid #bfdbfe' }}>
          Visa 10.4 — Card Absent Fraud
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1.2, lineHeight: 1.1, marginBottom: 16, color: '#111827' }}>
          Visa 10.4 Chargeback: How to Write a Winning Response (2026 Guide)
        </h1>
        <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 40 }}>June 2026 · 8 min read</div>

        <p style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 28 }}>
          Visa 10.4 — officially "Card Absent Fraud" — is the most common chargeback code for online merchants. The cardholder claims their card was used without their authorisation. It accounts for around 40% of all Visa disputes filed against e-commerce stores.
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 40 }}>
          The good news: Visa 10.4 disputes are among the most winnable — <strong>if you submit the right evidence</strong>. The average win rate is 52%. Merchants who check CE 3.0 eligibility first win at over 80%. Here's exactly how to approach it.
        </p>

        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 12, color: '#111827' }}>What Visa 10.4 means</h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
          Code 10.4 falls under Visa's "Fraud" category. The cardholder — or their bank — is alleging that the transaction was not authorised. Common triggers:
        </p>
        <ul style={{ paddingLeft: 24, marginBottom: 32 }}>
          {[
            'Genuine fraud: the card number was stolen and used by someone else',
            'Friendly fraud: the cardholder made the purchase but claims they didn\'t',
            'Family fraud: a family member used the card without the main cardholder\'s explicit permission',
            'Buyer\'s remorse: the cardholder regrets the purchase and disputes rather than requesting a return',
          ].map(item => (
            <li key={item} style={{ fontSize: 16, marginBottom: 8, lineHeight: 1.7 }}>{item}</li>
          ))}
        </ul>
        <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 40 }}>
          You can't know which category a given dispute falls into from the reason code alone. Your response strategy is the same regardless.
        </p>

        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 12, color: '#111827' }}>Step 1: Check CE 3.0 eligibility first</h2>

        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '20px 24px', marginBottom: 28 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>⚡</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#15803d', marginBottom: 6 }}>Compelling Evidence 3.0 — automatic reversal pathway</div>
              <p style={{ fontSize: 14, color: '#166534', lineHeight: 1.7, margin: 0 }}>
                If you can show that the same cardholder made at least two prior undisputed transactions with the same card, device IP, and shipping address — Visa will automatically reverse the dispute in your favour without adjudication. This is CE 3.0, and it's only available for Visa 10.4.
              </p>
            </div>
          </div>
        </div>

        <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}><strong>CE 3.0 requirements (all three must be met):</strong></p>
        <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
          {[
            'At least 2 prior undisputed transactions with the same Primary Account Number (PAN)',
            'Both prior transactions used the same device fingerprint / IP address as the disputed transaction',
            'Both prior transactions used the same shipping address as the disputed transaction',
            'Prior transactions occurred between 120 and 365 days before the dispute',
          ].map(item => (
            <li key={item} style={{ fontSize: 16, marginBottom: 8, lineHeight: 1.7 }}>{item}</li>
          ))}
        </ul>
        <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 40 }}>
          Check your order management system for prior orders from the same email, card, and shipping address. If the customer has bought from you before without disputing, you likely have CE 3.0 evidence.
        </p>

        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 12, color: '#111827' }}>Step 2: Assemble your evidence</h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
          Whether or not you have CE 3.0, gather the following for every Visa 10.4 response:
        </p>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', marginBottom: 40 }}>
          {[
            { item: 'Order confirmation with customer name, email, billing and shipping address', required: true, impact: 'Very high' },
            { item: 'AVS (Address Verification System) match confirmation', required: true, impact: 'Very high' },
            { item: 'CVV2/CVC2 match confirmation', required: true, impact: 'High' },
            { item: 'IP address and device fingerprint at time of order', required: true, impact: 'High' },
            { item: 'Carrier tracking showing delivered status (with date and location)', required: true, impact: 'Very high' },
            { item: 'Customer activity: login, product views, wishlist, prior orders', required: false, impact: 'High' },
            { item: 'Screenshots of prior orders from same customer (CE 3.0)', required: false, impact: 'Critical (if eligible)' },
            { item: 'Delivery photo (if carrier provides)', required: false, impact: 'High' },
            { item: 'Customer communications after delivery (if any)', required: false, impact: 'Medium' },
          ].map((row, i, arr) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 120px', padding: '12px 18px', borderBottom: i < arr.length - 1 ? '1px solid #f3f4f6' : 'none', background: '#fff', alignItems: 'start', gap: 12 }}>
              <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>{row.item}</div>
              <div style={{ fontSize: 11, fontWeight: 700, textAlign: 'center', padding: '3px 8px', borderRadius: 20, background: row.required ? '#fef9c3' : '#f3f4f6', color: row.required ? '#854d0e' : '#6b7280' }}>{row.required ? 'Required' : 'Optional'}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: row.impact.startsWith('Very') || row.impact === 'Critical (if eligible)' ? '#15803d' : row.impact === 'High' ? '#374151' : '#9ca3af' }}>{row.impact}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 12, color: '#111827' }}>Step 3: Write your response letter</h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
          Your response letter should be concise, factual, and structured around the evidence. Here's a template:
        </p>

        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px 28px', marginBottom: 40, fontFamily: 'ui-monospace,monospace', fontSize: 13, lineHeight: 1.9, color: '#334155' }}>
          <p style={{ margin: '0 0 12px', fontFamily: 'inherit' }}>Re: Visa dispute — Order [ORDER_ID] — [AMOUNT]</p>
          <p style={{ margin: '0 0 12px', fontFamily: 'inherit' }}>We are responding to the Visa 10.4 dispute filed against transaction [ORDER_ID] dated [DATE].</p>
          <p style={{ margin: '0 0 12px', fontFamily: 'inherit' }}>This transaction was placed by [CUSTOMER_NAME] at [CUSTOMER_EMAIL] using a card with a matching billing address (AVS match: [Y/N], CVV2 match: [Y/N]). The order was placed from IP address [IP_ADDRESS], consistent with the customer's prior purchase history.</p>
          <p style={{ margin: '0 0 12px', fontFamily: 'inherit' }}>The order was fulfilled on [FULFILMENT_DATE] via [CARRIER] with tracking number [TRACKING_NUMBER]. Carrier records confirm delivery on [DELIVERY_DATE] at [DELIVERY_ADDRESS].</p>
          <p style={{ margin: '0 0 12px', fontFamily: 'inherit' }}>[IF CE 3.0: The cardholder has placed [N] prior orders from the same card, shipping address, and device within the past 12 months, none of which were disputed. These are detailed in the enclosed evidence package.]</p>
          <p style={{ margin: '0', fontFamily: 'inherit' }}>We respectfully request that this dispute be resolved in our favour. Supporting documentation is enclosed.</p>
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 12, color: '#111827' }}>Deadlines and submission</h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
          Visa 10.4 disputes have a <strong>30-day response window</strong> from the date of dispute. Do not wait until day 25 — assembling evidence takes time and Shopify Payments processing can add delays.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 40 }}>
          Submit via Shopify Payments → Settings → Payments → Chargebacks → [dispute] → Submit response. Upload your evidence as a single PDF where possible.
        </p>

        <div style={{ background: '#111827', borderRadius: 14, padding: '28px 32px', marginBottom: 48 }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: '#fff', marginBottom: 10 }}>DisputeIQ handles Visa 10.4 automatically</div>
          <p style={{ fontSize: 15, color: '#9ca3af', lineHeight: 1.7, marginBottom: 12 }}>
            When a Visa 10.4 dispute arrives, DisputeIQ checks CE 3.0 eligibility instantly, assembles AVS/CVV/tracking evidence from your order data, and generates a formatted response letter — all in under 60 seconds.
          </p>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, marginBottom: 20 }}>
            Free plan available. 25% commission only on disputes you win.
          </p>
          <Link href="/auth/signup" style={{ background: '#16a34a', color: '#fff', padding: '12px 24px', borderRadius: 9, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
            Start free →
          </Link>
        </div>

        <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Related guides</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/blog/shopify-chargeback-win-rate" style={{ fontSize: 15, color: '#16a34a', textDecoration: 'none', fontWeight: 500 }}>Shopify Chargeback Win Rate Benchmarks: What's Normal? →</Link>
            <Link href="/blog/chargeback-reason-codes-guide" style={{ fontSize: 15, color: '#16a34a', textDecoration: 'none', fontWeight: 500 }}>Chargeback Reason Codes: Complete Guide for Shopify Merchants →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
