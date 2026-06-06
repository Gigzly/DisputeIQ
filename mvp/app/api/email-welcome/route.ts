import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, shop_domain, plan } = await req.json()
  if (!email || !shop_domain) {
    return NextResponse.json({ error: 'Missing email or shop_domain' }, { status: 400 })
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Email not configured' }, { status: 503 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://disputeiq.co'
  const from   = process.env.RESEND_VERIFIED_DOMAIN
    ? 'Conor at DisputeIQ <conor@disputeiq.co>'
    : 'DisputeIQ <onboarding@resend.dev>'

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: email,
      subject: `${shop_domain} is now protected — here's what happens next`,
      html: `
        <div style="font-family:-apple-system,sans-serif;max-width:540px;margin:0 auto;padding:24px">
          <h2 style="color:#111827;margin-bottom:4px">You're live on DisputeIQ</h2>
          <p style="color:#374151;margin-bottom:20px">
            Hi — I'm Conor, the founder. <strong>${shop_domain}</strong> is connected. Here's exactly what happens when a chargeback arrives:
          </p>
          <ol style="color:#374151;line-height:2.2;padding-left:20px;margin-bottom:20px">
            <li>Shopify sends us the dispute via webhook (within seconds)</li>
            <li>We pull your order data, shipping tracking, and transaction details</li>
            <li>We generate a formatted response for that exact reason code</li>
            <li>You get an email with a direct link to review and submit</li>
            <li>The whole thing takes you under 2 minutes</li>
          </ol>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px;margin-bottom:20px">
            <p style="margin:0 0 6px;font-weight:600;color:#15803d">One thing worth knowing: CE 3.0</p>
            <p style="margin:0;color:#374151;font-size:14px;line-height:1.7">
              If you're on Shopify Payments and get a Visa 10.4 fraud dispute, we automatically check for
              Compelling Evidence 3.0 eligibility. If you have prior undisputed transactions from the same card,
              CE 3.0 can get the dispute reversed automatically — it shifts liability back to the card issuer.
              We flag this in the dashboard when it applies.
            </p>
          </div>
          <p style="color:#374151;margin-bottom:8px">
            <strong>Nothing to configure.</strong> The next chargeback is covered.
          </p>
          <p style="color:#6b7280;margin-bottom:24px;font-size:14px">
            If you have open disputes right now, reply to this email and I'll help you handle them today. Personally.
          </p>
          <a href="${appUrl}/dashboard" style="background:#16a34a;color:#fff;padding:13px 24px;border-radius:10px;text-decoration:none;font-weight:600;display:inline-block;font-size:15px">
            View your dashboard →
          </a>
          <p style="color:#9ca3af;font-size:12px;margin-top:24px">
            Conor Roche · DisputeIQ · Dublin<br/>
            <a href="mailto:conor@disputeiq.co" style="color:#9ca3af">conor@disputeiq.co</a>
          </p>
        </div>
      `,
    }),
  })

  if (!res.ok) {
    console.error('Welcome email failed:', await res.text())
    return NextResponse.json({ error: 'Email failed' }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}
