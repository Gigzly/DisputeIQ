import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

// Protected by ?secret= query param matching ADMIN_SECRET env var
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const admin = createSupabaseAdmin()

  const [{ data: stores }, { data: disputes }, { data: commissions }] = await Promise.all([
    admin.from('shopify_stores')
      .select('id, shop_domain, plan, win_rate, total_disputes, total_recovered, owner_email, created_at')
      .order('created_at', { ascending: false }),
    admin.from('disputes')
      .select('status, outcome, amount, created_at, store_id')
      .order('created_at', { ascending: false })
      .limit(500),
    admin.from('commissions')
      .select('commission_amount, status, created_at')
      .order('created_at', { ascending: false }),
  ])

  const now       = new Date()
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const PLAN_MRR: Record<string, number> = { starter: 99, growth: 199, scale: 399 }
  const paidStores    = (stores || []).filter(s => !['trial', 'free', 'cancelled'].includes(s.plan))
  const mrr           = paidStores.reduce((s, st) => s + (PLAN_MRR[st.plan] || 0), 0)
  const commissionDue = (commissions || []).filter(c => c.status === 'pending')
    .reduce((s, c) => s + (c.commission_amount || 0), 0)

  const totalDisputes  = (disputes || []).length
  const wonDisputes    = (disputes || []).filter(d => d.outcome === 'won').length
  const totalRecovered = (disputes || []).filter(d => d.outcome === 'won')
    .reduce((s, d) => s + (d.amount || 0), 0)

  return NextResponse.json({
    mrr:               Math.round(mrr),
    commission_due:    Math.round(commissionDue * 100) / 100,
    total_stores:      (stores || []).length,
    paid_customers:    paidStores.length,
    free_customers:    (stores || []).filter(s => s.plan === 'free').length,
    trial_customers:   (stores || []).filter(s => s.plan === 'trial').length,
    new_this_month:    (stores || []).filter(s => new Date(s.created_at) >= thisMonth).length,
    dispute_stats: {
      total:     totalDisputes,
      won:       wonDisputes,
      win_rate:  totalDisputes > 0 ? Math.round((wonDisputes / totalDisputes) * 100) : 0,
      recovered: Math.round(totalRecovered),
    },
    plan_breakdown: {
      free:    (stores || []).filter(s => s.plan === 'free').length,
      starter: (stores || []).filter(s => s.plan === 'starter').length,
      growth:  (stores || []).filter(s => s.plan === 'growth').length,
      scale:   (stores || []).filter(s => s.plan === 'scale').length,
    },
    recent_stores: (stores || []).slice(0, 15).map(s => ({
      shop:      s.shop_domain,
      plan:      s.plan,
      email:     s.owner_email,
      disputes:  s.total_disputes || 0,
      recovered: Math.round(s.total_recovered || 0),
      win_rate:  Math.round((s.win_rate || 0) * 100),
      joined:    new Date(s.created_at).toLocaleDateString('en-IE'),
    })),
  })
}
