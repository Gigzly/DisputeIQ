import Link from 'next/link'

export default function Home() {
  return (
    <div style={{minHeight:'100vh',background:'#fff',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'}}>
      <nav style={{borderBottom:'1px solid #e5e7eb',padding:'0 40px',height:64,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,background:'rgba(255,255,255,0.96)',backdropFilter:'blur(8px)',zIndex:50}}>
        <span style={{fontWeight:800,fontSize:20,letterSpacing:-0.5}}>Dispute<span style={{color:'#16a34a'}}>IQ</span></span>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <Link href="/auth/login" style={{fontSize:14,color:'#6b7280',fontWeight:500,textDecoration:'none',padding:'8px 14px'}}>Sign in</Link>
          <Link href="/auth/signup" style={{background:'#16a34a',color:'#fff',padding:'9px 20px',borderRadius:9,fontSize:14,fontWeight:600,textDecoration:'none'}}>Get started free</Link>
        </div>
      </nav>

      <div style={{maxWidth:780,margin:'0 auto',padding:'90px 24px 80px',textAlign:'center'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'#f0fdf4',color:'#15803d',padding:'6px 14px',borderRadius:20,fontSize:13,fontWeight:600,marginBottom:24,border:'1px solid #bbf7d0'}}>
          <span>●</span> Now live for Shopify merchants
        </div>
        <h1 style={{fontSize:'clamp(36px,6vw,58px)',fontWeight:900,lineHeight:1.08,letterSpacing:-2,marginBottom:20,color:'#0a0a0a'}}>
          Stop losing<br/><span style={{color:'#16a34a'}}>winnable</span> chargebacks
        </h1>
        <p style={{fontSize:18,color:'#6b7280',maxWidth:560,margin:'0 auto 36px',lineHeight:1.6}}>
          DisputeIQ connects to your Shopify store and automatically generates evidence-backed dispute responses in the exact format each card network requires.
        </p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:16}}>
          <Link href="/auth/signup" style={{background:'#16a34a',color:'#fff',padding:'15px 30px',borderRadius:10,fontSize:15,fontWeight:700,textDecoration:'none'}}>Start free 14-day trial</Link>
          <Link href="/blog" style={{background:'transparent',color:'#0a0a0a',padding:'15px 30px',borderRadius:10,fontSize:15,fontWeight:500,textDecoration:'none',border:'1.5px solid #e5e7eb'}}>Learn more</Link>
        </div>
        <p style={{fontSize:13,color:'#9ca3af'}}>No credit card required · Read-only Shopify access · Setup in 2 minutes</p>
      </div>

      <div style={{display:'flex',justifyContent:'center',gap:56,padding:'40px 24px',borderTop:'1px solid #f3f4f6',borderBottom:'1px solid #f3f4f6',flexWrap:'wrap'}}>
        {[['30%','Average win rate without DisputeIQ'],['62%','Average win rate with DisputeIQ'],['2 min','To generate a dispute response'],['$8,400','Average annual recovery']].map(([val,label])=>(
          <div key={label} style={{textAlign:'center'}}>
            <div style={{fontSize:36,fontWeight:900,letterSpacing:-1,color:'#0a0a0a'}}>{val}</div>
            <div style={{fontSize:13,color:'#6b7280',marginTop:4,maxWidth:160}}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{maxWidth:860,margin:'0 auto',padding:'72px 24px'}}>
        <h2 style={{fontSize:32,fontWeight:800,letterSpacing:-1,textAlign:'center',marginBottom:48}}>How it works</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:20}}>
          {[
            {num:'01',title:'Connect your store',desc:'Read-only Shopify OAuth. Takes 90 seconds. We can never modify your store or access your funds.'},
            {num:'02',title:'Dispute arrives',desc:'We detect it via webhook instantly. Evidence assembled from your order data automatically.'},
            {num:'03',title:'Response generated',desc:'AI generates a formatted response for that exact reason code and card network in ~60 seconds.'},
            {num:'04',title:'You review & submit',desc:'2 minutes to review and submit. Win rate improves from ~30% to 60%+.'},
          ].map(s=>(
            <div key={s.num} style={{background:'#f9fafb',borderRadius:14,padding:24,border:'1px solid #f3f4f6'}}>
              <div style={{fontSize:28,fontWeight:900,color:'#16a34a',marginBottom:12}}>{s.num}</div>
              <div style={{fontSize:15,fontWeight:700,marginBottom:6}}>{s.title}</div>
              <div style={{fontSize:14,color:'#6b7280',lineHeight:1.6}}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:'#0a0a0a',padding:'72px 24px',textAlign:'center'}}>
        <h2 style={{fontSize:32,fontWeight:800,letterSpacing:-1,color:'#fff',marginBottom:12}}>Start recovering revenue today</h2>
        <p style={{fontSize:16,color:'#9ca3af',marginBottom:32,maxWidth:460,margin:'0 auto 32px'}}>Connect your Shopify store in 2 minutes. See your win rate improve before you pay anything.</p>
        <Link href="/auth/signup" style={{background:'#16a34a',color:'#fff',padding:'15px 32px',borderRadius:10,fontSize:15,fontWeight:700,textDecoration:'none',display:'inline-block'}}>Get started free →</Link>
        <p style={{color:'#4b5563',fontSize:13,marginTop:16}}>No credit card · 14-day trial · Cancel anytime</p>
      </div>

      <footer style={{padding:'24px 40px',borderTop:'1px solid #f3f4f6',display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:13,color:'#9ca3af',flexWrap:'wrap',gap:10}}>
        <span>© 2026 DisputeIQ</span>
        <div style={{display:'flex',gap:20}}>
          {[['Blog','/blog'],['Pricing','/pricing'],['Privacy','/privacy'],['Terms','/terms'],['Sign in','/auth/login']].map(([label,href])=>(
            <Link key={href} href={href} style={{color:'#9ca3af',textDecoration:'none'}}>{label}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
