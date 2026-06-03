'use client'
import { useState } from 'react'

const REASON_CODES = [
  { code:'10.4', network:'visa', label:'Visa 10.4 — Fraud (card absent)' },
  { code:'13.1', network:'visa', label:'Visa 13.1 — Item not received' },
  { code:'13.3', network:'visa', label:'Visa 13.3 — Not as described' },
  { code:'13.6', network:'visa', label:'Visa 13.6 — Credit not processed' },
  { code:'4853', network:'mastercard', label:'Mastercard 4853 — Not as described' },
  { code:'4837', network:'mastercard', label:'Mastercard 4837 — No authorisation' },
  { code:'4855', network:'mastercard', label:'Mastercard 4855 — Goods not received' },
  { code:'C08',  network:'amex', label:'Amex C08 — Goods not received' },
  { code:'FR2',  network:'amex', label:'Amex FR2 — Fraud' },
]

export default function NewDispute() {
  const [form, setForm] = useState({ order_id:'', amount:'', currency:'USD', reason_code:'10.4', network:'visa', due_by:'' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({...f, [k]:v}))

  const submit = async () => {
    if (!form.order_id || !form.amount) { setError('Order ID and amount are required'); return }
    setLoading(true); setError('')
    const res = await fetch('/api/disputes/manual', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(form)
    })
    if (res.ok) { setDone(true) } else { setError('Failed to create dispute'); setLoading(false) }
  }

  if (done) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:48,marginBottom:16}}>✅</div>
        <div style={{fontSize:20,fontWeight:700,marginBottom:8}}>Dispute created</div>
        <div style={{fontSize:14,color:'#6b7280',marginBottom:24}}>We're generating your response now. It'll be ready in about 60 seconds.</div>
        <a href="/dashboard" style={{background:'#16a34a',color:'#fff',padding:'12px 24px',borderRadius:10,fontSize:14,fontWeight:600,textDecoration:'none'}}>View in dashboard</a>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#f9fafb',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'}}>
      <nav style={{background:'#fff',borderBottom:'1px solid #e5e7eb',padding:'0 32px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <a href="/dashboard" style={{fontWeight:800,fontSize:18,textDecoration:'none',color:'#0a0a0a'}}>Dispute<span style={{color:'#16a34a'}}>IQ</span></a>
        <a href="/dashboard" style={{fontSize:13,color:'#6b7280'}}>← Cancel</a>
      </nav>
      <div style={{maxWidth:560,margin:'0 auto',padding:'48px 24px'}}>
        <h1 style={{fontSize:24,fontWeight:800,letterSpacing:-0.5,marginBottom:6}}>Add dispute manually</h1>
        <p style={{fontSize:14,color:'#6b7280',marginBottom:32}}>For disputes that arrived outside the automatic detection window.</p>
        <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:14,padding:24,display:'flex',flexDirection:'column',gap:16}}>
          {[
            {label:'Shopify Order ID', key:'order_id', placeholder:'e.g. 1234567890'},
            {label:'Dispute amount', key:'amount', placeholder:'e.g. 149.99', type:'number'},
          ].map(f => (
            <div key={f.key}>
              <label style={{display:'block',fontSize:13,fontWeight:500,marginBottom:6}}>{f.label}</label>
              <input type={f.type||'text'} value={(form as any)[f.key]} onChange={e=>set(f.key,e.target.value)}
                placeholder={f.placeholder}
                style={{width:'100%',border:'1.5px solid #e5e7eb',borderRadius:10,padding:'11px 14px',fontSize:14,outline:'none'}} />
            </div>
          ))}
          <div>
            <label style={{display:'block',fontSize:13,fontWeight:500,marginBottom:6}}>Reason code</label>
            <select value={`${form.reason_code}|${form.network}`}
              onChange={e => { const [code,net] = e.target.value.split('|'); set('reason_code',code); set('network',net) }}
              style={{width:'100%',border:'1.5px solid #e5e7eb',borderRadius:10,padding:'11px 14px',fontSize:14,outline:'none',background:'#fff'}}>
              {REASON_CODES.map(rc => <option key={rc.code+rc.network} value={`${rc.code}|${rc.network}`}>{rc.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{display:'block',fontSize:13,fontWeight:500,marginBottom:6}}>Response due by</label>
            <input type="date" value={form.due_by} onChange={e=>set('due_by',e.target.value)}
              style={{width:'100%',border:'1.5px solid #e5e7eb',borderRadius:10,padding:'11px 14px',fontSize:14,outline:'none'}} />
          </div>
          {error && <div style={{color:'#dc2626',fontSize:13,background:'#fef2f2',padding:'10px 12px',borderRadius:8}}>{error}</div>}
          <button onClick={submit} disabled={loading}
            style={{background:loading?'#86efac':'#16a34a',color:'#fff',border:'none',borderRadius:10,padding:'13px',fontSize:15,fontWeight:600,cursor:loading?'not-allowed':'pointer'}}>
            {loading?'Creating...':'Generate dispute response'}
          </button>
        </div>
      </div>
    </div>
  )
}
