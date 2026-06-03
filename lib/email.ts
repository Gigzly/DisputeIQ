const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM = 'DisputeIQ <alerts@disputeiq.co>'
const FROM_FALLBACK = 'DisputeIQ <onboarding@resend.dev>'

async function send(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) return
  const from = process.env.RESEND_VERIFIED_DOMAIN ? FROM : FROM_FALLBACK
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, html }),
  }).catch(e => console.error('Email failed:', e))
}

export async function sendDisputeAlert(email: string, dispute: {
  amount: number; currency: string; reason_code: string; reason: string;
  due_by: string | null; win_probability: number; evidence_strength: string;
  dispute_id: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dispute-iq-wcev.vercel.app'
  const dueText = dispute.due_by
    ? `<strong>Due:</strong> ${new Date(dispute.due_by).toLocaleDateString('en-GB', {day:'numeric',month:'long',year:'numeric'})}<br>`
    : ''

  await send(email,
    `⚡ New chargeback — response ready (${Math.round(dispute.win_probability * 100)}% win probability)`,
    `<div style="font-family:-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:24px">
      <h2 style="color:#0a0a0a;margin-bottom:4px">New chargeback on your store</h2>
      <p style="color:#6b7280;margin-bottom:20px">DisputeIQ has generated a response. Review and submit before the deadline.</p>
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:18px;margin-bottom:20px">
        <p style="margin:0 0 8px"><strong>Amount:</strong> ${dispute.currency} ${dispute.amount.toFixed(2)}</p>
        <p style="margin:0 0 8px"><strong>Reason:</strong> ${dispute.reason_code} — ${dispute.reason}</p>
        ${dueText}
        <p style="margin:0 0 8px"><strong>Win probability:</strong> ${Math.round(dispute.win_probability * 100)}%</p>
        <p style="margin:0"><strong>Evidence strength:</strong> ${dispute.evidence_strength}</p>
      </div>
      <a href="${appUrl}/dashboard" style="background:#16a34a;color:#fff;padding:13px 24px;border-radius:10px;text-decoration:none;font-weight:600;display:inline-block;font-size:15px">
        Review response →
      </a>
      <p style="color:#9ca3af;font-size:12px;margin-top:20px">DisputeIQ · <a href="${appUrl}/dashboard" style="color:#9ca3af">Manage notifications</a></p>
    </div>`
  )
}

export async function sendWelcomeEmail(email: string, plan: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dispute-iq-wcev.vercel.app'
  await send(email,
    `You're live on DisputeIQ — next chargeback is covered`,
    `<div style="font-family:-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:24px">
      <h2>Welcome to DisputeIQ</h2>
      <p>Your ${plan} plan is active. Here's what happens next:</p>
      <ol style="color:#374151;line-height:2">
        <li>A chargeback arrives on your Shopify store</li>
        <li>We detect it via webhook within seconds</li>
        <li>Evidence assembled automatically from your order data</li>
        <li>You get an email with the response ready to submit</li>
      </ol>
      <p>Nothing to configure. The next chargeback is covered.</p>
      <p>If you have open disputes right now — reply to this email and I'll help you handle them manually today.</p>
      <a href="${appUrl}/dashboard" style="background:#16a34a;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:600;display:inline-block">
        View dashboard →
      </a>
    </div>`
  )
}

export async function sendTrialEndingEmail(email: string, daysLeft: number) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dispute-iq-wcev.vercel.app'
  await send(email,
    `Your DisputeIQ trial ends in ${daysLeft} day${daysLeft===1?'':'s'}`,
    `<div style="font-family:-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:24px">
      <h2>Your trial ends in ${daysLeft} day${daysLeft===1?'':'s'}</h2>
      <p>To keep automatic dispute responses running after your trial:</p>
      <ul style="color:#374151;line-height:2">
        <li><strong>Starter</strong> — $99/mo (up to 20 disputes)</li>
        <li><strong>Growth</strong> — $199/mo (unlimited) ← most merchants choose this</li>
        <li><strong>Scale</strong> — $399/mo (multi-store)</li>
      </ul>
      <a href="${appUrl}/pricing" style="background:#16a34a;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:600;display:inline-block">
        Upgrade now →
      </a>
      <p style="color:#6b7280;font-size:13px;margin-top:16px">No hard sell — but I'd rather you don't miss a deadline because the trial lapsed.</p>
    </div>`
  )
}
