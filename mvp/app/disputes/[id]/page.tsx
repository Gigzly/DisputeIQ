'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

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
  created_at: string
  generated_response: {
    summary: string
    evidence_strength: string
    win_probability: number
    response_letter: string
    key_arguments: string[]
    recommended_action: string
    evidence_checklist: { item: string; available: boolean; required: boolean; importance: string }[]
    compelling_evidence_30?: { eligible: boolean; matching_elements: string[]; recommendation: string } | null
  } | null
}

const STATUS: Record<string, { bg: string; color: string; label: string }> = {
  pending:            { bg: '#fef9c3', color: '#854d0e',  label: 'Pending' },
  response_generated: { bg: '#dcfce7', color: '#166534',  label: 'Response ready' },
  submitted:          { bg: '#dbeafe', color: '#1e40af',  label: 'Submitted' },
  won:                { bg: '#f0fdf4', color: '#15803d',  label: 'Won ✓' },
  lost:               { bg: '#fef2f2', color: '#991b1b',  label: 'Lost' },
}

function daysBetween(dateStr: string): number | null {
  const t = new Date(dateStr).getTime()
  if (isNaN(t)) return null
  return Math.ceil((t - Date.now()) / 86400000)
}

export default function DisputeDetail({ params }: { params: { id: string } }) {
  const [dispute, setDispute] = useState<Dispute | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied]   = useState(false)
  const [marking, setMarking] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [shopDomain, setShopDomain] = useState('')

  useEffect(() => {
    const init = async () => {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/auth/login'; return }

      // Get store domain for submit button
      const storeRes = await fetch(`/api/store?email=${encodeURIComponent(user.email || '')}`)
      if (storeRes.ok) {
        const { store } = await storeRes.json()
        if (store) setShopDomain(store.shop_domain)
      }

      // Fetch dispute directly from Supabase (client-side)
      const { data } = await supabase
        .from('disputes')
        .select('*')
        .eq('id', params.id)
        .single()

      if (data) setDispute(data as Dispute)
      setLoading(false)
    }
    init()
  }, [params.id])

  const copyLetter = () => {
    if (!dispute?.generated_response?.response_letter) return
    navigator.clipboard.writeText(dispute.generated_response.response_letter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const markOutcome = async (outcome: 'won' | 'lost') => {
    if (!dispute) return
    setMarking(true)
    const res = await fetch(`/api/disputes/${dispute.id}/outcome`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ outcome }),
    })
    if (res.ok && dispute) setDispute({ ...dispute, status: outcome, outcome })
    setMarking(false)
  }

  const autoSubmit = async () => {
    if (!dispute || !shopDomain) return
    setSubmitting(true)
    const res = await fetch('/api/disputes/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dispute_id: dispute.id, shop_domain: shopDomain }),
    })
    if (res.ok && dispute) setDispute({ ...dispute, status: 'submitted' })
    setSubmitting(false)
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: '-apple-system,sans-serif', color: '#6b7280', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>Dispute<span style={{ color: '#16a34a' }}>IQ</span></div>
      <div>Loading dispute…</div>
    </div>
  )

  if (!dispute) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: '-apple-system,sans-serif', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 32 }}>🔍</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>Dispute not found</div>
      <Link href="/dashboard" style={{ color: '#16a34a', textDecoration: 'none', fontSize: 14 }}>← Back to dashboard</Link>
    </div>
  )

  const sc      = STATUS[dispute.status] || STATUS.pending
  const daysLeft = dispute.due_by ? daysBetween(dispute.due_by) : null
  const isDemo  = shopDomain.startsWith('demo-')
  const gr      = dispute.generated_response

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f8', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      <nav style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '0 28px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/dashboard" style={{ fontWeight: 800, fontSize: 17, textDecoration: 'none', color: '#111827' }}>
          Dispute<span style={{ color: '#16a34a' }}>IQ</span>
        </Link>
        <Link href="/dashboard" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>← Dashboard</Link>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 24px 60px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111827', letterSpacing: -0.3, marginBottom: 4 }}>
              Order #{(dispute.order_id || '').slice(-6) || '—'}
            </h1>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, fontWeight: 600, background: sc.bg, color: sc.color }}>{sc.label}</span>
              <span style={{ fontSize: 13, color: '#6b7280' }}>{dispute.currency} {dispute.amount?.toFixed(2)}</span>
              <span style={{ fontSize: 13, color: '#9ca3af' }}>{(dispute.network || '').toUpperCase()} {dispute.reason_code}</span>
              {daysLeft !== null && !['won', 'lost'].includes(dispute.status) && (
                <span style={{ fontSize: 13, fontWeight: daysLeft <= 2 ? 700 : 400, color: daysLeft < 0 ? '#dc2626' : daysLeft <= 2 ? '#dc2626' : daysLeft <= 5 ? '#d97706' : '#9ca3af' }}>
                  {daysLeft < 0 ? 'Overdue' : daysLeft === 0 ? 'Due today' : `Due in ${daysLeft}d`}
                </span>
              )}
            </div>
          </div>
          {gr && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#16a34a', letterSpacing: -1 }}>
                {Math.round(gr.win_probability * 100)}%
              </div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>Win probability</div>
            </div>
          )}
        </div>

        {!gr ? (
          <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: '48px', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚙️</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: '#111827' }}>Generating response…</div>
            <div style={{ fontSize: 14 }}>Usually takes 30–60 seconds. Refresh to check.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* CE3.0 banner */}
            {gr.compelling_evidence_30 && (
              <div style={{ background: gr.compelling_evidence_30.eligible ? '#f0fdf4' : '#fffbeb', border: `1px solid ${gr.compelling_evidence_30.eligible ? '#bbf7d0' : '#fde68a'}`, borderRadius: 12, padding: '14px 18px' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: gr.compelling_evidence_30.eligible ? '#15803d' : '#92400e', marginBottom: 4 }}>
                  {gr.compelling_evidence_30.eligible ? '⚡ CE3.0 Eligible — automatic reversal pathway' : '⚠️ CE3.0 Not Eligible'}
                </div>
                <div style={{ fontSize: 13, color: gr.compelling_evidence_30.eligible ? '#166534' : '#78350f', lineHeight: 1.6 }}>
                  {gr.compelling_evidence_30.recommendation}
                </div>
              </div>
            )}

            {/* Summary + metrics */}
            <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 10 }}>Summary</div>
              <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, marginBottom: 18 }}>{gr.summary}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#16a34a' }}>{Math.round(gr.win_probability * 100)}%</div>
                  <div style={{ fontSize: 11, color: '#15803d', fontWeight: 600 }}>Win probability</div>
                </div>
                <div style={{ background: '#f7f7f8', borderRadius: 10, padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', textTransform: 'capitalize' }}>{gr.evidence_strength}</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>Evidence strength</div>
                </div>
                <div style={{ background: '#eff6ff', borderRadius: 10, padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1e40af' }}>{dispute.network?.toUpperCase()}</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>{dispute.reason_code}</div>
                </div>
              </div>
            </div>

            {/* Next step */}
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '14px 18px', fontSize: 13, color: '#1e40af' }}>
              <strong>Next step: </strong>{gr.recommended_action}
            </div>

            {/* Action buttons */}
            {!['won', 'lost'].includes(dispute.status) && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {dispute.status !== 'submitted' && (
                  <button onClick={autoSubmit} disabled={submitting}
                    style={{ background: submitting ? '#6b7280' : '#111827', color: '#fff', border: 'none', borderRadius: 9, padding: '11px 20px', fontSize: 13, fontWeight: 600, cursor: submitting ? 'default' : 'pointer', fontFamily: 'inherit' }}>
                    {submitting ? 'Submitting…' : isDemo ? 'Submit (demo)' : 'Auto-submit to Shopify →'}
                  </button>
                )}
                {!isDemo && shopDomain && (
                  <a href={`https://${shopDomain}/admin/payments/disputes`} target="_blank" rel="noopener noreferrer"
                    style={{ background: '#f7f7f8', color: '#374151', border: '1px solid #e8e8e8', borderRadius: 9, padding: '11px 18px', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
                    Open Shopify Payments →
                  </a>
                )}
                <button onClick={() => markOutcome('won')} disabled={marking}
                  style={{ background: '#f0fdf4', color: '#15803d', border: '1.5px solid #bbf7d0', borderRadius: 9, padding: '11px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  ✓ Mark won
                </button>
                <button onClick={() => markOutcome('lost')} disabled={marking}
                  style={{ background: '#fef2f2', color: '#dc2626', border: '1.5px solid #fecaca', borderRadius: 9, padding: '11px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  ✕ Mark lost
                </button>
              </div>
            )}

            {['won', 'lost'].includes(dispute.status) && (
              <div style={{ background: dispute.status === 'won' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${dispute.status === 'won' ? '#bbf7d0' : '#fecaca'}`, borderRadius: 12, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{dispute.status === 'won' ? '🏆' : '😞'}</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: dispute.status === 'won' ? '#15803d' : '#dc2626' }}>
                  {dispute.status === 'won' ? 'Dispute won!' : 'Dispute lost'}
                </div>
                {dispute.status === 'won' && (
                  <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{dispute.currency} {dispute.amount?.toFixed(2)} recovered</div>
                )}
              </div>
            )}

            {/* Response letter */}
            <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Response letter</div>
                <button onClick={copyLetter}
                  style={{ fontSize: 12, background: copied ? '#16a34a' : '#111827', color: '#fff', border: 'none', borderRadius: 7, padding: '5px 12px', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit' }}>
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <textarea readOnly value={gr.response_letter} rows={12}
                style={{ width: '100%', border: '1px solid #e8e8e8', borderRadius: 10, padding: '14px', fontSize: 13, lineHeight: 1.7, resize: 'none', background: '#f7f7f8', color: '#374151', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>

            {/* Evidence checklist */}
            <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Evidence checklist</div>
              {gr.evidence_checklist?.map((e, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, padding: '7px 0', borderBottom: '1px solid #f3f4f6', alignItems: 'center' }}>
                  <span style={{ flexShrink: 0 }}>{e.available ? '✅' : e.required ? '❌' : '⚪'}</span>
                  <span style={{ flex: 1, color: e.available ? '#374151' : e.required ? '#dc2626' : '#9ca3af' }}>{e.item}</span>
                  {e.required && !e.available && <span style={{ fontSize: 10, color: '#dc2626', fontWeight: 700 }}>REQUIRED</span>}
                </div>
              ))}
            </div>

            {/* Key arguments */}
            {gr.key_arguments?.length > 0 && (
              <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Key arguments</div>
                {gr.key_arguments.map((arg, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: '#374151', padding: '6px 0', lineHeight: 1.6 }}>
                    <span style={{ color: '#16a34a', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>{arg}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
