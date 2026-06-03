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

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Try sign in first
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    
    if (!signInError && signInData.session) {
      // Signed in successfully
      window.location.href = '/dashboard'
      return
    }

    // Sign in failed - try creating account
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { emailRedirectTo: undefined }
    })
    
    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (signUpData.session) {
      // Account created and auto-confirmed
      window.location.href = '/dashboard'
      return
    }

    // No session means email confirmation is required - disable it in Supabase
    setError('Please disable email confirmation in Supabase: Authentication → Settings → uncheck "Enable email confirmations"')
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f9fafb', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:16, padding:'40px 36px', width:'100%', maxWidth:420 }}>
        <div style={{ fontWeight:800, fontSize:22, letterSpacing:-0.5, marginBottom:6 }}>
          Dispute<span style={{ color:'#16a34a' }}>IQ</span>
        </div>
        <div style={{ fontSize:15, color:'#6b7280', marginBottom:28 }}>Sign in to your account</div>
        <div style={{ marginBottom:16 }}>
          <label style={{ display:'block', fontSize:13, fontWeight:500, marginBottom:6 }}>Email</label>
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
        {error && (
          <div style={{ color: error.includes('disable') ? '#d97706' : '#dc2626', fontSize:13, marginBottom:12, padding:'10px', background: error.includes('disable') ? '#fffbeb' : '#fef2f2', borderRadius:8 }}>
            {error}
          </div>
        )}
        <button onClick={handleAuth} disabled={loading}
          style={{ width:'100%', background: loading ? '#86efac' : '#16a34a', color:'#fff', border:'none', borderRadius:10, padding:'13px', fontSize:15, fontWeight:600, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Signing in...' : 'Sign in / Create account'}
        </button>
      </div>
    </div>
  )
}
