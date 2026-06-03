'use client'
import { useState, useEffect } from 'react'

type Dispute = {
  id: string
  order_id: string
  shopify_dispute_id?: string
  amount: number
  currency: string
  reason: string
  reason_code: string
  network: string
  status: string
  outcome: string | null
  due_by: string | null
  generated_response: {
    summary: string
    evidence_strength: string
    win_probability: number
    response_letter: string
    key_arguments: string[]
    recommended_action: string
    evidence_checklist: { item: string; available: boolean; required: boolean; importance: string }[]
    compelling_evidence_30?: { eligible: boolean; confidence: string; matching_elements: string[]; recommendation: string } | null
  } | null
  created_at: string
}

const STATUS: Record<string, { bg: string; color: string; label: string }> = {
  pending:             { bg: '#fef9c3', color: '#854d0e',  label: 'Pending' },
  response_generated:  { bg: '#dcfce7', color: '#166534',  label: 'Response ready' },
  submitted:           { bg: '#dbeafe', color: '#1e40af',  label: 'Submitted' },
  won:                 { bg: '#f0fdf4', color: '#15803d',  label: 'Won ✓' },
  lost:                { bg: '#fef2f2', color: '#991b1b',  label: 'Lost' },
}

function daysBetween(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
}

export default function Dashboard() {
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [selected, setSelected] = useState<Dispute | null>(null)
  const [loading, setLoading]   = useState(true)
  const [user, setUser]         = useState<any>(null)
  const [store, setStore]       = useState<any>(null)
  const [copied, setCopied]     = useState(false)
  const [tab, setTab]           = useState<'disputes' | 'connect' | 'settings'>('disputes')
  const [shopUrl, setShopUrl]   = useState('')
  const [stats, setStats]       = useState({ total: 0, won: 0, pending: 0, recovered: 0, win_rate: 0 })
  const [marking, setMarking]   = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/auth/login'; return }
      setUser(user)

      const res = await fetch(`/api/store?email=${encodeURIComponent(user.email || '')}`)
      if (res.ok) {
        const data = await res.json()
        if (data.store) {
          setStore(data.store)
          const dRes = await fetch(`/api/disputes?shop=${data.store.shop_domain}`)
          if (dRes.ok) {
            const dData = await dRes.json()
            setDisputes(dData.disputes || [])
            setStats(dData.stats || {})
          }
          setTab('disputes')
        } else {
          setTab('connect')
        }
      } else {
        setTab('connect')
      }
      setLoading(false)
    }
    init()
  }, [])

  const signOut = async () => {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  const useDemoMode = async () => {
    setLoading(true)
    const res = await fetch('/api/demo-store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user?.email, user_id: user?.id }),
    })
    if (res.ok) {
      const { store } = await res.json()
      setStore(store)
      const dRes = await fetch(`/api/disputes?shop=${store.shop_domain}`)
      if (dRes.ok) {
        const dData = await dRes.json()
        setDisputes(dData.disputes || [])
        setStats(dData.stats || {})
      }
      setTab('disputes')
    }
    setLoading(false)
  }

  const connectShopify = () => {
    let shop = shopUrl.trim().replace(/^https?:\/\//, '').replace(/\/$/, '')
    if (!shop.includes('.myshopify.com')) shop = `${shop}.myshopify.com`
    window.location.href = `/api/shopify-auth?shop=${shop}`
  }

  const copyLetter = () => {
    if (!selected?.generated_response?.response_letter) return
    navigator.clipboard.writeText(selected.generated_response.response_letter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const markOutcome = async (disputeId: string, outcome: 'won' | 'lost') => {
    setMarking(disputeId + outcome)
    const res = await fetch(`/api/disputes/${disputeId}/outcome`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ outcome }),
    })
    if (res.ok) {
      setDisputes(prev => prev.map(d => d.id === disputeId ? { ...d, status: outcome, outcome } : d))
      if (selected?.id === disputeId) setSelected(prev => prev ? { ...prev, status: outcome, outcome } : null)
    }
    setMarking(null)
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: '-apple-system,sans-serif', flexDirection: 'column', gap: 14, background: '#f7f7f8' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#111827', letterSpacing: -0.5 }}>Dispute<span style={{ color: '#16a34a' }}>IQ</span></div>
      <div style={{ fontSize: 14, color: '#6b7280' }}>Loading your dashboard…</div>
    </div>
  )

  const isDemo = store?.shop_domain?.startsWith('demo-')
  const winPct = stats.total > 0 ? Math.round((stats.won / stats.total) * 100) : 0
  const openCount = disputes.filter(d => d.status !== 'won' && d.status !== 'lost').length
  const urgentDisputes = disputes.filter(d => d.due_by && daysBetween(d.due_by) <= 2 && d.status !== 'won' && d.status !== 'lost')

  // CONNECT SCREEN — no sidebar
  if (tab === 'connect') return (
    <div style={{ minHeight: '100vh', background: '#f7f7f8', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        <div style={{ textAlign: 'center', marginBottom: 10 }}>
          <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: -0.5, color: '#111827' }}>Dispute<span style={{ color: '#16a34a' }}>IQ</span></span>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, marginBottom: 10, color: '#111827' }}>Connect your Shopify store</h1>
          <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.65 }}>DisputeIQ needs read-only access to detect chargebacks and assemble evidence automatically.</p>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: 28, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#111827' }}>Your Shopify store URL</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <input value={shopUrl} onChange={e => setShopUrl(e.target.value)}
              placeholder="yourstore.myshopify.com"
              style={{ flex: 1, border: '1.5px solid #e8e8e8', borderRadius: 10, padding: '12px 14px', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#111827' }}
              onKeyDown={e => e.key === 'Enter' && connectShopify()} />
            <button onClick={connectShopify}
              style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
              Connect →
            </button>
          </div>
          <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>e.g. "mystore" or "mystore.myshopify.com"</p>
        </div>

        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 18, marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: '#15803d', marginBottom: 10 }}>Read-only access only</div>
          {['Orders and order details', 'Shipping and fulfillment data', 'Dispute notifications', 'Cannot modify your store or access funds'].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#374151', padding: '3px 0' }}>
              <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>{item}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', paddingTop: 16 }}>
          <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 10 }}>No Shopify store yet? Try with sample data.</div>
          <button onClick={useDemoMode}
            style={{ background: 'none', border: '1.5px solid #e8e8e8', borderRadius: 10, padding: '10px 22px', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#374151', fontFamily: 'inherit' }}>
            Try demo mode →
          </button>
        </div>
      </div>
    </div>
  )

  // MAIN DASHBOARD with sidebar
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>

      {/* Sidebar */}
      <aside className="sidebar-fixed" style={{ width: 220, position: 'fixed', top: 0, left: 0, bottom: 0, background: '#fff', borderRight: '1px solid #e8e8e8', display: 'flex', flexDirection: 'column', zIndex: 40 }}>
        <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid #f3f4f6' }}>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5, color: '#111827' }}>
            Dispute<span style={{ color: '#16a34a' }}>IQ</span>
          </span>
        </div>

        <nav style={{ flex: 1, padding: '10px 8px' }}>
          {([
            { id: 'disputes' as const, label: 'Disputes', icon: '🛡️', badge: openCount > 0 ? openCount : null, badgeUrgent: urgentDisputes.length > 0 },
            { id: 'settings' as const, label: 'Settings', icon: '⚙️', badge: null, badgeUrgent: false },
          ]).map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 14, fontWeight: tab === item.id ? 600 : 400,
                background: tab === item.id ? '#f0fdf4' : 'transparent',
                color: tab === item.id ? '#15803d' : '#374151',
                marginBottom: 2, textAlign: 'left',
              }}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge !== null && (
                <span style={{ background: item.badgeUrgent ? '#dc2626' : '#6b7280', color: '#fff', borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: '12px 12px 16px', borderTop: '1px solid #f3f4f6' }}>
          {store && (
            <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 2px' }}>
              {isDemo ? '🎯 Demo mode' : `📦 ${store.shop_domain}`}
            </div>
          )}
          <a href="/pricing" style={{ display: 'block', textAlign: 'center', background: '#16a34a', color: '#fff', padding: '9px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', marginBottom: 8 }}>
            Upgrade plan
          </a>
          <button onClick={signOut}
            style={{ width: '100%', background: 'none', border: '1px solid #e8e8e8', borderRadius: 8, padding: '8px', cursor: 'pointer', fontSize: 13, color: '#6b7280', fontFamily: 'inherit' }}>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-with-sidebar" style={{ marginLeft: 220, flex: 1, background: '#f7f7f8', minHeight: '100vh' }}>

        {/* DISPUTES */}
        {tab === 'disputes' && (
          <div style={{ padding: '28px 28px 40px' }}>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111827', letterSpacing: -0.3 }}>Disputes</h1>
              {store && (
                <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 3 }}>
                  {isDemo ? 'Demo data — connect a real store to see live disputes' : store.shop_domain}
                </p>
              )}
            </div>

            {/* KPI Strip */}
            <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
              {[
                { label: 'Total disputes',    value: stats.total,                              sub: 'all time',             color: undefined,    trend: null },
                { label: 'Win rate',          value: `${winPct}%`,                             sub: 'vs 30% industry avg', color: winPct > 30 ? '#16a34a' : undefined, trend: winPct > 30 ? '↑' : null },
                { label: 'Open disputes',     value: openCount,                                sub: 'need attention',       color: openCount > 0 ? '#d97706' : undefined, trend: null },
                { label: 'Revenue recovered', value: `$${(stats.recovered || 0).toLocaleString()}`, sub: 'from won disputes', color: '#16a34a', trend: null },
              ].map(s => (
                <div key={s.label} style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '16px 18px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, fontWeight: 600 }}>{s.label}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                    <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -1, color: s.color || '#111827', lineHeight: 1 }}>{s.value}</div>
                    {s.trend && <span style={{ fontSize: 14, color: '#16a34a', fontWeight: 700 }}>{s.trend}</span>}
                  </div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Urgent deadline banner */}
            {urgentDisputes.length > 0 && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
                <div>
                  <div style={{ color: '#dc2626', fontWeight: 700, fontSize: 14 }}>
                    {urgentDisputes.length} dispute{urgentDisputes.length > 1 ? 's' : ''} with deadline in ≤ 2 days
                  </div>
                  <div style={{ color: '#7f1d1d', fontSize: 13, marginTop: 3 }}>
                    {urgentDisputes.map(d => {
                      const days = daysBetween(d.due_by!)
                      return `Order #${(d.order_id || '').slice(-6)} — ${days < 0 ? 'OVERDUE' : days === 0 ? 'due today' : `due in ${days}d`}`
                    }).join(' · ')}
                  </div>
                </div>
              </div>
            )}

            {/* Dispute list + response panel */}
            <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 420px' : '1fr', gap: 18, alignItems: 'start' }}>

              {/* List */}
              <div>
                {disputes.length === 0 ? (
                  <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: '56px 32px', textAlign: 'center' }}>
                    <div style={{ fontSize: 40, marginBottom: 14 }}>🛡️</div>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: '#111827' }}>No disputes yet</div>
                    <div style={{ fontSize: 14, color: '#6b7280', maxWidth: 300, margin: '0 auto', lineHeight: 1.7 }}>
                      When a chargeback arrives, DisputeIQ detects it and generates a response within 60 seconds.
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {disputes.map(d => {
                      const sc = STATUS[d.status] || STATUS.pending
                      const daysLeft = d.due_by ? daysBetween(d.due_by) : null
                      const isSelected = selected?.id === d.id
                      const isUrgent = daysLeft !== null && daysLeft <= 2 && d.status !== 'won' && d.status !== 'lost'
                      return (
                        <div key={d.id} onClick={() => setSelected(isSelected ? null : d)}
                          style={{
                            background: '#fff',
                            border: `1.5px solid ${isSelected ? '#16a34a' : isUrgent ? '#fca5a5' : '#e8e8e8'}`,
                            borderRadius: 12, padding: '16px 18px', cursor: 'pointer',
                            transition: 'border-color .12s, box-shadow .12s',
                            boxShadow: isSelected ? '0 0 0 3px rgba(22,163,74,0.08)' : '0 1px 2px rgba(0,0,0,0.04)',
                          }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                            <div>
                              <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>Order #{(d.order_id || '').slice(-6) || '—'}</span>
                              <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 10 }}>{(d.network || '').toUpperCase()} {d.reason_code}</span>
                            </div>
                            <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{d.currency} {d.amount?.toFixed(2)}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, fontWeight: 600, background: sc.bg, color: sc.color }}>{sc.label}</span>
                            {d.generated_response && (
                              <span style={{ fontSize: 12, color: d.generated_response.win_probability >= 0.6 ? '#16a34a' : '#6b7280', fontWeight: 500 }}>
                                {Math.round(d.generated_response.win_probability * 100)}% win prob.
                              </span>
                            )}
                            {daysLeft !== null && d.status !== 'won' && d.status !== 'lost' && (
                              <span style={{ fontSize: 12, fontWeight: daysLeft <= 2 ? 700 : 400, color: daysLeft < 0 ? '#dc2626' : daysLeft <= 2 ? '#dc2626' : daysLeft <= 5 ? '#d97706' : '#9ca3af' }}>
                                {daysLeft < 0 ? 'Overdue' : daysLeft === 0 ? 'Due today' : `Due in ${daysLeft}d`}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Response panel */}
              {selected && (
                <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: 22, position: 'sticky', top: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', maxHeight: 'calc(100vh - 48px)', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>Order #{(selected.order_id || '').slice(-6)}</div>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{selected.currency} {selected.amount?.toFixed(2)} · {(selected.network || '').toUpperCase()} {selected.reason_code}</div>
                    </div>
                    <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#9ca3af', padding: '0 4px', lineHeight: 1, flexShrink: 0 }}>×</button>
                  </div>

                  {!selected.generated_response ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>⚙️</div>
                      <div style={{ fontSize: 14 }}>Generating response…<br />Usually takes 30–60 seconds</div>
                    </div>
                  ) : (
                    <>
                      {/* CE3.0 banner — Visa 10.4 only */}
                      {selected.generated_response.compelling_evidence_30 && (() => {
                        const ce3 = selected.generated_response!.compelling_evidence_30!
                        return (
                          <div style={{ background: ce3.eligible ? '#f0fdf4' : '#fffbeb', border: `1px solid ${ce3.eligible ? '#bbf7d0' : '#fde68a'}`, borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                              <span style={{ fontSize: 14 }}>{ce3.eligible ? '⚡' : '⚠️'}</span>
                              <span style={{ fontWeight: 700, fontSize: 12, color: ce3.eligible ? '#15803d' : '#92400e' }}>
                                {ce3.eligible ? 'CE3.0 Eligible — automatic reversal pathway' : 'CE3.0 Not Eligible'}
                              </span>
                              <span style={{ fontSize: 10, color: ce3.eligible ? '#6b7280' : '#a16207', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: 2 }}>
                                Compelling Evidence 3.0
                              </span>
                            </div>
                            <div style={{ fontSize: 12, color: ce3.eligible ? '#166534' : '#78350f', lineHeight: 1.55 }}>
                              {ce3.recommendation}
                            </div>
                            {ce3.matching_elements.length > 0 && (
                              <div style={{ marginTop: 8, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                                {ce3.matching_elements.map((el, i) => (
                                  <span key={i} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: ce3.eligible ? '#bbf7d0' : '#fde68a', color: ce3.eligible ? '#15803d' : '#78350f', fontWeight: 600 }}>
                                    {el}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })()}

                      {/* Summary */}
                      <div style={{ background: '#f7f7f8', borderRadius: 10, padding: '12px 14px', marginBottom: 14, fontSize: 13, color: '#374151', lineHeight: 1.65 }}>
                        {selected.generated_response.summary}
                      </div>

                      {/* Win prob + evidence strength */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                          <div style={{ fontSize: 24, fontWeight: 900, color: '#16a34a', lineHeight: 1 }}>{Math.round(selected.generated_response.win_probability * 100)}%</div>
                          <div style={{ fontSize: 11, color: '#15803d', fontWeight: 600, marginTop: 3 }}>Win probability</div>
                        </div>
                        <div style={{ background: '#f7f7f8', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', textTransform: 'capitalize' }}>{selected.generated_response.evidence_strength}</div>
                          <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 500, marginTop: 3 }}>Evidence strength</div>
                        </div>
                      </div>

                      {/* Recommended action */}
                      <div style={{ background: '#eff6ff', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 12, color: '#1e40af', lineHeight: 1.5 }}>
                        <strong>Next: </strong>{selected.generated_response.recommended_action}
                      </div>

                      {/* Submit buttons */}
                      {selected.status !== 'won' && selected.status !== 'lost' && (
                        <div style={{ marginBottom: 12 }}>
                          {!isDemo && store?.shop_domain ? (
                            <a
                              href={`https://${store.shop_domain}/admin/payments/disputes`}
                              target="_blank" rel="noopener noreferrer"
                              style={{ display: 'block', background: '#111827', color: '#fff', padding: '11px 14px', borderRadius: 9, fontSize: 13, fontWeight: 600, textDecoration: 'none', textAlign: 'center', marginBottom: 8 }}>
                              Open in Shopify Payments →
                            </a>
                          ) : (
                            <div style={{ background: '#f7f7f8', color: '#9ca3af', padding: '11px 14px', borderRadius: 9, fontSize: 12, textAlign: 'center', border: '1px solid #e8e8e8', marginBottom: 8 }}>
                              Submit via Shopify Payments (demo — connect a real store)
                            </div>
                          )}
                        </div>
                      )}

                      {/* Mark won/lost */}
                      {selected.status !== 'won' && selected.status !== 'lost' && (
                        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                          <button onClick={() => markOutcome(selected.id, 'won')} disabled={!!marking}
                            style={{ flex: 1, background: '#f0fdf4', color: '#15803d', border: '1.5px solid #bbf7d0', borderRadius: 9, padding: '9px', fontSize: 13, fontWeight: 600, cursor: marking ? 'default' : 'pointer', fontFamily: 'inherit' }}>
                            {marking === selected.id + 'won' ? '…' : '✓ Mark won'}
                          </button>
                          <button onClick={() => markOutcome(selected.id, 'lost')} disabled={!!marking}
                            style={{ flex: 1, background: '#fef2f2', color: '#dc2626', border: '1.5px solid #fecaca', borderRadius: 9, padding: '9px', fontSize: 13, fontWeight: 600, cursor: marking ? 'default' : 'pointer', fontFamily: 'inherit' }}>
                            {marking === selected.id + 'lost' ? '…' : '✕ Mark lost'}
                          </button>
                        </div>
                      )}

                      {/* Won/lost result badge */}
                      {(selected.status === 'won' || selected.status === 'lost') && (
                        <div style={{ background: selected.status === 'won' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${selected.status === 'won' ? '#bbf7d0' : '#fecaca'}`, borderRadius: 10, padding: '14px', marginBottom: 14, textAlign: 'center' }}>
                          <div style={{ fontSize: 20, marginBottom: 4 }}>{selected.status === 'won' ? '🏆' : '😞'}</div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: selected.status === 'won' ? '#15803d' : '#dc2626' }}>
                            {selected.status === 'won' ? 'Dispute won!' : 'Dispute lost'}
                          </div>
                          {selected.status === 'won' && (
                            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 3 }}>{selected.currency} {selected.amount?.toFixed(2)} recovered</div>
                          )}
                        </div>
                      )}

                      {/* Response letter */}
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Response letter</div>
                          <button onClick={copyLetter}
                            style={{ fontSize: 12, background: copied ? '#16a34a' : '#111827', color: '#fff', border: 'none', borderRadius: 7, padding: '5px 12px', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit', transition: 'background .15s' }}>
                            {copied ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                        <textarea readOnly value={selected.generated_response.response_letter} rows={9}
                          style={{ width: '100%', border: '1px solid #e8e8e8', borderRadius: 10, padding: '12px', fontSize: 12, lineHeight: 1.7, resize: 'none', background: '#f7f7f8', color: '#374151', fontFamily: 'inherit' }} />
                      </div>

                      {/* How to submit */}
                      <details style={{ marginBottom: 14 }}>
                        <summary style={{ fontSize: 12, color: '#6b7280', cursor: 'pointer', fontWeight: 600, padding: '6px 0', userSelect: 'none' }}>
                          How to submit this response ▾
                        </summary>
                        <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.9, paddingTop: 8, paddingLeft: 4 }}>
                          1. Click "Open in Shopify Payments" above<br />
                          2. Find this dispute by order number<br />
                          3. Click "Submit evidence"<br />
                          4. Paste the response letter into the evidence field<br />
                          5. Upload any supporting documents from the checklist<br />
                          6. Submit before the deadline shown
                        </div>
                      </details>

                      {/* Evidence checklist */}
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#111827' }}>Evidence checklist</div>
                        {selected.generated_response.evidence_checklist?.map((e, i) => (
                          <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12, padding: '5px 0', borderBottom: '1px solid #f3f4f6', alignItems: 'center' }}>
                            <span style={{ flexShrink: 0 }}>{e.available ? '✅' : e.required ? '❌' : '⚪'}</span>
                            <span style={{ flex: 1, color: e.available ? '#374151' : e.required ? '#dc2626' : '#9ca3af' }}>{e.item}</span>
                            {e.required && !e.available && <span style={{ fontSize: 10, color: '#dc2626', fontWeight: 700, flexShrink: 0 }}>REQUIRED</span>}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {tab === 'settings' && (
          <div style={{ padding: '28px 28px 40px', maxWidth: 600 }}>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111827', letterSpacing: -0.3, marginBottom: 24 }}>Settings</h1>

            <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: 24, marginBottom: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: '#111827' }}>Connected store</div>
              {[
                ['Shop domain', store?.shop_domain || '—'],
                ['Plan', store?.plan || '—'],
                ['Mode', isDemo ? 'Demo' : 'Live'],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ fontSize: 13, color: '#6b7280' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#111827', textTransform: 'capitalize' }}>{val}</span>
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: 24, marginBottom: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: '#111827' }}>Email notifications</div>
              {['New dispute detected', 'Response ready to review', 'Weekly win rate summary'].map((item, i, arr) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <span style={{ fontSize: 13, color: '#374151' }}>{item}</span>
                  <div style={{ width: 38, height: 21, background: '#16a34a', borderRadius: 11, position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', right: 2, top: 2, width: 17, height: 17, background: '#fff', borderRadius: '50%' }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: '#111827' }}>Subscription</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, textTransform: 'capitalize', color: '#111827' }}>{store?.plan || 'Trial'} plan</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 3 }}>{store?.plan === 'trial' ? 'Free trial — 14 days' : 'Active subscription'}</div>
                </div>
                <a href="/pricing" style={{ background: '#16a34a', color: '#fff', padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                  {store?.plan === 'trial' ? 'Upgrade now' : 'Manage plan'}
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
