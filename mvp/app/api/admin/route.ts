import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

// Founder-only route — protected by ADMIN_SECRET header
export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const admin = createSupabaseAdmin()

  const { data: stores } = await admin
    .from('shopify_stores')
    .select('id, shop_domain, plan, win_rate, total_disputes, total_recovered, created_at')
    .order('created_at', { ascending: false })

  const { data: disputes } = await admin
    .from('disputes')
    .select('status, outcome, amount, created_at')
    .order('created_at', { ascending: false })
    .limit(500)

  const now        = new Date()
  const thisMonth  = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonth  = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  // MRR calculation
  const PLAN_MRR: Record<string, number> = {
    starter: 99, growth: 199, scale: 399
  }
  const activePlans    = stores?.filter(s => s.plan !== 'trial' && s.plan !== 'cancelled') || []
  const mrr            = activePlans.reduce((sum, s) => sum + (PLAN_MRR[s.plan] || 0), 0)
  const trialCount     = stores?.filter(s => s.plan === 'trial').length || 0
  const paidCount      = activePlans.length
  const cancelledCount = stores?.filter(s => s.plan === 'cancelled').length || 0

  // New installs this month
  const newThisMonth = stores?.filter(s =>
    new Date(s.created_at) >= thisMonth
  ).length || 0

  // Dispute stats
  const totalDisputes = disputes?.length || 0
  const wonDisputes   = disputes?.filter(d => d.outcome === 'won').length || 0
  const winRate       = totalDisputes > 0 ? (wonDisputes / totalDisputes) : 0
  const totalRecovered = disputes
    ?.filter(d => d.outcome === 'won')
    .reduce((sum, d) => sum + (d.amount || 0), 0) || 0

  return NextResponse.json({
    mrr,
    paid_customers:    paidCount,
    trial_customers:   trialCount,
    cancelled:         cancelledCount,
    new_this_month:    newThisMonth,
    total_stores:      stores?.length || 0,
    dispute_stats: {
      total:     totalDisputes,
      won:       wonDisputes,
      win_rate:  Math.round(winRate * 100),
      recovered: Math.round(totalRecovered),
    },
    plan_breakdown: {
      starter: stores?.filter(s => s.plan === 'starter').length || 0,
      growth:  stores?.filter(s => s.plan === 'growth').length || 0,
      scale:   stores?.filter(s => s.plan === 'scale').length || 0,
    },
    recent_stores: (stores || []).slice(0, 10).map(s => ({
      shop:    s.shop_domain,
      plan:    s.plan,
      disputes: s.total_disputes,
      win_rate: Math.round((s.win_rate || 0) * 100),
      joined:  new Date(s.created_at).toLocaleDateString(),
    })),
  })
}
