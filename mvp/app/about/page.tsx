import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About DisputeIQ — Conor Roche, Dublin',
  description: 'DisputeIQ was built after a friend lost €23k in winnable chargebacks. Built by Conor Roche in Dublin.',
}

export default function About() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', color: '#111827' }}>
      <nav style={{ borderBottom: '1px solid #f3f4f6', padding: '0 40px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: 18, textDecoration: 'none', color: '#111827' }}>Dispute<span style={{ color: '#16a34a' }}>IQ</span></Link>
        <Link href="/auth/signup" style={{ background: '#16a34a', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Get started free</Link>
      </nav>

      <article style={{ maxWidth: 680, margin: '0 auto', padding: '64px 24px 80px' }}>
        <div style={{ marginBottom: 8 }}>
          <Link href="/" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>← Home</Link>
        </div>

        <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 20, marginTop: 16 }}>
          Why I built DisputeIQ
        </h1>

        <p style={{ fontSize: 17, color: '#374151', lineHeight: 1.8, marginBottom: 24, fontWeight: 500 }}>
          A friend of mine runs a Shopify store in Dublin — home goods, doing well, about €800k GMV. In 2023 he lost €23,000 in chargebacks. Not because the chargebacks were legitimate. Because he didn't know what evidence to submit, didn't have time to research it, and missed three deadlines entirely.
        </p>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>
          Every one of those disputes was winnable. The tracking showed delivered. The customers had prior orders. Two of them had even sent emails after the expected delivery date — implying receipt — before filing the chargeback. He just didn't know how to use any of that, or in what format, or that reason codes even mattered.
        </p>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>
          I spent a weekend going through Visa's operating regulations, Mastercard's chargeback guide, and Amex's dispute procedures. The evidence requirements are completely different for each reason code. Visa 13.1 (not received) needs carrier tracking. Visa 10.4 (fraud) needs AVS/CVV match codes and ideally 3DS authentication. Most merchants submit the same generic letter for everything and lose everything.
        </p>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>
          I built a tool to automate the research and the response generation. Then I started sharing it with other merchants. The win rates went from 30% to 60%+. I turned it into a product.
        </p>

        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14, padding: '24px 28px', margin: '40px 0' }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: '#16a34a', letterSpacing: -1, marginBottom: 6 }}>€23,000</div>
          <div style={{ fontSize: 15, color: '#15803d', lineHeight: 1.6 }}>
            Lost by a Dublin merchant in one year — in disputes that were winnable. That's what started this.
          </div>
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 16, marginTop: 44 }}>
          What DisputeIQ actually does
        </h2>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>
          It connects to your Shopify store via read-only OAuth. When a chargeback arrives, it reads the reason code, pulls your order data and shipping tracking, assembles the correct evidence for that specific reason code and card network, and generates a formatted response letter. You get an email alert. You review and submit. The whole review process takes under 2 minutes.
        </p>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>
          It also detects Compelling Evidence 3.0 eligibility — a Visa rule that can get fraud disputes (10.4) reversed automatically if the cardholder has prior undisputed transactions on the same card. Most merchants don't know this exists.
        </p>

        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 16, marginTop: 44 }}>
          Free tier
        </h2>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>
          The free plan has no monthly fee. We charge 25% commission on disputes you win — so if DisputeIQ recovers €200, we take €50. If you lose, you pay nothing. This aligns our incentives: we only make money when you win. Merchants who prefer flat pricing can upgrade to a subscription plan.
        </p>

        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 16, marginTop: 44 }}>
          Get in touch
        </h2>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 32 }}>
          I'm Conor. I'm in Dublin. If you have a question, a dispute you're not sure about, or feedback on how DisputeIQ works — email me directly. I read every email.
        </p>

        <div style={{ background: '#111827', borderRadius: 16, padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Conor Roche</div>
            <div style={{ fontSize: 13, color: '#9ca3af' }}>Dublin, Ireland · Founder, DisputeIQ</div>
          </div>
          <a href="mailto:conor@disputeiq.co"
            style={{ background: '#16a34a', color: '#fff', padding: '12px 22px', borderRadius: 9, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            conor@disputeiq.co
          </a>
        </div>
      </article>
    </div>
  )
}
