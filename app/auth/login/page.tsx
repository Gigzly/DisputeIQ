'use client'
import { useState } from 'react'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleAuth = async () => {
    if (!email.includes('@')) { setError('Enter a valid email'); return }
    if (password.length < 6)  { setError('Password must be at least 6 characters'); return }
    setError('')
    setLoading(true)
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) {
        const { error: signUpError } = await supabase.auth.signUp({ email, password })
        if (signUpError) { setError(signUpError.message); setLoading(false); return }
      }
      window.location.replace('/dashboard')
    } catch (e: any) {
      setError(e.message)
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f9fafb', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:16, padding:'40px 36px', width:'100%', maxWidth:420 }}>
        <div style={{ fontWeight:800, fontSize:22, letterSpacing:-0.5, marginBottom:6 }}>
          Dispute<span style={{ color:'#16a34a' }}>IQ</span>
        </div>
        <div style={{ fontSize:15, color:'#6b7280', marginBottom:28 }}>Sign in to your account</div>
        <div style={{ marginBottom:16 }}>
          <label style={{ display:'block', fontSize:13, fontWeight:500, marginBottom:6 }}>Email address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAuth()}
            placeholder="you@yourstore.com"
            style={{ width:'100%', border:'1.5px solid #e5e7eb', borderRadius:10, padding:'12px 14px', fontSize:14, outline:'none' }} />
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ display:'block', fontSize:13, fontWeight:500, marginBottom:6 }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAuth()}
            placeholder="Min 6 characters"
            style={{ width:'100%', border:'1.5px solid #e5e7eb', borderRadius:10, padding:'12px 14px', fontSize:14, outline:'none' }} />
        </div>
        {error && <div style={{ color:'#dc2626', fontSize:13, marginBottom:12 }}>{error}</div>}
        <button onClick={handleAuth} disabled={loading}
          style={{ width:'100%', background: loading ? '#86efac' : '#16a34a', color:'#fff', border:'none', borderRadius:10, padding:'13px', fontSize:15, fontWeight:600, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Signing in...' : 'Sign in / Create account'}
        </button>
      </div>
    </div>
  )
}
