'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const REASON_CODES = [
  { code: '10.4', network: 'visa',       label: 'Visa 10.4 — Fraud (card absent)' },
  { code: '13.1', network: 'visa',       label: 'Visa 13.1 — Item not received' },
  { code: '13.3', network: 'visa',       label: 'Visa 13.3 — Not as described' },
  { code: '13.6', network: 'visa',       label: 'Visa 13.6 — Credit not processed' },
  { code: '13.7', network: 'visa',       label: 'Visa 13.7 — Cancelled merchandise' },
  { code: '4837', network: 'mastercard', label: 'MC 4837 — No authorisation' },
  { code: '4853', network: 'mastercard', label: 'MC 4853 — Not as described' },
  { code: '4855', network: 'mastercard', label: 'MC 4855 — Goods not received' },
  { code: 'FR2',  network: 'amex',       label: 'Amex FR2 — Fraud' },
  { code: 'C08',  network: 'amex',       label: 'Amex C08 — Goods not received' },
  { code: 'C31',  network: 'amex',       label: 'Amex C31 — Not as described' },
]

export default function NewDispute() {
  const [form, setForm] = useState({ order_id: '', amount: '', currency: 'USD', reason_code: '10.4', network: 'visa', due_by: '' })
  const [shop, setShop] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const s = localStorage.getItem('disputeiq_shop') || sessionStorage.getItem('disputeiq_shop') || ''
    setShop(s)
    const due = new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
    setForm(f => ({ ...f, due_by: due.toISOString().slice(0, 10) }))
  }, [])

  const set = (k: string, v: string) => {
    if (k === 'reason_code') {
      const rc = REASON_CODES.find(r => r.code === v)
      if (rc) { setForm(f => ({ ...f, reason_code: v, network: rc.network })); return }
    }
    setForm(f => ({ ...f, [k]: v }))
  }

  const submit = async () => {
    if (!form.order_id.trim()) { setError('Order ID is required'); return }
    if (!form.amount || isNaN(parseFloat(form.amount))) { setError('Valid amount is required'); return }
    if (!shop) { setError('No store connected. Please connect your Shopify store first.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/disputes/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, shop }),
      })
      const data = await res.json()
      if (data.success) setDone(true)
      else setError(data.error || 'Something went wrong. Please try again.')
    } catch(e) { setError('Network error. Please try again.') }
    setLoading(false)
  }

  if (done) return (
    <div style={{minHeight:'100vh',background:'#fafafa',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{textAlign:'center',maxWidth:420,padding:24}}>
        <div style={{fontSize:48,marginBottom:16}}>⚡</div>
        <h1 style={{fontSize:22,fontWeight:800,marginBottom:8}}>Response generating</h1>
        <p style={{fontSize:15,color:'#52525b',lineHeight:1.6,marginBottom:24}}>DisputeIQ is assembling evidence and writing your response. Ready in under 60 seconds.</p>
        <Link href="/dashboard" style={{background:'#16a34a',color:'#fff',padding:'12px 24px',borderRadius:10,textDecoration:'none',fontWeight:600,fontSize:15,display:'inline-block'}}>View in dashboard →</Link>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#fafafa',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'}}>
      <nav style={{background:'#fff',borderBottom:'1px solid #e4e4e7',padding:'0 32px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:50}}>
        <Link href="/dashboard" style={{fontWeight:800,fontSize:18,textDecoration:'none',color:'#09090b',letterSpacing:-0.5}}>Dispute<span style={{color:'#16a34a'}}>IQ</span></Link>
        <Link href="/dashboard" style={{fontSize:14,color:'#a1a1aa',textDecoration:'none'}}>← Back to dashboard</Link>
      </nav>
      <div style={{maxWidth:560,margin:'0 auto',padding:'40px 24px'}}>
        <h1 style={{fontSize:22,fontWeight:800,letterSpacing:-0.5,marginBottom:4,color:'#09090b'}}>Add a dispute manually</h1>
        <p style={{fontSize:14,color:'#52525b',marginBottom:28,lineHeight:1.6}}>Enter the dispute details and DisputeIQ will generate a response in under 60 seconds.</p>

        {!shop && <div style={{background:'#fef9c3',border:'1px solid #fde68a',borderRadius:8,padding:'12px 14px',marginBottom:20,fontSize:13,color:'#92400e'}}>⚠️ No store connected. <Link href="/install" style={{color:'#16a34a',fontWeight:600}}>Connect your store first →</Link></div>}

        <div style={{background:'#fff',border:'1px solid #e4e4e7',borderRadius:12,padding:28,boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
          <div style={{marginBottom:18}}>
            <label style={{display:'block',fontSize:13,fontWeight:600,marginBottom:6}}>Order ID *</label>
            <input value={form.order_id} onChange={e=>set('order_id',e.target.value)} placeholder="e.g. 5001234567 or #1234"
              style={{width:'100%',border:'1.5px solid #e4e4e7',borderRadius:8,padding:'10px 12px',fontSize:14,outline:'none',boxSizing:'border-box'}} />
          </div>
          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:12,marginBottom:18}}>
            <div>
              <label style={{display:'block',fontSize:13,fontWeight:600,marginBottom:6}}>Amount *</label>
              <input value={form.amount} onChange={e=>set('amount',e.target.value)} placeholder="149.99" type="number" min="0" step="0.01"
                style={{width:'100%',border:'1.5px solid #e4e4e7',borderRadius:8,padding:'10px 12px',fontSize:14,outline:'none',boxSizing:'border-box'}} />
            </div>
            <div>
              <label style={{display:'block',fontSize:13,fontWeight:600,marginBottom:6}}>Currency</label>
              <select value={form.currency} onChange={e=>set('currency',e.target.value)}
                style={{width:'100%',border:'1.5px solid #e4e4e7',borderRadius:8,padding:'10px 12px',fontSize:14,outline:'none',background:'#fff',boxSizing:'border-box'}}>
                {['USD','EUR','GBP','AUD','CAD'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{marginBottom:18}}>
            <label style={{display:'block',fontSize:13,fontWeight:600,marginBottom:6}}>Reason code</label>
            <select value={form.reason_code} onChange={e=>set('reason_code',e.target.value)}
              style={{width:'100%',border:'1.5px solid #e4e4e7',borderRadius:8,padding:'10px 12px',fontSize:14,outline:'none',background:'#fff',boxSizing:'border-box'}}>
              {REASON_CODES.map(r=><option key={r.code} value={r.code}>{r.label}</option>)}
            </select>
            <p style={{fontSize:12,color:'#a1a1aa',marginTop:5}}>Check your Shopify Payments or Stripe dashboard for the reason code.</p>
          </div>
          <div style={{marginBottom:24}}>
            <label style={{display:'block',fontSize:13,fontWeight:600,marginBottom:6}}>Response deadline</label>
            <input type="date" value={form.due_by} onChange={e=>set('due_by',e.target.value)}
              style={{width:'100%',border:'1.5px solid #e4e4e7',borderRadius:8,padding:'10px 12px',fontSize:14,outline:'none',boxSizing:'border-box'}} />
            <p style={{fontSize:12,color:'#a1a1aa',marginTop:5}}>Visa/MC: 30-45 days from dispute date. Amex: 20 days.</p>
          </div>
          {error && <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:8,padding:'10px 12px',fontSize:13,color:'#dc2626',marginBottom:16}}>{error}</div>}
          <button onClick={submit} disabled={loading||!shop}
            style={{width:'100%',background:loading?'#86efac':'#16a34a',color:'#fff',border:'none',borderRadius:8,padding:'13px',fontSize:15,fontWeight:700,cursor:loading||!shop?'not-allowed':'pointer'}}>
            {loading?'Generating response...':'Generate response ⚡'}
          </button>
        </div>
      </div>
    </div>
  )
}
