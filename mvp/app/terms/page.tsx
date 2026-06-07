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
        <Link href="/dashboard" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none' }}>Dashboard →</Link>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px 80px', lineHeight: 1.75 }}>
        <h1 style={{ fontSize: 34, fontWeight: 900, letterSpacing: -1, marginBottom: 6, color: '#111827' }}>Terms of Service</h1>
        <p style={{ color: '#9ca3af', marginBottom: 48, fontSize: 14 }}>Last updated: {updated}</p>

        {[
          {
            title: '1. Service description',
            body: 'DisputeIQ provides AI-assisted chargeback dispute response generation for Shopify merchants. The service detects chargebacks via Shopify webhook, assembles evidence from your order data, and generates draft dispute responses formatted for the relevant card network reason code. DisputeIQ is operated by Conor Roche, Dublin, Ireland.',
          },
          {
            title: '2. Pricing tiers',
            body: 'DisputeIQ offers the following plans:',
            list: [
              'Free — €0/month. A commission of 25% is charged on the recovered amount for each dispute you win. No commission is charged on lost disputes. Commission invoices are issued by email within 24 hours of a dispute being marked won.',
              'Starter — €99/month (or €83/month billed annually). No commission. Up to 20 dispute responses per month.',
              'Growth — €199/month (or €166/month billed annually). No commission. Unlimited dispute responses.',
              'Scale — €399/month (or €332/month billed annually). No commission. Multi-store support and priority support.',
            ],
            footer: 'All prices exclude VAT where applicable. Annual plans are billed as a single payment at the start of the billing period. Prices are subject to change with 30 days notice.',
          },
          {
            title: '3. Free tier commission terms',
            body: 'By using the free tier, you agree to the following commission terms: (a) A commission of 25% of the gross recovered dispute amount is payable to DisputeIQ for each dispute that is marked as "won" in your dashboard. (b) Commission invoices are issued by email to your registered address and are payable within 14 days of the invoice date. (c) Failure to pay commission invoices within 30 days of their due date may result in suspension or termination of your free tier access. (d) Upgrading to a paid plan cancels future commission obligations on new disputes from the upgrade date — commissions already invoiced remain payable regardless of plan change. (e) You are responsible for accurately marking dispute outcomes. Deliberately marking a won dispute as lost to avoid commission is a breach of these terms.',
          },
          {
            title: '4. Payment processing',
            body: 'Paid subscription payments are processed by Stripe, Inc. By subscribing to a paid plan, you agree to Stripe\'s terms of service. Your payment details are stored and processed by Stripe and are not held by DisputeIQ. Commission invoices for the free tier are issued directly by DisputeIQ and payable by bank transfer or card as indicated on the invoice.',
          },
          {
            title: '5. Not legal or financial advice',
            body: 'DisputeIQ is a software tool, not a legal service. Nothing produced by DisputeIQ constitutes legal advice, financial advice, or any form of professional advice. Dispute outcomes depend on many factors outside our control including card network policies, available evidence, adjudicator decisions, and cardholder behaviour. We make no guarantee of dispute outcomes. Win rate statistics shown on our website represent historical averages and are not a guarantee of your individual results.',
          },
          {
            title: '6. Shopify data access',
            body: 'By connecting your Shopify store, you grant DisputeIQ read-only access to your store data as described in our Privacy Policy. This includes order data, shipping information, customer details, and dispute notifications. You confirm that: (a) you have the authority to grant this access; (b) using DisputeIQ does not violate your Shopify merchant agreement or applicable law; (c) you will notify DisputeIQ promptly if you revoke this access.',
          },
          {
            title: '7. Your responsibilities',
            body: 'You are responsible for: (a) reviewing all generated dispute responses before submitting them to card networks; (b) ensuring the evidence submitted is accurate and not misleading; (c) submitting responses before card network deadlines — DisputeIQ\'s deadline reminders are a courtesy, not a guarantee; (d) maintaining accurate records of dispute outcomes in your dashboard; (e) keeping your account credentials secure. DisputeIQ generates drafts — you remain solely responsible for all submissions made to card networks or payment processors.',
          },
          {
            title: '8. Data processing and GDPR',
            body: 'DisputeIQ processes personal data as a data processor on your behalf (as a data controller) in accordance with Regulation (EU) 2016/679 (GDPR). By connecting your store, you agree to our Data Processing Agreement, which is incorporated into these terms by reference. Key points: (a) we process only the data necessary to provide the service; (b) data is stored in the EU (Supabase EU region); (c) we do not sell your data or your customers\' data to third parties; (d) you may request deletion of your data at any time by emailing conor@disputeiq.co; (e) we use sub-processors including Supabase (database), Vercel (hosting), and Anthropic (AI response generation).',
          },
          {
            title: '9. Intellectual property',
            body: 'DisputeIQ retains all intellectual property rights in the platform, including the AI models, templates, and software. The dispute responses generated by DisputeIQ are yours to use for the purpose of submitting to card networks. You grant DisputeIQ a non-exclusive licence to use anonymised dispute outcome data to improve the service.',
          },
          {
            title: '10. Limitation of liability',
            body: 'To the maximum extent permitted by Irish law: (a) DisputeIQ\'s total liability for any claim arising from use of the service shall not exceed the amounts paid by you in the 12 months preceding the claim (or €99 for free-tier users); (b) DisputeIQ is not liable for: lost revenue from disputes that are not won; missed deadlines where you had access to the platform; decisions made by card network adjudicators; or indirect, consequential, or punitive losses; (c) nothing in these terms limits liability for fraud, death, or personal injury caused by our negligence.',
          },
          {
            title: '11. Termination',
            body: 'You may cancel your subscription at any time via your account settings or by emailing conor@disputeiq.co. Cancellation takes effect at the end of the current billing period. On cancellation, your data is retained for 30 days and then deleted (subject to legal retention requirements). DisputeIQ may suspend or terminate accounts that: abuse the service; fail to pay outstanding commissions or subscription fees; violate these terms; or engage in fraudulent activity.',
          },
          {
            title: '12. Changes to these terms',
            body: 'We may update these terms from time to time. We will notify you by email at least 14 days before material changes take effect. Continuing to use the service after the effective date constitutes acceptance of the updated terms. If you disagree with a change, you may cancel your account before it takes effect.',
          },
          {
            title: '13. Governing law and disputes',
            body: 'These terms are governed by the laws of Ireland. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the Irish courts. If you are a consumer in the EU, you may also have rights under the consumer protection laws of your country of residence.',
          },
          {
            title: '14. Contact',
            body: 'For billing enquiries, commission invoices, data requests, or any other matter: Conor Roche · Dublin, Ireland · conor@disputeiq.co',
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
