import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — DisputeIQ',
  description: 'DisputeIQ terms of service. Free tier commission terms, Irish law governing, limitation of liability.',
}

export default function Terms() {
  const updated = 'June 2026'
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', color: '#374151' }}>
      <nav style={{ borderBottom: '1px solid #f3f4f6', padding: '0 40px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: 18, textDecoration: 'none', color: '#111827' }}>Dispute<span style={{ color: '#16a34a' }}>IQ</span></Link>
        <Link href="/auth/login" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none' }}>Dashboard →</Link>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px 80px', lineHeight: 1.75 }}>
        <h1 style={{ fontSize: 34, fontWeight: 900, letterSpacing: -1, marginBottom: 6, color: '#111827' }}>Terms of Service</h1>
        <p style={{ color: '#9ca3af', marginBottom: 48, fontSize: 14 }}>Last updated: {updated}</p>

        {[
          {
            title: '1. Service description',
            body: 'DisputeIQ provides AI-assisted chargeback dispute response generation for Shopify merchants. The service detects chargebacks via Shopify webhook, assembles evidence from your order data, and generates draft dispute responses formatted for the relevant card network reason code.',
          },
          {
            title: '2. Pricing tiers',
            body: 'DisputeIQ offers the following plans:',
            list: [
              'Free — €0/month. A commission of 25% is charged on the recovered amount for each dispute you win. No commission is charged on lost disputes. Commission invoices are issued by email within 24 hours of a dispute being marked won.',
              'Starter — €99/month (or €83/month billed annually). No commission. Up to 20 dispute responses per month.',
              'Growth — €199/month (or €166/month billed annually). No commission. Unlimited dispute responses.',
              'Scale — €399/month (or €332/month billed annually). No commission. Multi-store support.',
            ],
            footer: 'All prices exclude VAT where applicable. Annual plans are billed as a single payment at the start of the billing period.',
          },
          {
            title: '3. Free tier commission terms',
            body: 'By using the free tier, you agree to the following commission terms: (a) A commission of 25% of the recovered dispute amount is payable to DisputeIQ for each dispute that is marked as "won" in your dashboard. (b) Commission invoices are issued by email and payable within 14 days. (c) Failure to pay commissions may result in suspension of the free tier. (d) Upgrading to a paid plan cancels future commissions on new disputes — commissions already invoiced remain payable.',
          },
          {
            title: '4. Not legal or financial advice',
            body: 'DisputeIQ is a software tool, not a legal service. Nothing produced by DisputeIQ constitutes legal advice. Dispute outcomes depend on many factors outside our control including card network policies, available evidence, adjudicator decisions, and cardholder behaviour. We make no guarantee of dispute outcomes.',
          },
          {
            title: '5. Shopify data access',
            body: 'By connecting your Shopify store, you grant DisputeIQ read-only access to your store data as described in our Privacy Policy. You confirm that you have the authority to grant this access and that using DisputeIQ does not violate your Shopify agreement or applicable law.',
          },
          {
            title: '6. Your responsibilities',
            body: 'You are responsible for: (a) reviewing all generated dispute responses before submitting them; (b) ensuring the evidence submitted is accurate; (c) submitting responses before card network deadlines; (d) maintaining accurate records of dispute outcomes. DisputeIQ generates drafts — you remain responsible for all submissions made to card networks.',
          },
          {
            title: '7. Limitation of liability',
            body: 'To the maximum extent permitted by Irish law: DisputeIQ\'s total liability for any claim arising from use of the service shall not exceed the amounts paid by you in the 12 months preceding the claim (or €99 for free-tier users). DisputeIQ is not liable for: lost revenue from disputes that are not won, missed deadlines where you had access to the platform, decisions made by card network adjudicators, or indirect or consequential losses.',
          },
          {
            title: '8. Termination',
            body: 'You may cancel your subscription at any time via your account settings or by emailing conor@disputeiq.co. Cancellation takes effect at the end of the current billing period. On cancellation, your data is retained for 30 days and then deleted (subject to legal retention requirements). DisputeIQ may terminate accounts that abuse the service or fail to pay outstanding commissions.',
          },
          {
            title: '9. Changes to these terms',
            body: 'We may update these terms from time to time. We\'ll notify you by email at least 14 days before material changes take effect. Continuing to use the service after the effective date constitutes acceptance of the updated terms.',
          },
          {
            title: '10. Governing law',
            body: 'These terms are governed by the laws of Ireland. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the Irish courts.',
          },
          {
            title: '11. Contact',
            body: 'Conor Roche · Dublin, Ireland · conor@disputeiq.co',
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 10 }}>{section.title}</h2>
            {section.body && <p style={{ fontSize: 15, marginBottom: section.list ? 10 : 0 }}>{section.body}</p>}
            {section.list && (
              <ul style={{ paddingLeft: 22, marginBottom: (section as any).footer ? 10 : 0 }}>
                {section.list.map((item, j) => (
                  <li key={j} style={{ fontSize: 15, marginBottom: 6 }}>{item}</li>
                ))}
              </ul>
            )}
            {(section as any).footer && <p style={{ fontSize: 15 }}>{(section as any).footer}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
