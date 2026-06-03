'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [focusedField, setFocusedField] = useState('')

  const handleLogin = async () => {
    if (!email.includes('@')) { setError('Enter a valid email address'); return }
    if (password.length < 6)  { setError('Password must be at least 6 characters'); return }
    setError(''); setLoading(true)
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { data, error: e } = await supabase.auth.signInWithPassword({ email, password })
    if (e) { setError('Invalid email or password'); setLoading(false); return }
    if (data.session) { window.location.href = '/dashboard' }
    else setLoading(false)
  }

  const inputStyle = (field: string) => ({
    width:'100%' as const,
    border:`1.5px solid ${focusedField===field?'#16a34a':'#e5e7eb'}`,
    borderRadius:10,
    padding:'12px 14px',
    fontSize:14,
    outline:'none',
    boxSizing:'border-box' as const,
    fontFamily:'inherit',
    transition:'border-color .15s',
    color:'#111827',
    background:'#fff',
  })

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f7f7f8',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',padding:24}}>
      <div style={{background:'#fff',border:'1px solid #e8e8e8',borderRadius:16,padding:'40px 36px',width:'100%',maxWidth:420,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
        <Link href="/" style={{fontWeight:800,fontSize:20,letterSpacing:-0.5,marginBottom:6,display:'block',textDecoration:'none',color:'#111827'}}>
          Dispute<span style={{color:'#16a34a'}}>IQ</span>
        </Link>
        <div style={{fontSize:15,color:'#6b7280',marginBottom:28,marginTop:2}}>Sign in to your account</div>

        <div style={{marginBottom:14}}>
          <label style={{display:'block',fontSize:13,fontWeight:600,marginBottom:6,color:'#374151'}}>Email address</label>
          <input
            type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField('')}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="you@yourstore.com"
            style={inputStyle('email')}
          />
        </div>

        <div style={{marginBottom:20}}>
          <label style={{display:'block',fontSize:13,fontWeight:600,marginBottom:6,color:'#374151'}}>Password</label>
          <input
            type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField('')}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Your password"
            style={inputStyle('password')}
          />
        </div>

        {error && (
          <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:9,padding:'10px 12px',fontSize:13,color:'#dc2626',marginBottom:16}}>
            {error}
          </div>
        )}

        <button onClick={handleLogin} disabled={loading}
          style={{width:'100%',background:loading?'#86efac':'#16a34a',color:'#fff',border:'none',borderRadius:10,padding:'13px',fontSize:15,fontWeight:600,cursor:loading?'default':'pointer',marginBottom:16,fontFamily:'inherit',transition:'background .15s'}}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p style={{textAlign:'center',fontSize:13,color:'#9ca3af'}}>
          No account?{' '}
          <Link href="/auth/signup" style={{color:'#16a34a',fontWeight:600,textDecoration:'none'}}>Create one free</Link>
        </p>
      </div>
    </div>
  )
}
