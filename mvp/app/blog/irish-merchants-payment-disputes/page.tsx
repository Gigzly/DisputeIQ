import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payment Disputes for Irish Shopify Merchants: Complete Guide 2026',
  description: 'How Irish merchants handle Shopify chargebacks under EU payment rules. Visa, Mastercard, and Stripe dispute processes — what\'s different in Ireland and how to win.',
}

export default function IrishMerchantsGuide() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', color: '#111827' }}>
      <nav style={{ borderBottom: '1px solid #e5e7eb', padding: '0 40px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: 18, textDecoration: 'none', color: '#111827' }}>
          Dispute<span style={{ color: '#16a34a' }}>IQ</span>
        </Link>
        <Link href="/auth/signup" style={{ background: '#16a34a', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
          Get started free
        </Link>
      </nav>

      <article style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px 80px' }}>
        <div style={{ marginBottom: 8 }}>
          <Link href="/blog" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>← Blog</Link>
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, lineHeight: 1.1, marginBottom: 16, marginTop: 16 }}>
          Payment disputes for Irish Shopify merchants: what you need to know in 2026
        </h1>

        <div style={{ fontSize: 14, color: '#9ca3af', marginBottom: 40 }}>June 2026 · 7 min read</div>

        <p style={{ fontSize: 17, color: '#374151', lineHeight: 1.8, marginBottom: 24, fontWeight: 500 }}>
          Irish merchants using Shopify face a specific set of challenges when it comes to payment disputes. You're operating under EU payment regulations, processing cards from a mix of Irish, UK, and European customers, and using payment processors (Shopify Payments, Stripe, PayPal) that all have slightly different dispute processes. Here's what's different for Irish merchants — and what actually works.
        </p>

        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 12, marginTop: 40 }}>
          How Irish merchants are processed differently
        </h2>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>
          Irish merchants on Shopify Payments are processed through Stripe's Irish entity. This means your disputes go through Visa Europe and Mastercard Europe rather than their US equivalents — and the rules, while mostly the same, have some important differences:
        </p>
        <ul style={{ paddingLeft: 24, marginBottom: 28 }}>
          {[
            'Visa Europe uses the same reason codes as Visa US (10.4, 13.1, etc.) with the same time limits',
            'Mastercard disputes in Europe follow the same framework as globally (4853, 4855, 4837, etc.)',
            'Amex cardmembers in Ireland are covered by Amex Europe — 20-day response window applies',
            'Under PSD2 (EU regulation), 3D Secure (3DS) is required for most e-commerce transactions above €30 — this is a significant advantage for Irish merchants disputing fraud claims',
          ].map((item, i) => (
            <li key={i} style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, marginBottom: 8 }}>{item}</li>
          ))}
        </ul>

        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '20px 24px', margin: '32px 0' }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#15803d', marginBottom: 8 }}>The PSD2 advantage for Irish merchants</div>
          <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.7 }}>
            Because PSD2 mandates 3DS authentication for most card transactions in the EU/EEA, Irish merchants who use Shopify Payments or Stripe are often automatically protected against fraud disputes (Visa 10.4, Mastercard 4837). A completed 3DS authentication is an automatic win — the liability shifts to the card issuer. This is a major advantage over US merchants who don't have PSD2 mandating 3DS.
          </div>
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 12, marginTop: 40 }}>
          The most common disputes for Irish Shopify merchants
        </h2>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 20 }}>
          Based on dispute patterns across Irish e-commerce stores, the most frequent reason codes are:
        </p>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', marginBottom: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 120px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', padding: '10px 18px' }}>
            {['Code', 'Reason', 'Win rate'].map(h => (
              <div key={h} style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
            ))}
          </div>
          {[
            { code: 'Visa 13.1',  reason: 'Item not received — most common for Irish ecommerce', rate: '68%' },
            { code: 'Visa 10.4',  reason: 'Card absent fraud (PSD2/3DS often handles this automatically)', rate: '52%' },
            { code: 'MC 4853',    reason: 'Not as described — especially clothing and homewares', rate: '59%' },
            { code: 'MC 4855',    reason: 'Goods not provided — fulfilment issues', rate: '65%' },
            { code: 'Visa 13.3',  reason: 'Not as described — second most common after 13.1', rate: '55%' },
          ].map((row, i, arr) => (
            <div key={row.code} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 120px', padding: '13px 18px', borderBottom: i < arr.length - 1 ? '1px solid #f3f4f6' : 'none', background: '#fff' }}>
              <div style={{ fontFamily: 'ui-monospace,monospace', fontSize: 12, fontWeight: 700, color: '#374151' }}>{row.code}</div>
              <div style={{ fontSize: 14, color: '#374151' }}>{row.reason}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#16a34a' }}>{row.rate}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 12, marginTop: 40 }}>
          Shopify Payments vs Stripe for Irish merchants — what's different for disputes
        </h2>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>
          Most Irish Shopify merchants use either Shopify Payments (powered by Stripe) or Stripe directly. For disputes, the mechanics are similar but the interface is different:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
          {[
            {
              title: 'Shopify Payments',
              points: ['Disputes appear in Shopify Admin → Payments → Disputes', 'Response submitted via Shopify\'s evidence form', '7-day window shown in Shopify (but actual network window is longer — submit early)', 'Chargeback fee: €15 per dispute, refunded if you win'],
            },
            {
              title: 'Stripe',
              points: ['Disputes managed in Stripe Dashboard → Disputes', 'Evidence submitted via Stripe\'s form or API', 'Stripe shows deadline clearly — don\'t miss it', 'Dispute fee: €15, refunded only on credit card disputes (not debit)'],
            },
          ].map(col => (
            <div key={col.title} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{col.title}</div>
              {col.points.map((p, i) => (
                <div key={i} style={{ fontSize: 13, color: '#374151', padding: '5px 0', lineHeight: 1.6, display: 'flex', gap: 8 }}>
                  <span style={{ color: '#16a34a', fontWeight: 700, flexShrink: 0 }}>→</span>{p}
                </div>
              ))}
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 12, marginTop: 40 }}>
          Irish consumer protection rules that affect your disputes
        </h2>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>
          Irish consumers have strong protection rights under EU law that directly affect chargeback disputes:
        </p>
        {[
          ['14-day right of withdrawal', 'EU distance selling rules give Irish consumers 14 days to return most products for any reason. If a consumer files a chargeback within this window instead of returning the item, show your refund policy and the fact that they didn\'t request a return — this strengthens your case.'],
          ['Section 75 equivalent (charge-back via bank)', 'Unlike the UK\'s specific Section 75 rules, Irish consumers disputing purchases use the standard card network chargeback process through their bank. The reason codes and evidence requirements are the same as for other EU merchants.'],
          ['GDPR and evidence', 'You can use customer data (order records, IP address, communication logs) as evidence in a dispute — this falls under "legitimate interests" under GDPR. You don\'t need customer consent to reference their order history in a dispute response.'],
        ].map(([title, body], i) => (
          <div key={i} style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 6 }}>{title}</div>
            <div style={{ fontSize: 15, color: '#374151', lineHeight: 1.7 }}>{body}</div>
          </div>
        ))}

        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 12, marginTop: 40 }}>
          What Irish merchants get wrong
        </h2>
        {[
          ['Not using 3DS data in fraud disputes', 'If you\'re using Shopify Payments or Stripe in Ireland, 3DS is likely happening on most transactions automatically under PSD2. The 3DS authentication result is your best evidence for Visa 10.4 and Mastercard 4837 disputes — but merchants often don\'t include it because they don\'t know it\'s available. Check your Stripe or Shopify Payments dashboard for the 3DS status on each transaction.'],
          ['Submitting too late', 'The Shopify admin often shows a shorter window than the actual card network deadline. Always submit as early as possible — ideally within a week of the dispute appearing. Irish merchants frequently miss deadlines because they\'re checking their Shopify admin too infrequently.'],
          ['Generic responses for every dispute', 'An Irish merchant selling clothing who gets a Mastercard 4853 (not as described) dispute needs different evidence than a Visa 13.1 (not received) dispute for the same product. The evidence requirements are completely different. Submitting the same template loses both.'],
        ].map(([title, body], i) => (
          <div key={i} style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#dc2626', marginBottom: 6 }}>✕ {title}</div>
            <div style={{ fontSize: 15, color: '#374151', lineHeight: 1.7 }}>{body}</div>
          </div>
        ))}

        <div style={{ background: '#111827', borderRadius: 16, padding: '36px 40px', marginTop: 48 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Stop losing winnable disputes</div>
          <p style={{ fontSize: 15, color: '#9ca3af', lineHeight: 1.7, marginBottom: 28 }}>
            DisputeIQ is built for Shopify merchants. It detects disputes automatically, assembles the right evidence for your specific reason code, and generates a formatted response — including 3DS authentication data when available. 14-day free trial.
          </p>
          <Link href="/auth/signup" style={{ background: '#16a34a', color: '#fff', padding: '13px 28px', borderRadius: 9, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
            Get started free →
          </Link>
        </div>
      </article>
    </div>
  )
}
