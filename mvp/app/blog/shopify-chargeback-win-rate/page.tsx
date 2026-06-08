import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shopify Chargeback Win Rate Benchmarks: What\'s Normal in 2026?',
  description: 'The average Shopify chargeback win rate is 30–35%. Merchants using automated evidence assembly reach 60–65%. Here\'s what drives the difference.',
}

export default function WinRateBenchmarks() {
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

        <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1.2, lineHeight: 1.1, marginBottom: 16, color: '#111827' }}>
          Shopify Chargeback Win Rate Benchmarks: What's Normal in 2026?
        </h1>
        <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 40 }}>June 2026 · 6 min read</div>

        <p style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 28, color: '#374151' }}>
          Most Shopify merchants don't know their chargeback win rate. When they find out, they're usually surprised — either it's lower than expected, or they realise they've been leaving recoverable revenue on the table.
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 40, color: '#374151' }}>
          This guide covers industry benchmarks, what drives the gap between a 30% and a 65% win rate, and how to find out where you actually stand.
        </p>

        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 12, color: '#111827' }}>Industry average: 30–35%</h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
          Visa's own data shows merchants winning roughly 32% of disputed transactions on average. Mastercard and Amex publish similar figures. The recurring theme across all networks: merchants lose not because their case is weak, but because they submit the wrong evidence or miss the deadline entirely.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 40 }}>
          Among merchants using automated evidence assembly tools — where the system pulls order data, tracking records, and customer communications automatically — win rates cluster between 58% and 67%. The difference isn't luck. It's process.
        </p>

        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14, padding: '24px 28px', marginBottom: 40 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Win rate benchmarks by approach</div>
          {[
            { label: 'Manual, no template',         rate: '22–28%', color: '#dc2626' },
            { label: 'Manual, with template',       rate: '30–38%', color: '#d97706' },
            { label: 'Basic chargeback software',   rate: '40–50%', color: '#d97706' },
            { label: 'Automated evidence assembly', rate: '58–67%', color: '#16a34a' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #dcfce7', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: '#374151' }}>{row.label}</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: row.color }}>{row.rate}</span>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 12, color: '#111827' }}>Win rates by reason code</h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>
          The reason code determines what evidence you need. Merchants who match their evidence to the specific requirements of the code win at twice the rate of those who submit generic documentation.
        </p>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', marginBottom: 40 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '90px 120px 1fr 140px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', padding: '10px 20px' }}>
            {['Code', 'Network', 'Dispute type', 'Avg win rate'].map(h => (
              <div key={h} style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
            ))}
          </div>
          {[
            { code: '10.4', network: 'Visa',       type: 'Fraud (card absent)',     rate: '52%', note: 'CE3.0 eligible' },
            { code: '13.1', network: 'Visa',       type: 'Item not received',       rate: '68%', note: '' },
            { code: '13.3', network: 'Visa',       type: 'Not as described',        rate: '44%', note: '' },
            { code: '13.6', network: 'Visa',       type: 'Credit not processed',    rate: '61%', note: '' },
            { code: '4853', network: 'Mastercard', type: 'Not as described',        rate: '59%', note: '' },
            { code: '4855', network: 'Mastercard', type: 'Goods not provided',      rate: '65%', note: '' },
            { code: 'C08',  network: 'Amex',       type: 'Goods not received',      rate: '61%', note: '' },
          ].map((row, i, arr) => (
            <div key={row.code} style={{ display: 'grid', gridTemplateColumns: '90px 120px 1fr 140px', padding: '12px 20px', borderBottom: i < arr.length - 1 ? '1px solid #f3f4f6' : 'none', background: '#fff', alignItems: 'center' }}>
              <div style={{ fontFamily: 'ui-monospace,monospace', fontSize: 13, fontWeight: 700, color: '#374151' }}>{row.code}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>{row.network}</div>
              <div style={{ fontSize: 13, color: '#374151' }}>{row.type}{row.note && <span style={{ marginLeft: 8, fontSize: 11, background: '#f0fdf4', color: '#15803d', padding: '2px 7px', borderRadius: 20, fontWeight: 600 }}>{row.note}</span>}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#16a34a' }}>{row.rate}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 12, color: '#111827' }}>The five factors that predict win rate</h2>

        {[
          { n: '1', title: 'Tracking proof submitted (or not)', body: 'For not-received disputes, tracking showing delivery is decisive. Merchants without tracking information lose 78% of the time. With tracking that shows "delivered," they win 71% of the time. Signature confirmation pushes that to over 80%.' },
          { n: '2', title: 'Response time', body: 'Card networks set strict deadlines: Visa and Mastercard typically allow 30–45 days, Amex 20 days. Merchants who respond in the first 7 days win at higher rates than those who respond near the deadline — likely because early responses reflect merchants with organised evidence, not last-minute scrambles.' },
          { n: '3', title: 'Evidence matched to the specific reason code', body: 'Each reason code has specific requirements. A response to a Visa 13.1 (not received) needs different evidence than a response to a Visa 13.3 (not as described). Submitting generic documentation, or evidence appropriate to a different code, halves your win rate.' },
          { n: '4', title: 'CE 3.0 eligibility (Visa 10.4 only)', body: "Visa's Compelling Evidence 3.0 programme allows merchants to automatically reverse certain fraud disputes by proving a non-disputed transaction history with the same card and device. Merchants eligible for CE 3.0 win 80%+ of Visa 10.4 disputes. Most don't know to check." },
          { n: '5', title: 'Customer communication records', body: "An email thread showing the customer received the order, asked a question, or never raised a complaint before filing — is often the difference between a win and a loss on 'not as described' disputes." },
        ].map(s => (
          <div key={s.n} style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{s.n}. {s.title}</h3>
            <p style={{ fontSize: 16, lineHeight: 1.8 }}>{s.body}</p>
          </div>
        ))}

        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 12, color: '#111827' }}>How to find your actual win rate</h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
          Shopify Payments shows dispute outcomes under <strong>Settings → Payments → Chargebacks</strong>. Export to CSV and calculate: won / (won + lost). Ignore pending disputes in the denominator.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 40 }}>
          If your win rate is below 40%, the most likely culprits are: no tracking on some orders, slow response times, or submitting evidence that doesn't match the reason code. All three are fixable.
        </p>

        <div style={{ background: '#111827', borderRadius: 14, padding: '28px 32px', marginBottom: 48 }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: '#fff', marginBottom: 10 }}>Track and improve your win rate automatically</div>
          <p style={{ fontSize: 15, color: '#9ca3af', lineHeight: 1.7, marginBottom: 20 }}>
            DisputeIQ monitors your win rate by network and reason code, assembles the right evidence for every dispute, and shows you exactly where you're leaving money on the table.
          </p>
          <Link href="/auth/signup" style={{ background: '#16a34a', color: '#fff', padding: '12px 24px', borderRadius: 9, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
            Start free — no credit card →
          </Link>
        </div>

        <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Related guides</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/blog/visa-10-4-chargeback-response" style={{ fontSize: 15, color: '#16a34a', textDecoration: 'none', fontWeight: 500 }}>Visa 10.4 Chargebacks: How to Write a Winning Response →</Link>
            <Link href="/blog/chargeback-reason-codes-guide" style={{ fontSize: 15, color: '#16a34a', textDecoration: 'none', fontWeight: 500 }}>Chargeback Reason Codes: Complete Guide for Shopify Merchants →</Link>
            <Link href="/blog/how-to-win-shopify-chargebacks" style={{ fontSize: 15, color: '#16a34a', textDecoration: 'none', fontWeight: 500 }}>How to Win a Shopify Chargeback: Step-by-Step →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
