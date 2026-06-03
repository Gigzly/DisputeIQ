'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Signup() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSignup = async () => {
    if (!email.includes('@')) { setError('Enter a valid email'); return }
    if (password.length < 6)  { setError('Password must be at least 6 characters'); return }
    setError('')
    setLoading(true)
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) { setError(signUpError.message); setLoading(false); return }
    if (signUpData.session) { window.location.href = '/dashboard'; return }
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) { setError(signInError.message); setLoading(false); return }
    if (signInData.session) { window.location.href = '/dashboard'; return }
    setError('Email confirmation required. Go to Supabase → Auth → Settings → disable email confirmations.')
    setLoading(false)
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'}}>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 24px'}}>
        <div style={{width:'100%',maxWidth:400}}>
          <Link href="/" style={{fontWeight:800,fontSize:20,textDecoration:'none',color:'#0a0a0a',display:'block',marginBottom:32}}>
            Dispute<span style={{color:'#16a34a'}}>IQ</span>
          </Link>
          <h1 style={{fontSize:26,fontWeight:800,letterSpacing:-0.5,marginBottom:4}}>Create your account</h1>
          <p style={{fontSize:14,color:'#6b7280',marginBottom:28}}>Start your free 14-day trial. No credit card required.</p>
          <div style={{marginBottom:14}}>
            <label style={{display:'block',fontSize:13,fontWeight:500,marginBottom:5}}>Email address</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&handleSignup()} placeholder="you@yourstore.com"
              style={{width:'100%',border:'1.5px solid #e5e7eb',borderRadius:10,padding:'12px 14px',fontSize:14,outline:'none',boxSizing:'border-box'}} />
          </div>
          <div style={{marginBottom:18}}>
            <label style={{display:'block',fontSize:13,fontWeight:500,marginBottom:5}}>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&handleSignup()} placeholder="Min 6 characters"
              style={{width:'100%',border:'1.5px solid #e5e7eb',borderRadius:10,padding:'12px 14px',fontSize:14,outline:'none',boxSizing:'border-box'}} />
          </div>
          {error && <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:8,padding:'10px 12px',fontSize:13,color:'#dc2626',marginBottom:14}}>{error}</div>}
          <button onClick={handleSignup} disabled={loading}
            style={{width:'100%',background:loading?'#86efac':'#16a34a',color:'#fff',border:'none',borderRadius:10,padding:'13px',fontSize:15,fontWeight:600,cursor:loading?'not-allowed':'pointer',marginBottom:16}}>
            {loading?'Creating account...':'Create account — free'}
          </button>
          <p style={{textAlign:'center',fontSize:13,color:'#9ca3af'}}>
            Already have an account? <Link href="/auth/login" style={{color:'#16a34a',fontWeight:500,textDecoration:'none'}}>Sign in</Link>
          </p>
        </div>
      </div>
      <div style={{flex:1,background:'#f0fdf4',display:'flex',alignItems:'center',justifyContent:'center',padding:40}}>
        <div style={{maxWidth:380}}>
          <div style={{fontSize:22,fontWeight:800,marginBottom:24,color:'#0a0a0a'}}>Win more chargebacks automatically</div>
          {[
            ['Average win rate without DisputeIQ','30–35%','#6b7280'],
            ['Average win rate with DisputeIQ','60–65%','#16a34a'],
            ['Time to generate a response','~60 seconds','#16a34a'],
            ['Setup time','2 minutes','#16a34a'],
          ].map(([label,val,color])=>(
            <div key={String(label)} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #dcfce7'}}>
              <span style={{fontSize:14,color:'#374151'}}>{label}</span>
              <span style={{fontSize:14,fontWeight:700,color:String(color)}}>{val}</span>
            </div>
          ))}
          <div style={{marginTop:24,padding:16,background:'#fff',borderRadius:12,border:'1px solid #bbf7d0'}}>
            <p style={{fontSize:14,color:'#15803d',lineHeight:1.7,margin:0,fontStyle:'italic'}}>
              "We went from 1.2% to 7.4% win rate in three weeks. DisputeIQ had the response ready before I even knew about the dispute."
            </p>
            <div style={{fontSize:12,color:'#6b7280',marginTop:8}}>— Head of Operations, Shopify store $1.4M GMV</div>
          </div>
        </div>
      </div>
    </div>
  )
}
