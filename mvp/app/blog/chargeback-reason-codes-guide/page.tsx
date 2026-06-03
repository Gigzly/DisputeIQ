import Link from 'next/link'
export const metadata = {
  title: 'Chargeback Reason Codes: Complete Guide for Shopify Merchants (2026)',
  description: 'Every chargeback reason code explained. Visa 10.4, Mastercard 4853, Amex FR2 — what evidence wins each one.',
}
export default function Post() {
  return (
    <div style={{minHeight:'100vh',background:'#fff',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'}}>
      <nav style={{borderBottom:'1px solid #e5e7eb',padding:'0 40px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link href="/" style={{fontWeight:800,fontSize:18,textDecoration:'none',color:'#0a0a0a'}}>Dispute<span style={{color:'#16a34a'}}>IQ</span></Link>
        <Link href="/auth/login" style={{background:'#16a34a',color:'#fff',padding:'8px 18px',borderRadius:8,fontSize:14,fontWeight:600,textDecoration:'none'}}>Get started free</Link>
      </nav>
      <article style={{maxWidth:720,margin:'0 auto',padding:'48px 24px'}}>
        <div style={{fontSize:13,color:'#9ca3af',marginBottom:12}}>June 1, 2026 · 8 min read</div>
        <h1 style={{fontSize:36,fontWeight:900,letterSpacing:-1.5,lineHeight:1.15,marginBottom:20}}>Chargeback Reason Codes: Complete Guide for Shopify Merchants (2026)</h1>
        <p style={{fontSize:18,color:'#6b7280',lineHeight:1.7,marginBottom:32,borderBottom:'1px solid #e5e7eb',paddingBottom:32}}>If you're losing chargebacks you should be winning, reason codes are why. Here's everything you need to know.</p>

        <h2 style={{fontSize:24,fontWeight:800,letterSpacing:-0.5,marginTop:36,marginBottom:12}}>Why reason codes matter</h2>
        <p style={{fontSize:16,color:'#374151',lineHeight:1.8,marginBottom:16}}>Every chargeback comes with a reason code — a short identifier that tells you what the cardholder claimed and, critically, what evidence you need to submit to win. Most merchants ignore reason codes. They submit whatever they have and hope. That's why the average merchant win rate sits at 30-35%.</p>
        <p style={{fontSize:16,color:'#374151',lineHeight:1.8,marginBottom:32}}>Merchants who understand reason codes and match their evidence to the code's requirements win 60-65% of disputes. That gap is entirely recoverable.</p>

        <h2 style={{fontSize:24,fontWeight:800,letterSpacing:-0.5,marginTop:36,marginBottom:20}}>Visa reason codes</h2>

        {[
          {code:'Visa 10.4',title:'Other Fraud — Card Absent',evidence:['AVS result code','CVV result code','IP address matching billing geolocation','Device fingerprint','Prior purchase history from same card','3DS authentication (automatic win if available)'],winRate:'52-68%'},
          {code:'Visa 13.1',title:'Merchandise Not Received',evidence:['Carrier tracking showing Delivered status','Delivery timestamp and address','Signature confirmation if available','Customer comms after delivery date showing no complaint'],winRate:'68-74%'},
          {code:'Visa 13.3',title:'Not as Described or Defective',evidence:['Screenshot of product listing at time of purchase','Product photos matching description','Return policy visible at checkout','No return request received (communication log)'],winRate:'55-61%'},
          {code:'Visa 13.6',title:'Credit Not Processed',evidence:['If refund was issued: transaction record with date','If not owed: refund policy accepted at checkout','Explanation of why refund was denied'],winRate:'66-74%'},
        ].map(item => (
          <div key={item.code} style={{background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:12,padding:20,marginBottom:16}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
              <div>
                <span style={{background:'#fef2f2',color:'#dc2626',padding:'3px 8px',borderRadius:6,fontSize:12,fontWeight:700,fontFamily:'monospace'}}>{item.code}</span>
                <span style={{fontSize:16,fontWeight:700,marginLeft:10,color:'#0a0a0a'}}>{item.title}</span>
              </div>
              <span style={{fontSize:13,color:'#16a34a',fontWeight:600}}>{item.winRate} win rate</span>
            </div>
            <div style={{fontSize:13,fontWeight:600,color:'#6b7280',marginBottom:6}}>Required evidence:</div>
            {item.evidence.map((e,i) => <div key={i} style={{fontSize:14,color:'#374151',padding:'3px 0',display:'flex',gap:8}}><span style={{color:'#16a34a'}}>✓</span>{e}</div>)}
          </div>
        ))}

        <h2 style={{fontSize:24,fontWeight:800,letterSpacing:-0.5,marginTop:36,marginBottom:20}}>Mastercard reason codes</h2>
        {[
          {code:'MC 4853',title:'Not as Described',evidence:['Product listing screenshot','Product photos','Return policy at checkout','Communication log showing no prior complaint'],winRate:'59-65%'},
          {code:'MC 4837',title:'No Cardholder Authorisation',evidence:['AVS result','CVV result','IP geolocation','Device fingerprint','Prior purchase history','3DS authentication'],winRate:'48-55%'},
          {code:'MC 4855',title:'Goods Not Received',evidence:['Carrier tracking with Delivered status','Delivery timestamp','Signature if available'],winRate:'65-70%'},
        ].map(item => (
          <div key={item.code} style={{background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:12,padding:20,marginBottom:16}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
              <div>
                <span style={{background:'#fff7ed',color:'#c2410c',padding:'3px 8px',borderRadius:6,fontSize:12,fontWeight:700,fontFamily:'monospace'}}>{item.code}</span>
                <span style={{fontSize:16,fontWeight:700,marginLeft:10,color:'#0a0a0a'}}>{item.title}</span>
              </div>
              <span style={{fontSize:13,color:'#16a34a',fontWeight:600}}>{item.winRate} win rate</span>
            </div>
            {item.evidence.map((e,i) => <div key={i} style={{fontSize:14,color:'#374151',padding:'3px 0',display:'flex',gap:8}}><span style={{color:'#16a34a'}}>✓</span>{e}</div>)}
          </div>
        ))}

        <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:14,padding:24,marginTop:40}}>
          <h3 style={{fontSize:18,fontWeight:700,marginBottom:8}}>Let DisputeIQ handle reason codes automatically</h3>
          <p style={{fontSize:15,color:'#374151',lineHeight:1.7,marginBottom:16}}>DisputeIQ maps all 40 reason codes to their evidence requirements. When a dispute arrives, it assembles the correct evidence from your Shopify store and generates the right response — automatically.</p>
          <Link href="/auth/login" style={{background:'#16a34a',color:'#fff',padding:'12px 22px',borderRadius:10,textDecoration:'none',fontWeight:600,fontSize:15,display:'inline-block'}}>Try free for 14 days →</Link>
        </div>
      </article>
    </div>
  )
}
