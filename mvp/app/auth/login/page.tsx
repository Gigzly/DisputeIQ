'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleLogin = async () => {
    if (!email.includes('@')) { setError('Enter a valid email'); return }
    if (password.length < 6)  { setError('Password must be at least 6 characters'); return }
    setError(''); setLoading(true)
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { data, error: e } = await supabase.auth.signInWithPassword({ email, password })
    if (e) { setError('Invalid email or password. Need an account? Sign up below.'); setLoading(false); return }
    if (data.session) { window.location.href = '/dashboard'; return }
    setLoading(false)
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f9fafb',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'}}>
      <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:16,padding:'40px 36px',width:'100%',maxWidth:420}}>
        <Link href="/" style={{fontWeight:800,fontSize:20,letterSpacing:-0.5,marginBottom:6,display:'block',textDecoration:'none',color:'#0a0a0a'}}>
          Dispute<span style={{color:'#16a34a'}}>IQ</span>
        </Link>
        <div style={{fontSize:15,color:'#6b7280',marginBottom:28}}>Sign in to your account</div>
        <div style={{marginBottom:14}}>
          <label style={{display:'block',fontSize:13,fontWeight:500,marginBottom:5}}>Email address</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()}
            placeholder="you@yourstore.com"
            style={{width:'100%',border:'1.5px solid #e5e7eb',borderRadius:10,padding:'12px 14px',fontSize:14,outline:'none',boxSizing:'border-box'}} />
        </div>
        <div style={{marginBottom:18}}>
          <label style={{display:'block',fontSize:13,fontWeight:500,marginBottom:5}}>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()}
            placeholder="Your password"
            style={{width:'100%',border:'1.5px solid #e5e7eb',borderRadius:10,padding:'12px 14px',fontSize:14,outline:'none',boxSizing:'border-box'}} />
        </div>
        {error && <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:8,padding:'10px 12px',fontSize:13,color:'#dc2626',marginBottom:14}}>{error}</div>}
        <button onClick={handleLogin} disabled={loading}
          style={{width:'100%',background:loading?'#86efac':'#16a34a',color:'#fff',border:'none',borderRadius:10,padding:'13px',fontSize:15,fontWeight:600,cursor:loading?'not-allowed':'pointer',marginBottom:16}}>
          {loading?'Signing in...':'Sign in'}
        </button>
        <p style={{textAlign:'center',fontSize:13,color:'#9ca3af'}}>
          No account yet? <Link href="/auth/signup" style={{color:'#16a34a',fontWeight:500,textDecoration:'none'}}>Create one free</Link>
        </p>
      </div>
    </div>
  )
}
