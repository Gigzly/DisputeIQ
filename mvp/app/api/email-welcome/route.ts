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
    ? 'DisputeIQ <hello@disputeiq.co>'
    : 'DisputeIQ <onboarding@resend.dev>'

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: email,
      subject: `You're live on DisputeIQ — your next chargeback is covered`,
      html: `
        <div style="font-family:-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:24px">
          <h2 style="color:#111827;margin-bottom:4px">Welcome to DisputeIQ</h2>
          <p style="color:#374151;margin-bottom:20px">
            <strong>${shop_domain}</strong> is connected. Here's exactly what happens next:
          </p>
          <ol style="color:#374151;line-height:2.2;padding-left:20px;margin-bottom:24px">
            <li>A chargeback arrives on your Shopify store</li>
            <li>We detect it via webhook within seconds</li>
            <li>Evidence assembled automatically from your order data</li>
            <li>You get an email with the complete response ready to submit</li>
            <li>You review and submit in under 2 minutes</li>
          </ol>
          <p style="color:#374151;margin-bottom:8px">
            <strong>Nothing to configure.</strong> The next chargeback is covered.
          </p>
          <p style="color:#6b7280;margin-bottom:24px;font-size:14px">
            If you have open disputes right now — reply to this email and I'll help you handle them today.
          </p>
          <a href="${appUrl}/dashboard" style="background:#16a34a;color:#fff;padding:13px 24px;border-radius:10px;text-decoration:none;font-weight:600;display:inline-block;font-size:15px">
            View your dashboard →
          </a>
          <p style="color:#9ca3af;font-size:12px;margin-top:24px">
            DisputeIQ · ${plan || 'Trial'} plan ·
            <a href="${appUrl}/dashboard" style="color:#9ca3af">Manage account</a>
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
