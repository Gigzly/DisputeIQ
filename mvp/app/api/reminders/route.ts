import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

// Called daily at 9am by Vercel cron (see vercel.json)
export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin  = createSupabaseAdmin()
  const now    = new Date()
  const in48h  = new Date(now.getTime() + 48 * 60 * 60 * 1000)

  const { data: disputes } = await admin
    .from('disputes')
    .select(`id, order_id, amount, currency, reason_code, due_by, shopify_stores!inner(owner_email, shop_domain)`)
    .gte('due_by', now.toISOString())
    .lte('due_by', in48h.toISOString())
    .not('status', 'in', '("won","lost","submitted")')

  let sent = 0
  for (const d of disputes || []) {
    const store = (d as any).shopify_stores
    if (!store?.owner_email) continue
    await sendReminderEmail(store.owner_email, d as any)
    sent++
  }

  return NextResponse.json({ sent, checked: disputes?.length || 0 })
}

async function sendReminderEmail(email: string, dispute: {
  order_id: string; amount: number; currency: string; reason_code: string; due_by: string
}) {
  if (!process.env.RESEND_API_KEY) return

  const dueDate  = new Date(dispute.due_by)
  const hoursLeft = Math.ceil((dueDate.getTime() - Date.now()) / 3600000)
  const appUrl   = process.env.NEXT_PUBLIC_APP_URL || 'https://dispute-iq-wcev.vercel.app'
  const from     = process.env.RESEND_VERIFIED_DOMAIN
    ? 'DisputeIQ <alerts@disputeiq.co>'
    : 'DisputeIQ <onboarding@resend.dev>'

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: email,
      subject: `⚠️ Dispute deadline in ${hoursLeft}h — submit now or lose automatically`,
      html: `
        <div style="font-family:-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:24px">
          <h2 style="color:#dc2626;margin-bottom:4px">Dispute deadline approaching</h2>
          <p style="color:#374151;margin-bottom:20px">
            Your response for Order #${(dispute.order_id || '').slice(-6)} must be submitted in
            <strong>${hoursLeft} hours</strong>. Missing this deadline is an automatic loss.
          </p>
          <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:16px;margin-bottom:20px">
            <p style="margin:0 0 6px"><strong>Amount:</strong> ${dispute.currency} ${(dispute.amount || 0).toFixed(2)}</p>
            <p style="margin:0 0 6px"><strong>Reason code:</strong> ${dispute.reason_code}</p>
            <p style="margin:0"><strong>Due:</strong> ${dueDate.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })}</p>
          </div>
          <a href="${appUrl}/dashboard" style="background:#dc2626;color:#fff;padding:13px 24px;border-radius:10px;text-decoration:none;font-weight:600;display:inline-block;font-size:15px">
            Submit response now →
          </a>
          <p style="color:#9ca3af;font-size:12px;margin-top:20px">DisputeIQ · <a href="${appUrl}/dashboard" style="color:#9ca3af">Manage notifications</a></p>
        </div>
      `,
    }),
  }).catch(e => console.error('Reminder email failed:', e))
}
