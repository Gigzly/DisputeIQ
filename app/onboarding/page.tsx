'use client'
import { useState } from 'react'

const STEPS = [
  { num:1, title:'Connect your Shopify store', desc:'Read-only OAuth — takes 90 seconds' },
  { num:2, title:'Disputes detected automatically', desc:'We watch for chargebacks 24/7 via webhook' },
  { num:3, title:'Evidence assembled instantly', desc:'Order data, shipping, AVS results — all pulled automatically' },
  { num:4, title:'Response generated in 60 seconds', desc:'Formatted for the exact reason code and card network' },
  { num:5, title:'You review and submit', desc:'2 minutes instead of 45. Win rate: 30% → 60%+' },
]

export default function Onboarding() {
  const [shopUrl, setShopUrl] = useState('')

  const connect = () => {
    let shop = shopUrl.trim().replace(/^https?:\/\//,'').replace(/\/$/,'')
    if (!shop.includes('.myshopify.com')) shop = `${shop}.myshopify.com`
    window.location.href = `/api/shopify-auth?shop=${shop}`
  }

  return (
    <div style={{minHeight:'100vh',background:'#f9fafb',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'}}>
      <nav style={{background:'#fff',borderBottom:'1px solid #e5e7eb',padding:'0 32px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span style={{fontWeight:800,fontSize:18}}>Dispute<span style={{color:'#16a34a'}}>IQ</span></span>
        <a href="/auth/login" style={{fontSize:13,color:'#6b7280'}}>Sign out</a>
      </nav>
      <div style={{maxWidth:640,margin:'0 auto',padding:'60px 24px'}}>
        <div style={{textAlign:'center',marginBottom:44}}>
          <div style={{fontSize:44,marginBottom:16}}>🛡️</div>
          <h1 style={{fontSize:30,fontWeight:900,letterSpacing:-1,marginBottom:10}}>Welcome to DisputeIQ</h1>
          <p style={{fontSize:16,color:'#6b7280',maxWidth:440,margin:'0 auto'}}>Connect your Shopify store and we handle chargebacks automatically. Takes 2 minutes.</p>
        </div>
        <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:14,padding:24,marginBottom:24}}>
          <div style={{fontWeight:700,fontSize:15,marginBottom:18}}>How it works</div>
          {STEPS.map((step,i) => (
            <div key={i} style={{display:'flex',gap:12,marginBottom:i<STEPS.length-1?14:0,alignItems:'flex-start'}}>
              <div style={{width:26,height:26,borderRadius:'50%',background:'#f0fdf4',color:'#16a34a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0,marginTop:1}}>{step.num}</div>
              <div>
                <div style={{fontSize:14,fontWeight:600,marginBottom:2}}>{step.title}</div>
                <div style={{fontSize:13,color:'#6b7280'}}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{background:'#fff',border:'2px solid #16a34a',borderRadius:14,padding:24}}>
          <div style={{fontWeight:700,fontSize:15,marginBottom:6}}>Connect your Shopify store</div>
          <div style={{fontSize:14,color:'#6b7280',marginBottom:18}}>Enter your store URL. You'll approve read-only access on Shopify.</div>
          <div style={{display:'flex',gap:10,marginBottom:10}}>
            <input value={shopUrl} onChange={e=>setShopUrl(e.target.value)} placeholder="yourstore.myshopify.com"
              onKeyDown={e=>e.key==='Enter'&&connect()}
              style={{flex:1,border:'1.5px solid #e5e7eb',borderRadius:10,padding:'12px 14px',fontSize:14,outline:'none'}} />
            <button onClick={connect}
              style={{background:'#16a34a',color:'#fff',border:'none',borderRadius:10,padding:'12px 20px',fontSize:14,fontWeight:700,cursor:'pointer',whiteSpace:'nowrap'}}>
              Connect →
            </button>
          </div>
          <div style={{fontSize:12,color:'#9ca3af'}}>🔒 Read-only — we can never modify your store or access your funds</div>
        </div>
      </div>
    </div>
  )
}
