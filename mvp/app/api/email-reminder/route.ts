import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, dispute } = await req.json()
  if (!email || !dispute?.due_by) {
    return NextResponse.json({ error: 'Missing email or dispute.due_by' }, { status: 400 })
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Email not configured' }, { status: 503 })
  }

  const dueDate   = new Date(dispute.due_by)
  const hoursLeft = Math.ceil((dueDate.getTime() - Date.now()) / 3600000)
  const appUrl    = process.env.NEXT_PUBLIC_APP_URL || 'https://dispute-iq-wcev.vercel.app'
  const from      = process.env.RESEND_VERIFIED_DOMAIN
    ? 'DisputeIQ <alerts@disputeiq.co>'
    : 'DisputeIQ <onboarding@resend.dev>'

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: email,
      subject: `⚠️ Dispute deadline in ${hoursLeft > 0 ? `${hoursLeft}h` : 'less than 1h'} — submit now`,
      html: `
        <div style="font-family:-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:24px">
          <h2 style="color:#dc2626;margin-bottom:4px">Dispute deadline approaching</h2>
          <p style="color:#374151;margin-bottom:20px">
            ${hoursLeft > 0
              ? `Your dispute response must be submitted in <strong>${hoursLeft} hours</strong>.`
              : `Your dispute deadline has passed or is imminent.`
            }
            Missing it is an automatic loss.
          </p>
          <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:16px;margin-bottom:20px">
            ${dispute.order_id ? `<p style="margin:0 0 6px"><strong>Order:</strong> #${(dispute.order_id || '').slice(-6)}</p>` : ''}
            ${dispute.amount   ? `<p style="margin:0 0 6px"><strong>Amount:</strong> ${dispute.currency || ''} ${Number(dispute.amount).toFixed(2)}</p>` : ''}
            <p style="margin:0"><strong>Due:</strong> ${dueDate.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })}</p>
          </div>
          <a href="${appUrl}/dashboard" style="background:#dc2626;color:#fff;padding:13px 24px;border-radius:10px;text-decoration:none;font-weight:600;display:inline-block;font-size:15px">
            Submit now →
          </a>
          <p style="color:#9ca3af;font-size:12px;margin-top:20px">DisputeIQ</p>
        </div>
      `,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error('Resend error:', body)
    return NextResponse.json({ error: 'Email failed' }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}
