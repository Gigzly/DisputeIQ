'use client'
import { useState } from 'react'
import Link from 'next/link'

const SECTIONS = [
  {
    title: 'Understanding payment disputes',
    items: [
      { q: 'What is a chargeback?', a: 'A chargeback is when a customer asks their bank to reverse a payment instead of contacting you directly. The bank pulls the money back from your account immediately and gives you a set number of days to dispute it. If you don\'t respond in time — or respond with the wrong evidence — you lose permanently, plus a dispute fee.' },
      { q: 'What is a reason code?', a: 'Every chargeback has a reason code — a short identifier like "Visa 13.1" or "Mastercard 4853" — that tells you what the cardholder claimed. The reason code dictates exactly what evidence you need. Submitting the wrong evidence, even if you\'re clearly right, is an automatic loss.' },
      { q: 'What is CE 3.0?', a: 'Compelling Evidence 3.0 is a Visa rule that lets you automatically win fraud disputes (Visa 10.4) if you can show the same cardholder made at least 2 prior undisputed purchases on the same card. DisputeIQ detects CE 3.0 eligibility and flags it in your dashboard — it\'s an automatic win when it applies.' },
      { q: 'How long do I have to respond?', a: 'Visa gives you 30 days. Mastercard 45 days. Amex only 20 days. Miss the deadline and you lose automatically. DisputeIQ sends you email alerts 48 hours before each deadline.' },
    ],
  },
  {
    title: 'Why merchants lose disputes',
    items: [
      { q: 'Why do most merchants lose 70% of chargebacks?', a: 'They submit the wrong evidence for the reason code. A Visa 13.1 (not received) needs carrier tracking showing "delivered." A Visa 10.4 (fraud) needs AVS/CVV match codes and ideally 3DS authentication. Submitting a polite letter explaining you shipped the order won\'t win a fraud dispute.' },
      { q: 'Does the wording of my response letter matter?', a: 'Yes, but less than the evidence you attach. The letter should be concise and reference specific evidence — but a well-written letter with no documentation loses. DisputeIQ generates both the letter and the evidence checklist.' },
      { q: 'What if the customer is clearly lying?', a: 'It doesn\'t matter to the adjudicator. What matters is whether you can prove your position with documented evidence. "The customer is lying" is not evidence. A carrier tracking record showing delivery to the billing address is.' },
    ],
  },
  {
    title: 'Using DisputeIQ',
    items: [
      { q: 'How does DisputeIQ detect chargebacks?', a: 'When you connect your Shopify store, we register a webhook. The moment a dispute is created, Shopify notifies us within seconds. We immediately pull your order data, shipping tracking, and transaction details and start generating the response.' },
      { q: 'How long does it take to generate a response?', a: 'Typically 30–60 seconds. We identify the reason code, select the right evidence, and write a formatted response letter. You\'ll get an email alert with a direct link to review it.' },
      { q: 'Do I still submit the response myself?', a: 'Yes — only the merchant can legally submit evidence to the card network. DisputeIQ handles everything except the final click. You review the response in your dashboard and submit via Shopify Payments. It takes under 2 minutes.' },
      { q: 'How does the free plan work?', a: 'On the free plan, there are no monthly fees. We charge 25% commission only on disputes you win. If DisputeIQ recovers €200, we invoice €50. If you lose, you pay nothing. Upgrading to a subscription removes the commission entirely.' },
    ],
  },
  {
    title: 'Security & privacy',
    items: [
      { q: 'What access does DisputeIQ have to my Shopify store?', a: 'Read-only access only. We can read orders, shipping data, customer details for disputed transactions, and dispute notifications. We cannot modify orders, process refunds, access your payment balance, or change anything in your store.' },
      { q: 'Who can see my order data?', a: 'Only DisputeIQ systems process your data. We don\'t share it with third parties, sell it, or use it to train AI models. Order data is stored encrypted and used solely to generate dispute responses.' },
      { q: 'Is DisputeIQ GDPR compliant?', a: 'Yes. DisputeIQ is based in Ireland (EU). We process personal data under legitimate interests. You can request deletion of all your data at any time by emailing conor@disputeiq.co.' },
    ],
  },
]

export default function Help() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f8', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      <nav style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/dashboard" style={{ fontWeight: 800, fontSize: 17, textDecoration: 'none', color: '#111827' }}>
          Dispute<span style={{ color: '#16a34a' }}>IQ</span>
        </Link>
        <Link href="/dashboard" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>← Dashboard</Link>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 64px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.5, marginBottom: 6, color: '#111827' }}>Help centre</h1>
        <p style={{ fontSize: 15, color: '#6b7280', marginBottom: 40 }}>Plain English answers about chargebacks and DisputeIQ.</p>

        {SECTIONS.map(section => (
          <div key={section.title} style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              {section.title}
            </div>
            <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, overflow: 'hidden' }}>
              {section.items.map((item, i) => {
                const key  = `${section.title}-${i}`
                const isOpen = open === key
                return (
                  <div key={i} style={{ borderBottom: i < section.items.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                    <button onClick={() => setOpen(isOpen ? null : key)}
                      style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' as const }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#111827', paddingRight: 16 }}>{item.q}</span>
                      <span style={{ fontSize: 20, color: '#9ca3af', flexShrink: 0, lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.75, padding: '0 20px 18px 20px', paddingRight: 40 }}>
                        {item.a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        <div style={{ background: '#111827', borderRadius: 14, padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 4 }}>Still need help?</div>
            <div style={{ fontSize: 13, color: '#9ca3af' }}>Email Conor directly — we respond within a few hours.</div>
          </div>
          <a href="mailto:conor@disputeiq.co"
            style={{ background: '#16a34a', color: '#fff', padding: '11px 20px', borderRadius: 9, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            conor@disputeiq.co
          </a>
        </div>
      </div>
    </div>
  )
}
