'use client'
import { useState } from 'react'

export default function ROICalculator() {
  const [gmv, setGmv]               = useState(500000)
  const [cbRate, setCbRate]          = useState(0.8)
  const [currentWin, setCurrentWin]  = useState(30)
  const [plan, setPlan]              = useState<'starter'|'growth'>('growth')

  const annualDisputed    = gmv * (cbRate / 100)
  const currentRecovered  = annualDisputed * (currentWin / 100)
  const withDisputeIQ     = annualDisputed * 0.62
  const additionalRecovery = Math.max(0, withDisputeIQ - currentRecovered)
  const planCost          = plan === 'starter' ? 99 * 12 : 199 * 12
  const netGain           = additionalRecovery - planCost
  const roi               = planCost > 0 ? Math.round((additionalRecovery / planCost) * 100) : 0

  const fmt = (n: number) => '$' + Math.round(n).toLocaleString()

  const sliderStyle = {
    width: '100%', appearance: 'none' as const, height: 4, borderRadius: 2,
    background: '#e5e7eb', outline: 'none', cursor: 'pointer',
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '32px 36px', maxWidth: 680, margin: '0 auto', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: -0.3, marginBottom: 6, color: '#111827' }}>
        How much will you recover?
      </div>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 28 }}>Adjust the sliders to match your store. Results update instantly.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
            Annual GMV: <span style={{ color: '#16a34a' }}>{fmt(gmv)}</span>
          </label>
          <input type="range" min={50000} max={5000000} step={50000} value={gmv}
            onChange={e => setGmv(Number(e.target.value))} style={sliderStyle} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
            <span>$50k</span><span>$5M</span>
          </div>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
            Chargeback rate: <span style={{ color: '#16a34a' }}>{cbRate.toFixed(1)}% of GMV</span>
          </label>
          <input type="range" min={0.1} max={3} step={0.1} value={cbRate}
            onChange={e => setCbRate(Number(e.target.value))} style={sliderStyle} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
            <span>0.1%</span><span>3%</span>
          </div>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
            Current win rate: <span style={{ color: currentWin >= 50 ? '#16a34a' : '#d97706' }}>{currentWin}%</span>
          </label>
          <input type="range" min={5} max={70} step={5} value={currentWin}
            onChange={e => setCurrentWin(Number(e.target.value))} style={sliderStyle} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
            <span>5%</span><span>70%</span>
          </div>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Plan</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {([['starter', '$99/mo'], ['growth', '$199/mo']] as const).map(([key, label]) => (
              <button key={key} onClick={() => setPlan(key)}
                style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1.5px solid ${plan === key ? '#16a34a' : '#e5e7eb'}`, background: plan === key ? '#f0fdf4' : '#fff', color: plan === key ? '#15803d' : '#374151', fontWeight: plan === key ? 600 : 400, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Disputed annually', value: fmt(annualDisputed), sub: `${cbRate.toFixed(1)}% of ${fmt(gmv)} GMV`, color: '#374151' },
          { label: 'Additional recovery', value: fmt(additionalRecovery), sub: `vs current ${currentWin}% win rate`, color: '#16a34a' },
          { label: 'Net gain (after plan)', value: netGain >= 0 ? fmt(netGain) : `-${fmt(Math.abs(netGain))}`, sub: `${roi}% ROI on plan cost`, color: netGain >= 0 ? '#16a34a' : '#dc2626' },
        ].map(s => (
          <div key={s.label} style={{ background: '#f7f7f8', borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6, fontWeight: 600 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color, letterSpacing: -0.5 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 3 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {netGain > 0 && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#15803d', lineHeight: 1.6 }}>
          <strong>Result:</strong> At your volume and chargeback rate, DisputeIQ pays for itself{' '}
          {roi > 200 ? 'many times over' : 'and generates a net profit'} — recovering an additional{' '}
          {fmt(additionalRecovery)} while the plan costs {fmt(planCost)}/year.
        </div>
      )}
    </div>
  )
}
