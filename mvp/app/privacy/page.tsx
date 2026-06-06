import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — DisputeIQ',
  description: 'How DisputeIQ collects, uses, and protects your data. GDPR compliant, based in Ireland.',
}

export default function Privacy() {
  const updated = 'June 2026'
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', color: '#374151' }}>
      <nav style={{ borderBottom: '1px solid #f3f4f6', padding: '0 40px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: 18, textDecoration: 'none', color: '#111827' }}>Dispute<span style={{ color: '#16a34a' }}>IQ</span></Link>
        <Link href="/auth/login" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none' }}>Dashboard →</Link>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px 80px', lineHeight: 1.75 }}>
        <h1 style={{ fontSize: 34, fontWeight: 900, letterSpacing: -1, marginBottom: 6, color: '#111827' }}>Privacy Policy</h1>
        <p style={{ color: '#9ca3af', marginBottom: 48, fontSize: 14 }}>Last updated: {updated}</p>

        {[
          {
            title: '1. Who we are',
            body: 'DisputeIQ is operated by Conor Roche, Dublin, Ireland. We provide chargeback dispute assistance for Shopify merchants. Contact: conor@disputeiq.co',
          },
          {
            title: '2. Data we collect',
            body: null,
            list: [
              'Your email address (for account creation and alerts)',
              'Your Shopify store domain and a read-only access token',
              'Order data for disputed transactions: order number, amounts, billing/shipping addresses, line items, fulfillment status',
              'Shipping data: carrier name, tracking number, delivery status, proof of delivery',
              'Transaction metadata: AVS result, CVV result, IP address, gateway response codes',
              'Billing information processed by Stripe (we never see or store card details)',
            ],
          },
          {
            title: '3. Legal basis for processing (GDPR)',
            body: null,
            list: [
              'Contract performance — processing your order data to generate dispute responses you\'ve requested',
              'Legitimate interests — sending dispute deadline alerts, calculating win rates, detecting fraud patterns on your store',
              'Legal obligation — retaining transaction records as required by Irish law',
            ],
          },
          {
            title: '4. Shopify OAuth scopes',
            body: 'When you install DisputeIQ, we request the following read-only Shopify scopes:',
            list: [
              'read_orders — to access order data for disputed transactions',
              'read_fulfillments — to access shipping and delivery information',
              'read_customers — to access customer communication history relevant to disputes',
              'read_disputes — to receive dispute notifications via webhook',
              'read_shipping — to access shipping zone and carrier information',
            ],
            footer: 'We cannot write to your store, process refunds, access your payment balance, or modify any data.',
          },
          {
            title: '5. How we use your data',
            body: null,
            list: [
              'Generate dispute response documents for your chargebacks',
              'Send email alerts when disputes arrive and when deadlines approach',
              'Calculate your win rate and revenue recovery metrics',
              'Detect high-risk orders for chargeback prevention',
              'Process subscription payments via Stripe',
            ],
          },
          {
            title: '6. Data storage and security',
            body: 'Your data is stored in Supabase (EU region — Frankfurt). Data is encrypted at rest and in transit. Access tokens are stored encrypted. We do not sell your data, share it with third parties for marketing, or use it to train AI models.',
          },
          {
            title: '7. Third-party processors',
            body: null,
            list: [
              'Supabase (database) — EU data processing',
              'Anthropic (Claude AI) — generates dispute response text. Order data is sent to Anthropic\'s API for this purpose.',
              'Resend (email) — sends alert emails',
              'Stripe (billing) — processes subscription payments',
              'Vercel (hosting) — hosts the application',
            ],
          },
          {
            title: '8. Cookies',
            body: 'DisputeIQ uses session cookies for authentication only (Supabase Auth). We do not use tracking cookies, advertising cookies, or third-party analytics cookies.',
          },
          {
            title: '9. Your rights (GDPR)',
            body: 'As an EU resident, you have the right to: access your personal data, correct inaccurate data, request deletion of your data, object to processing, and data portability. To exercise any of these rights, email conor@disputeiq.co. We respond within 30 days.',
          },
          {
            title: '10. Data retention',
            body: 'We retain your data for as long as your account is active. If you delete your account, we delete your personal data within 30 days, except where retention is required by law (e.g. billing records for 7 years under Irish tax law).',
          },
          {
            title: '11. Contact',
            body: 'Data controller: Conor Roche, Dublin, Ireland. Email: conor@disputeiq.co. If you have concerns about how we handle your data, you can also contact the Irish Data Protection Commission at dataprotection.ie.',
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
