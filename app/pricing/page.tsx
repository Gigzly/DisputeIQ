'use client'
import { useState } from 'react'

const PLANS = [
  { key:'starter', name:'Starter', price:99, period:'mo', sub:'Up to $250k GMV · 20 disputes/month',
    features:['20 dispute responses/month','All 40 reason codes mapped','Shopify integration','Win rate dashboard','Email alerts','14-day free trial'] },
  { key:'growth', name:'Growth', price:199, period:'mo', sub:'Up to $1M GMV · Unlimited disputes', featured:true,
    features:['Unlimited dispute responses','All 40 reason codes','Auto-evidence assembly','Fraud pattern detection','Revenue recovery reports','Priority support','14-day free trial'] },
  { key:'scale', name:'Scale', price:399, period:'mo', sub:'Up to $5M GMV · Multi-store',
    features:['Everything in Growth','Multi-store support','API access','Custom reason code rules','Dedicated onboarding','Slack support','14-day free trial'] },
]

export default function Pricing() {
  const [loading, setLoading] = useState<string|null>(null)

  const checkout = async (plan: string) => {
    setLoading(plan)
    try {
      // Get store_id from URL or session
      const urlParams = new URLSearchParams(window.location.search)
      const shopId = urlParams.get('shop_id')
      if (!shopId) {
        // Redirect to connect first
        window.location.href = '/dashboard'
        return
      }
      const res = await fetch('/api/checkout', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ plan, shop_id: shopId })
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch(e) { console.error(e) }
    setLoading(null)
  }

  return (
    <div style={{minHeight:'100vh',background:'#f9fafb',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',padding:'60px 24px'}}>
      <div style={{maxWidth:900,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:16}}>
          <a href="/" style={{fontWeight:800,fontSize:20,textDecoration:'none',color:'#0a0a0a'}}>Dispute<span style={{color:'#16a34a'}}>IQ</span></a>
        </div>
        <div style={{textAlign:'center',marginBottom:48}}>
          <h1 style={{fontSize:36,fontWeight:900,letterSpacing:-1.5,marginBottom:10}}>Simple, honest pricing</h1>
          <p style={{fontSize:16,color:'#6b7280'}}>14-day free trial on all plans. Most merchants recover the cost in the first month.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:18,alignItems:'start',marginBottom:40}}>
          {PLANS.map(plan=>(
            <div key={plan.key} style={{background:'#fff',border:plan.featured?'2px solid #16a34a':'1px solid #e5e7eb',borderRadius:16,padding:28,position:'relative'}}>
              {plan.featured&&<div style={{position:'absolute',top:-13,left:'50%',transform:'translateX(-50%)',background:'#16a34a',color:'#fff',padding:'4px 16px',borderRadius:20,fontSize:12,fontWeight:700,whiteSpace:'nowrap'}}>Most popular</div>}
              <div style={{fontSize:13,color:'#6b7280',fontWeight:500,marginBottom:6}}>{plan.name}</div>
              <div style={{fontSize:44,fontWeight:900,letterSpacing:-2,marginBottom:2}}>${plan.price}</div>
              <div style={{fontSize:13,color:'#6b7280',marginBottom:6}}>per {plan.period}</div>
              <div style={{fontSize:12,color:'#9ca3af',marginBottom:22}}>{plan.sub}</div>
              <ul style={{listStyle:'none',marginBottom:24,padding:0}}>
                {plan.features.map(f=>(
                  <li key={f} style={{fontSize:14,color:'#374151',padding:'7px 0',borderBottom:'1px solid #f3f4f6',display:'flex',gap:8,alignItems:'flex-start'}}>
                    <span style={{color:'#16a34a',fontWeight:800,flexShrink:0}}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <button onClick={()=>checkout(plan.key)} disabled={loading===plan.key}
                style={{width:'100%',padding:'13px 0',borderRadius:10,fontSize:14,fontWeight:600,cursor:loading===plan.key?'not-allowed':'pointer',border:'none',
                  background:plan.featured?'#16a34a':'#0a0a0a',color:'#fff',opacity:loading===plan.key?0.7:1}}>
                {loading===plan.key?'Redirecting...':'Start free trial'}
              </button>
            </div>
          ))}
        </div>
        {/* ROI calculator teaser */}
        <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:14,padding:'24px 28px',textAlign:'center',marginBottom:32}}>
          <div style={{fontWeight:700,fontSize:16,marginBottom:8}}>Will it pay for itself?</div>
          <p style={{fontSize:14,color:'#6b7280',marginBottom:0}}>A merchant doing $500k GMV losing 2.5% to chargebacks is losing $12,500/year. Improving win rate from 30% to 62% recovers ~$4,000/year. Growth plan costs $2,388/year. Net gain: $1,612 — before you count the time saved.</p>
        </div>
        <div style={{textAlign:'center',fontSize:13,color:'#9ca3af'}}>All plans include 14-day free trial · No credit card required to start · Cancel anytime</div>
      </div>
    </div>
  )
}
