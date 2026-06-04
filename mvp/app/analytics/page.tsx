'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Dispute = {
  id: string; order_id: string; amount: number; currency: string; network: string
  reason_code: string; status: string; outcome: string | null; created_at: string
  generated_response: { win_probability: number; evidence_strength: string } | null
}

function bar(pct: number, color = '#16a34a') {
  return (
    <div style={{ background: '#f3f4f6', borderRadius: 4, height: 8, overflow: 'hidden', flex: 1 }}>
      <div style={{ width: `${Math.min(100, pct)}%`, height: '100%', background: color, borderRadius: 4, transition: 'width .4s' }} />
    </div>
  )
}

export default function Analytics() {
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [shop, setShop]         = useState('')
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const init = async () => {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/auth/login'; return }

      const res = await fetch(`/api/store?email=${encodeURIComponent(user.email || '')}`)
      if (res.ok) {
        const { store } = await res.json()
        if (store) {
          setShop(store.shop_domain)
          const dRes = await fetch(`/api/disputes?shop=${store.shop_domain}`)
          if (dRes.ok) {
            const d = await dRes.json()
            setDisputes(d.disputes || [])
          }
        }
      }
      setLoading(false)
    }
    init()
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: '-apple-system,sans-serif', color: '#6b7280', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>Dispute<span style={{ color: '#16a34a' }}>IQ</span></div>
      <div>Loading analytics…</div>
    </div>
  )

  const resolved     = disputes.filter(d => d.outcome)
  const won          = disputes.filter(d => d.outcome === 'won')
  const lost         = disputes.filter(d => d.outcome === 'lost')
  const winRate      = resolved.length > 0 ? Math.round((won.length / resolved.length) * 100) : 0
  const totalDisputed = disputes.reduce((s, d) => s + (d.amount || 0), 0)
  const recovered    = won.reduce((s, d) => s + (d.amount || 0), 0)

  // Win rate by network
  const networks = ['visa', 'mastercard', 'amex']
  const byNetwork = networks.map(net => {
    const netDisputes = resolved.filter(d => (d.network || '').toLowerCase() === net)
    const netWon      = netDisputes.filter(d => d.outcome === 'won')
    return { net, total: netDisputes.length, won: netWon.length, rate: netDisputes.length > 0 ? Math.round((netWon.length / netDisputes.length) * 100) : 0 }
  }).filter(n => n.total > 0)

  // Win rate by reason code (top 5)
  const codeMap: Record<string, { won: number; total: number }> = {}
  resolved.forEach(d => {
    const key = `${(d.network || '').toUpperCase()} ${d.reason_code}`
    if (!codeMap[key]) codeMap[key] = { won: 0, total: 0 }
    codeMap[key].total++
    if (d.outcome === 'won') codeMap[key].won++
  })
  const byCode = Object.entries(codeMap)
    .map(([code, { won, total }]) => ({ code, won, total, rate: Math.round((won / total) * 100) }))
    .sort((a, b) => b.total - a.total).slice(0, 6)

  // Monthly trend (last 6 months)
  const now = new Date()
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const label = d.toLocaleDateString('en-GB', { month: 'short' })
    const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const mRes  = resolved.filter(d => d.created_at?.startsWith(monthStr))
    const mWon  = mRes.filter(d => d.outcome === 'won')
    return { label, rate: mRes.length > 0 ? Math.round((mWon.length / mRes.length) * 100) : 0, count: mRes.length }
  })

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f8', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      <nav style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link href="/dashboard" style={{ fontWeight: 800, fontSize: 17, textDecoration: 'none', color: '#111827' }}>
            Dispute<span style={{ color: '#16a34a' }}>IQ</span>
          </Link>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>Analytics</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {shop && (
            <a href={`/api/disputes/export?shop=${shop}`}
              style={{ fontSize: 13, color: '#374151', textDecoration: 'none', border: '1px solid #e8e8e8', borderRadius: 8, padding: '7px 14px', background: '#fff', fontWeight: 500 }}>
              Export CSV ↓
            </a>
          )}
          <Link href="/dashboard" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>← Dashboard</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 24px 48px' }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 6, letterSpacing: -0.3 }}>Win rate analytics</h1>
        <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 24 }}>{shop}</p>

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Total disputes',   value: disputes.length, sub: 'all time' },
            { label: 'Win rate',         value: `${winRate}%`,   sub: 'of resolved disputes', color: winRate > 30 ? '#16a34a' : undefined },
            { label: 'Total disputed',   value: `$${Math.round(totalDisputed).toLocaleString()}`, sub: 'at stake' },
            { label: 'Revenue recovered',value: `$${Math.round(recovered).toLocaleString()}`, sub: 'from won disputes', color: '#16a34a' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '16px 18px' }}>
              <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -1, color: (s as any).color || '#111827' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

          {/* Monthly trend */}
          <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 20, color: '#111827' }}>Win rate — last 6 months</div>
            {months.map(m => (
              <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: '#6b7280', width: 32, flexShrink: 0 }}>{m.label}</div>
                {bar(m.rate)}
                <div style={{ fontSize: 12, fontWeight: 700, color: m.rate >= 50 ? '#16a34a' : '#374151', width: 36, textAlign: 'right', flexShrink: 0 }}>
                  {m.count > 0 ? `${m.rate}%` : '—'}
                </div>
              </div>
            ))}
          </div>

          {/* By network */}
          <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 20, color: '#111827' }}>Win rate by network</div>
            {byNetwork.length === 0 ? (
              <div style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: '24px 0' }}>No resolved disputes yet</div>
            ) : byNetwork.map(n => (
              <div key={n.net} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', textTransform: 'capitalize' }}>{n.net}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: n.rate >= 50 ? '#16a34a' : '#374151' }}>{n.rate}% ({n.won}/{n.total})</span>
                </div>
                {bar(n.rate, n.rate >= 50 ? '#16a34a' : '#d97706')}
              </div>
            ))}
          </div>
        </div>

        {/* By reason code */}
        <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 20, color: '#111827' }}>Win rate by reason code</div>
          {byCode.length === 0 ? (
            <div style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: '24px 0' }}>No resolved disputes yet</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {byCode.map(c => (
                <div key={c.code} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontFamily: 'ui-monospace,monospace', fontSize: 12, fontWeight: 700, color: '#374151', width: 80, flexShrink: 0 }}>{c.code}</div>
                  {bar(c.rate, c.rate >= 50 ? '#16a34a' : '#d97706')}
                  <div style={{ fontSize: 12, fontWeight: 700, color: c.rate >= 50 ? '#16a34a' : '#374151', width: 44, textAlign: 'right', flexShrink: 0 }}>
                    {c.rate}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
