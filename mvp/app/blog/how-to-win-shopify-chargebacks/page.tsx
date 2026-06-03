import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Win a Shopify Chargeback: Step-by-Step Guide',
  description: 'The merchants who consistently win chargebacks do one thing differently: they match their evidence to the reason code. Here\'s how to do it for every major code.',
}

export default function HowToWinShopifyChargebacks() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', color: '#111827' }}>
      <nav style={{ borderBottom: '1px solid #e5e7eb', padding: '0 40px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: 18, textDecoration: 'none', color: '#111827' }}>Dispute<span style={{ color: '#16a34a' }}>IQ</span></Link>
        <Link href="/auth/signup" style={{ background: '#16a34a', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Get started free</Link>
      </nav>

      <article style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px 80px' }}>
        <div style={{ marginBottom: 8 }}>
          <Link href="/blog" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>← Blog</Link>
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, lineHeight: 1.1, marginBottom: 16, marginTop: 16, color: '#111827' }}>
          How to Win a Shopify Chargeback: Step-by-Step Guide
        </h1>

        <div style={{ fontSize: 14, color: '#9ca3af', marginBottom: 40 }}>
          June 2026 · 6 min read
        </div>

        <p style={{ fontSize: 17, color: '#374151', lineHeight: 1.8, marginBottom: 28, fontWeight: 500 }}>
          The merchants who consistently win chargebacks do one thing differently from everyone else: they match their evidence exactly to what the reason code requires. The card network adjudicator is looking for specific documents in a specific order. Give them what they want and you win. Miss it and you lose — regardless of how strong your actual case is.
        </p>

        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 28 }}>
          This guide walks through the winning process for every common reason code type on Shopify.
        </p>

        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 16, marginTop: 40, color: '#111827' }}>
          Step 1: Read the reason code before you do anything else
        </h2>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 28 }}>
          The most common mistake merchants make is treating all chargebacks the same. They submit the same generic letter for a "not received" dispute that they'd use for a "fraud" dispute — and lose both. Each reason code has different evidence requirements and a different legal threshold.
        </p>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 28 }}>
          Before you write a single word of your response, check which network and which reason code you're dealing with. This tells you exactly what you need to submit.
        </p>

        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 24px', marginBottom: 28 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: '#111827' }}>The 4 most common reason code types for Shopify merchants:</div>
          {[
            ['Not received (Visa 13.1, MC 4855, Amex C08)', 'Requires proof of delivery — carrier tracking is your main weapon'],
            ['Fraud / not authorised (Visa 10.4, MC 4837, Amex FR2)', 'Requires authorisation proof — AVS, CVV, IP, 3DS if you have it'],
            ['Not as described (Visa 13.3, MC 4853, Amex C31)', 'Requires product listing match — screenshot your listing at time of sale'],
            ['Credit not processed (Visa 13.6, Amex C02)', 'Requires refund policy — show the refund was not owed or already processed'],
          ].map(([code, desc], i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: i < 3 ? '1px solid #e5e7eb' : 'none' }}>
              <span style={{ color: '#16a34a', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>→</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#111827', marginBottom: 2 }}>{code}</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 16, marginTop: 40, color: '#111827' }}>
          Step 2: Assemble your evidence in order of strength
        </h2>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>
          Adjudicators read hundreds of responses. They scan, not read. Put your strongest evidence first. The hierarchy for most dispute types:
        </p>
        <ol style={{ paddingLeft: 24, marginBottom: 28 }}>
          {[
            '3DS authentication confirmation (if you have it — this is an automatic win for fraud disputes)',
            'Carrier tracking showing "Delivered" with timestamp and address (for not received)',
            'AVS and CVV match codes from the original authorisation (for fraud disputes)',
            'Prior purchase history from the same card (proves the card was used before without complaint)',
            'Customer communications — especially any messages after the delivery date without complaint about not receiving it',
            'Product listing screenshots from the time of purchase (for not as described)',
            'Your return/refund policy accepted at checkout',
          ].map((item, i) => (
            <li key={i} style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, marginBottom: 8 }}>{item}</li>
          ))}
        </ol>

        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 16, marginTop: 40, color: '#111827' }}>
          Step 3: Write a structured response letter
        </h2>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>
          Your response letter should follow a strict structure. Adjudicators are not interested in your story — they're checking boxes. Your letter should do the same:
        </p>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '20px 24px', marginBottom: 28 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: '#15803d' }}>Winning letter structure:</div>
          {[
            ['Opening statement', 'State exactly what you\'re disputing: order number, amount, reason code, network. One sentence.'],
            ['Evidence presented', 'Reference each piece of evidence specifically. "Tracking number 1Z999AA1 shows delivered to [address] on [date]." Name the document, state the fact.'],
            ['Why this defeats the claim', 'One or two sentences explaining why your evidence proves the cardholder\'s claim is incorrect.'],
            ['Request for reversal', 'End with a clear, professional request for the chargeback to be reversed.'],
          ].map(([title, desc], i) => (
            <div key={i} style={{ marginBottom: i < 3 ? 14 : 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#111827', marginBottom: 3 }}>{i + 1}. {title}</div>
              <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 28 }}>
          Keep it under 350 words. Brevity signals confidence. A 1,200-word letter reads as desperation and buries your key evidence.
        </p>

        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 16, marginTop: 40, color: '#111827' }}>
          Step 4: Submit before the deadline (this cannot be overstated)
        </h2>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 28 }}>
          Visa gives you 30 days. Mastercard gives you 45 days. Amex gives you just 20 days. Miss the deadline and you automatically lose, regardless of how strong your case is. The adjudicator will not read a single word you submitted.
        </p>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 28 }}>
          Most merchants who lose chargebacks lose them because they didn't see the notification, got distracted, or couldn't find where to submit in Shopify's admin panel. The dispute was winnable — they just didn't submit in time.
        </p>

        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 16, marginTop: 40, color: '#111827' }}>
          The shortcut: let DisputeIQ do steps 1–3 for you
        </h2>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>
          DisputeIQ connects to your Shopify store and does steps 1–3 automatically for every chargeback:
        </p>
        <ul style={{ paddingLeft: 24, marginBottom: 28 }}>
          {[
            'Detects the dispute via webhook the moment it arrives',
            'Reads the reason code and looks up the exact evidence requirements',
            'Assembles your order data, shipping tracking, and customer communications',
            'Generates a formatted response letter in the correct structure for that card network',
            'Emails you a link so you can review and submit in under 2 minutes',
          ].map((item, i) => (
            <li key={i} style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, marginBottom: 8 }}>{item}</li>
          ))}
        </ul>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 36 }}>
          The merchants using DisputeIQ see win rates around 60–65% vs the industry average of 30–35%. The difference isn't luck — it's submitting the right evidence for the right reason code, every time, before the deadline.
        </p>

        <div style={{ background: '#111827', borderRadius: 16, padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 10, letterSpacing: -0.3 }}>Stop losing winnable chargebacks</div>
          <p style={{ fontSize: 15, color: '#9ca3af', marginBottom: 24, lineHeight: 1.6 }}>Connect your Shopify store in 2 minutes. 14-day free trial.</p>
          <Link href="/auth/signup" style={{ background: '#16a34a', color: '#fff', padding: '13px 28px', borderRadius: 9, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
            Get started free →
          </Link>
        </div>
      </article>
    </div>
  )
}
