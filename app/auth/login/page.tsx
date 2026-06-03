'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Login() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')

  const login = async () => {
    if (!email.includes('@')) { setError('Enter a valid email'); return }
    setError(''); setLoading(true)
    const { error: e } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    })
    setLoading(false)
    if (e) { setError(e.message); return }
    setSent(true)
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f9fafb', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:16, padding:'40px 36px', width:'100%', maxWidth:420 }}>
        <div style={{ fontWeight:800, fontSize:22, letterSpacing:-0.5, marginBottom:6 }}>
          Dispute<span style={{ color:'#16a34a' }}>IQ</span>
        </div>
        <div style={{ fontSize:15, color:'#6b7280', marginBottom:28 }}>Sign in to your account</div>

        {sent ? (
          <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:10, padding:'16px', textAlign:'center' }}>
            <div style={{ fontSize:24, marginBottom:8 }}>✉️</div>
            <div style={{ fontWeight:600, marginBottom:4 }}>Check your email</div>
            <div style={{ fontSize:14, color:'#6b7280' }}>We sent a magic link to <strong>{email}</strong></div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:500, marginBottom:6 }}>Email address</label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && login()}
                placeholder="you@yourstore.com"
                style={{ width:'100%', border:'1.5px solid #e5e7eb', borderRadius:10, padding:'12px 14px', fontSize:14, outline:'none' }}
              />
            </div>
            {error && <div style={{ color:'#dc2626', fontSize:13, marginBottom:12 }}>{error}</div>}
            <button
              onClick={login} disabled={loading}
              style={{ width:'100%', background: loading ? '#86efac' : '#16a34a', color:'#fff', border:'none', borderRadius:10, padding:'13px', fontSize:15, fontWeight:600, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Sending link...' : 'Send magic link'}
            </button>
            <div style={{ textAlign:'center', marginTop:20, fontSize:13, color:'#9ca3af' }}>
              No account yet? <a href="/auth/signup" style={{ color:'#16a34a', fontWeight:500 }}>Get started free</a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
