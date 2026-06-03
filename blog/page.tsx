import Link from 'next/link'

const POSTS = [
  { slug:'chargeback-reason-codes-guide', title:'Chargeback Reason Codes: Complete Guide for Shopify Merchants (2026)', date:'2026-06-01', readTime:'8 min', excerpt:'Every chargeback has a reason code. Most merchants ignore them. That gap is why the average win rate is 30% instead of 60%.' },
  { slug:'how-to-win-shopify-chargebacks', title:'How to Win a Shopify Chargeback: Step-by-Step Guide', date:'2026-06-01', readTime:'6 min', excerpt:'The merchants who consistently win chargebacks do one thing differently: they match their evidence to the reason code requirements.' },
  { slug:'chargeback-win-rate-benchmarks', title:'Shopify Chargeback Win Rate Benchmarks: What\'s Normal?', date:'2026-06-01', readTime:'5 min', excerpt:'Most merchants don\'t know their win rate. Here\'s what\'s normal and how to improve it.' },
]

export default function Blog() {
  return (
    <div style={{minHeight:'100vh',background:'#fff',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'}}>
      <nav style={{borderBottom:'1px solid #e5e7eb',padding:'0 40px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link href="/" style={{fontWeight:800,fontSize:18,textDecoration:'none',color:'#0a0a0a'}}>Dispute<span style={{color:'#16a34a'}}>IQ</span></Link>
        <Link href="/auth/login" style={{background:'#16a34a',color:'#fff',padding:'8px 18px',borderRadius:8,fontSize:14,fontWeight:600,textDecoration:'none'}}>Get started free</Link>
      </nav>
      <div style={{maxWidth:720,margin:'0 auto',padding:'56px 24px'}}>
        <h1 style={{fontSize:32,fontWeight:800,letterSpacing:-1,marginBottom:8}}>Chargeback guides</h1>
        <p style={{fontSize:16,color:'#6b7280',marginBottom:40}}>Everything Shopify merchants need to know about winning chargebacks.</p>
        <div style={{display:'flex',flexDirection:'column',gap:0}}>
          {POSTS.map((post,i) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{textDecoration:'none',color:'inherit',display:'block',padding:'24px 0',borderBottom:'1px solid #e5e7eb'}}>
              <div style={{fontSize:13,color:'#9ca3af',marginBottom:6}}>{new Date(post.date).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})} · {post.readTime} read</div>
              <h2 style={{fontSize:20,fontWeight:700,letterSpacing:-0.3,marginBottom:8,color:'#0a0a0a'}}>{post.title}</h2>
              <p style={{fontSize:15,color:'#6b7280',lineHeight:1.6,margin:0}}>{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
