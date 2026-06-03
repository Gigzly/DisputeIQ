import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',background:'#f7f7f8',textAlign:'center',padding:24}}>
      <Link href="/" style={{fontWeight:800,fontSize:20,letterSpacing:-0.5,textDecoration:'none',color:'#111827',marginBottom:48,display:'block'}}>
        Dispute<span style={{color:'#16a34a'}}>IQ</span>
      </Link>
      <div style={{fontSize:96,fontWeight:900,color:'#e5e7eb',letterSpacing:-6,lineHeight:1,marginBottom:20}}>404</div>
      <h1 style={{fontSize:22,fontWeight:800,color:'#111827',marginBottom:10,letterSpacing:-0.3}}>Page not found</h1>
      <p style={{fontSize:15,color:'#6b7280',marginBottom:36,maxWidth:340,lineHeight:1.7}}>
        This page doesn't exist. If you think something is broken, let us know.
      </p>
      <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
        <Link href="/" style={{background:'#16a34a',color:'#fff',padding:'11px 24px',borderRadius:9,fontSize:14,fontWeight:600,textDecoration:'none'}}>
          Go home
        </Link>
        <Link href="/dashboard" style={{background:'#fff',color:'#374151',padding:'11px 22px',borderRadius:9,fontSize:14,fontWeight:500,textDecoration:'none',border:'1px solid #e8e8e8'}}>
          Dashboard
        </Link>
      </div>
    </div>
  )
}
