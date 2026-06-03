'use client'
export default function Help() {
  const faqs = [
    { q: 'How does DisputeIQ detect chargebacks?', a: 'We connect to your Shopify store via webhook. The moment a dispute is created in Shopify, we receive a notification and immediately start assembling evidence from your order data.' },
    { q: 'How long does it take to generate a response?', a: 'Typically 30–60 seconds. We pull your order data, shipping confirmation, and transaction details, then generate a formatted response for that specific reason code.' },
    { q: 'What card networks do you support?', a: 'Visa, Mastercard, and American Express. We cover 40 reason codes across all three networks, representing 95%+ of chargebacks most merchants encounter.' },
    { q: 'Do I still submit the response myself?', a: 'Yes. You review the generated response in your dashboard and submit it through your payment processor portal (Shopify Payments, Stripe, etc.). You stay in control of what gets submitted.' },
    { q: 'What is a reason code?', a: 'Every chargeback has a reason code — a short identifier that tells you what the cardholder claimed. Each code has specific evidence requirements. Submitting the wrong evidence for a code means you lose automatically, even if you were right.' },
    { q: 'Why is my win rate low?', a: 'Most merchants win 30–35% of disputes. The gap between that and 60%+ is almost entirely due to submitting incorrect or incomplete evidence for the specific reason code. DisputeIQ knows exactly what each code requires.' },
    { q: 'What does "read-only access" mean?', a: 'DisputeIQ can read your orders, shipping data, and disputes — but cannot modify anything, process refunds, or access your payment balance. We use the minimum permissions needed.' },
    { q: 'What if a dispute arrives at 3am?', a: 'DisputeIQ runs 24/7. We detect disputes the moment they arrive via webhook and generate the response immediately. You get an email alert whenever a new dispute needs your attention.' },
  ]
  return (
    <div style={{minHeight:'100vh',background:'#f9fafb',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'}}>
      <nav style={{background:'#fff',borderBottom:'1px solid #e5e7eb',padding:'0 32px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <a href="/dashboard" style={{fontWeight:800,fontSize:18,textDecoration:'none',color:'#0a0a0a'}}>Dispute<span style={{color:'#16a34a'}}>IQ</span></a>
        <a href="/dashboard" style={{fontSize:13,color:'#16a34a',fontWeight:500}}>← Back to dashboard</a>
      </nav>
      <div style={{maxWidth:720,margin:'0 auto',padding:'48px 24px'}}>
        <h1 style={{fontSize:28,fontWeight:800,letterSpacing:-1,marginBottom:8}}>Help & FAQ</h1>
        <p style={{fontSize:15,color:'#6b7280',marginBottom:40}}>Everything you need to know about DisputeIQ.</p>
        <div style={{display:'flex',flexDirection:'column',gap:0}}>
          {faqs.map((faq,i) => (
            <div key={i} style={{borderBottom:'1px solid #e5e7eb',padding:'20px 0'}}>
              <div style={{fontWeight:600,fontSize:15,marginBottom:8,color:'#0a0a0a'}}>{faq.q}</div>
              <div style={{fontSize:14,color:'#6b7280',lineHeight:1.7}}>{faq.a}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:40,background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:14,padding:24}}>
          <div style={{fontWeight:600,fontSize:15,marginBottom:6}}>Still need help?</div>
          <div style={{fontSize:14,color:'#374151'}}>Email us at <a href="mailto:hello@disputeiq.co" style={{color:'#16a34a'}}>hello@disputeiq.co</a> — we respond within 4 hours on business days.</div>
        </div>
      </div>
    </div>
  )
}
