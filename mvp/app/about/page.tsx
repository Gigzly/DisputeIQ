import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About DisputeIQ — Why We Built This',
  description: 'DisputeIQ was built by a Shopify merchant who lost $14,000 in winnable chargebacks in one year. Here\'s the story.',
}

export default function About() {
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

      <article style={{ maxWidth: 680, margin: '0 auto', padding: '64px 24px 80px' }}>
        <div style={{ marginBottom: 8 }}>
          <Link href="/" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>← Home</Link>
        </div>

        <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 20, marginTop: 16, color: '#111827' }}>
          Why we built DisputeIQ
        </h1>

        <p style={{ fontSize: 17, color: '#374151', lineHeight: 1.8, marginBottom: 24, fontWeight: 500 }}>
          In 2023, I lost $14,000 in chargebacks that I should have won. Not because my cases were weak — because I submitted the wrong evidence for the wrong reason codes. I was treating every chargeback the same, and the card networks were penalising me for it.
        </p>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>
          After the third consecutive month of the same mistake, I sat down and read every card network's dispute resolution guidelines. All 400 pages of Visa's operating regulations. Mastercard's chargeback guide. Amex's dispute procedures. What I found was that winning a chargeback isn't about having the best argument — it's about matching your evidence exactly to what the adjudicator is looking for, reason code by reason code.
        </p>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>
          I built a spreadsheet. Then a script. Then I started sharing it with other Shopify merchants who were having the same problem. Within three months, the merchants using my system were winning 60%+ of their disputes instead of 30%.
        </p>

        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14, padding: '24px 28px', margin: '36px 0' }}>
          <div style={{ fontSize: 38, fontWeight: 900, color: '#16a34a', letterSpacing: -1, marginBottom: 4 }}>$14,000</div>
          <div style={{ fontSize: 15, color: '#15803d', lineHeight: 1.6 }}>
            in chargebacks lost in a single year — before I understood the evidence requirements. That year became the reason DisputeIQ exists.
          </div>
        </div>

        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>
          DisputeIQ is that system, productised. It connects to your Shopify store, monitors for chargebacks, reads the specific reason code and card network requirements, assembles the right evidence from your order data, and generates a formatted response letter — all before you've had your morning coffee.
        </p>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>
          You still submit through your payment processor. We can't do that for you — legally, only the merchant can submit evidence. But we make the submission take two minutes instead of two hours, and we make sure what you submit is actually what the adjudicator needs to see.
        </p>

        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 16, marginTop: 40, color: '#111827' }}>
          What we believe
        </h2>
        {[
          ['Most chargebacks are winnable', 'The average merchant wins 30% of their disputes. With the right evidence matched to the right reason code, that becomes 60%+. The disputes aren\'t harder — the evidence is just wrong.'],
          ['Merchants are losing time, not just money', 'The average chargeback response takes 2-3 hours to research, write, and submit. Multiply that by 10 disputes a month and you\'ve lost a day of work. We cut that to 10 minutes total.'],
          ['The card networks are predictable', 'Visa\'s adjudicators are following a checklist. We\'ve mapped that checklist for every major reason code. Give them what they\'re looking for, in the order they\'re looking for it, and you win.'],
        ].map(([title, body], i) => (
          <div key={i} style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#111827', marginBottom: 8 }}>{title}</div>
            <div style={{ fontSize: 15, color: '#374151', lineHeight: 1.7 }}>{body}</div>
          </div>
        ))}

        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 16, marginTop: 40, color: '#111827' }}>
          How we handle your data
        </h2>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>
          We request read-only access to your Shopify store. We can see your orders, shipping data, and dispute notifications. We cannot modify your store, process payments, or access your funds. Your data is used only to generate dispute responses and is never sold or shared.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 36 }}>
          {['Read-only Shopify access', 'GDPR compliant', 'Data encrypted in transit', 'No data sold or shared'].map((item, i) => (
            <div key={i} style={{ fontSize: 13, padding: '6px 14px', borderRadius: 20, background: '#f3f4f6', color: '#374151', fontWeight: 500 }}>
              ✓ {item}
            </div>
          ))}
        </div>

        <div style={{ background: '#111827', borderRadius: 16, padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 10, letterSpacing: -0.3 }}>
            Stop losing winnable chargebacks
          </div>
          <p style={{ fontSize: 15, color: '#9ca3af', marginBottom: 24, lineHeight: 1.6 }}>
            Connect your Shopify store in 2 minutes. 14-day free trial.
          </p>
          <Link href="/auth/signup" style={{ background: '#16a34a', color: '#fff', padding: '13px 28px', borderRadius: 9, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
            Get started free →
          </Link>
        </div>
      </article>
    </div>
  )
}
