'use client'
import { useState, useEffect } from 'react'

type Dispute = {
  id: string
  order_id: string
  amount: number
  currency: string
  reason: string
  reason_code: string
  network: string
  status: string
  due_by: string | null
  generated_response: {
    summary: string
    evidence_strength: string
    win_probability: number
    response_letter: string
    key_arguments: string[]
    recommended_action: string
    evidence_checklist: { item: string; available: boolean; required: boolean; importance: string }[]
  } | null
  created_at: string
}

const STATUS_STYLES: Record<string, string> = {
  pending:            'background:#fef9c3;color:#854d0e',
  response_generated: 'background:#dcfce7;color:#166534',
  submitted:          'background:#dbeafe;color:#1e40af',
  won:                'background:#f0fdf4;color:#15803d',
  lost:               'background:#fef2f2;color:#991b1b',
}

const STRENGTH_COLOR: Record<string, string> = {
  low:      '#dc2626',
  medium:   '#d97706',
  high:     '#16a34a',
  critical: '#15803d',
}

export default function Dashboard() {
  const [disputes, setDisputes]   = useState<Dispute[]>([])
  const [selected, setSelected]   = useState<Dispute | null>(null)
  const [loading, setLoading]     = useState(true)
  const [copied, setCopied]       = useState(false)
  const [stats, setStats]         = useState({ total: 0, won: 0, pending: 0, recovered: 0 })

  useEffect(() => {
    fetch('/api/disputes')
      .then(r => r.json())
      .then(data => {
        setDisputes(data.disputes || [])
        setStats(data.stats || {})
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const copyLetter = () => {
    if (!selected?.generated_response?.response_letter) return
    navigator.clipboard.writeText(selected.generated_response.response_letter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const winPct = stats.total > 0
    ? Math.round((stats.won / stats.total) * 100)
    : 0

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      {/* Nav */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>
          Dispute<span style={{ color: '#16a34a' }}>IQ</span>
        </span>
        <div style={{ display: 'flex', gap: 20, fontSize: 14, color: '#6b7280', alignItems: 'center' }}>
          <a href="/dashboard/settings" style={{ color: 'inherit' }}>Settings</a>
          <a href="/pricing" style={{ color: '#16a34a', fontWeight: 600 }}>Upgrade</a>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total disputes', value: stats.total, sub: 'all time' },
            { label: 'Win rate', value: `${winPct}%`, sub: 'vs 30% avg', color: '#16a34a' },
            { label: 'Open disputes', value: stats.pending, sub: 'need attention', color: stats.pending > 0 ? '#d97706' : undefined },
            { label: 'Revenue recovered', value: `$${stats.recovered.toLocaleString()}`, sub: 'from won disputes', color: '#16a34a' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 20px 16px' }}>
              <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1, color: s.color || '#0a0a0a' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 3 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 20 }}>
          {/* Disputes list */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Disputes</h2>
              <span style={{ fontSize: 13, color: '#6b7280' }}>{disputes.length} total</span>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280', fontSize: 14 }}>Loading disputes...</div>
            ) : disputes.length === 0 ? (
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '60px 32px', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>No disputes yet</div>
                <div style={{ fontSize: 14, color: '#6b7280' }}>When a chargeback arrives, we'll detect it automatically and generate a response.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {disputes.map(d => (
                  <div
                    key={d.id}
                    onClick={() => setSelected(selected?.id === d.id ? null : d)}
                    style={{
                      background: '#fff',
                      border: `1px solid ${selected?.id === d.id ? '#16a34a' : '#e5e7eb'}`,
                      borderRadius: 12, padding: '16px 18px', cursor: 'pointer',
                      transition: 'border-color .15s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: 15 }}>Order #{d.order_id.slice(-6)}</span>
                        <span style={{ fontSize: 13, color: '#6b7280', marginLeft: 10 }}>{d.network.toUpperCase()} {d.reason_code}</span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{d.currency} {d.amount.toFixed(2)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, padding: '3px 8px', borderRadius: 20, fontWeight: 500, ...parseStyle(STATUS_STYLES[d.status] || '') }}>
                        {d.status.replace('_', ' ')}
                      </span>
                      {d.generated_response && (
                        <span style={{ fontSize: 12, color: STRENGTH_COLOR[d.generated_response.evidence_strength] || '#6b7280', fontWeight: 500 }}>
                          {Math.round(d.generated_response.win_probability * 100)}% win probability
                        </span>
                      )}
                      {d.due_by && (
                        <span style={{ fontSize: 12, color: getDueColor(d.due_by) }}>
                          Due {new Date(d.due_by).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Response panel */}
          {selected && (
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '24px', height: 'fit-content' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontWeight: 700, fontSize: 16 }}>Dispute response</h3>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#6b7280' }}>×</button>
              </div>

              {!selected.generated_response ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280', fontSize: 14 }}>
                  <div style={{ marginBottom: 12 }}>⚙️ Generating response...</div>
                  <div>This usually takes 15-30 seconds</div>
                </div>
              ) : (
                <>
                  {/* Summary */}
                  <div style={{ background: '#f9fafb', borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Summary</div>
                    <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{selected.generated_response.summary}</div>
                  </div>

                  {/* Key metrics */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: '#16a34a' }}>{Math.round(selected.generated_response.win_probability * 100)}%</div>
                      <div style={{ fontSize: 12, color: '#15803d' }}>Win probability</div>
                    </div>
                    <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: STRENGTH_COLOR[selected.generated_response.evidence_strength] }}>
                        {selected.generated_response.evidence_strength.toUpperCase()}
                      </div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>Evidence strength</div>
                    </div>
                  </div>

                  {/* Recommended action */}
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '12px 14px', marginBottom: 16, fontSize: 14, color: '#1e40af' }}>
                    <strong>Recommended action:</strong> {selected.generated_response.recommended_action}
                  </div>

                  {/* Key arguments */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Key arguments</div>
                    {selected.generated_response.key_arguments.map((arg, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#374151', marginBottom: 6 }}>
                        <span style={{ color: '#16a34a', fontWeight: 700, flexShrink: 0 }}>✓</span>
                        <span>{arg}</span>
                      </div>
                    ))}
                  </div>

                  {/* Response letter */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>Response letter</div>
                      <button onClick={copyLetter} style={{ fontSize: 13, background: copied ? '#16a34a' : '#0a0a0a', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontWeight: 500 }}>
                        {copied ? '✓ Copied' : 'Copy letter'}
                      </button>
                    </div>
                    <textarea
                      readOnly
                      value={selected.generated_response.response_letter}
                      style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px', fontSize: 13, lineHeight: 1.7, resize: 'none', background: '#f9fafb', color: '#374151', height: 240 }}
                    />
                  </div>

                  {/* Evidence checklist */}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Evidence checklist</div>
                    {selected.generated_response.evidence_checklist.map((e, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, padding: '5px 0', borderBottom: '1px solid #f3f4f6', alignItems: 'center' }}>
                        <span>{e.available ? '✅' : e.required ? '❌' : '⚪'}</span>
                        <span style={{ flex: 1, color: e.available ? '#374151' : e.required ? '#dc2626' : '#9ca3af' }}>{e.item}</span>
                        {e.required && !e.available && <span style={{ fontSize: 11, color: '#dc2626', fontWeight: 600 }}>REQUIRED</span>}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function parseStyle(str: string): React.CSSProperties {
  const obj: any = {}
  str.split(';').forEach(part => {
    const [k, v] = part.split(':').map(s => s.trim())
    if (k && v) obj[k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = v
  })
  return obj
}

function getDueColor(dueBy: string): string {
  const days = (new Date(dueBy).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  if (days < 2)  return '#dc2626'
  if (days < 5)  return '#d97706'
  return '#6b7280'
}
