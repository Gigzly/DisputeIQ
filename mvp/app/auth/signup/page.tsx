'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Signup() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [focusedField, setFocusedField] = useState('')

  const handleSignup = async () => {
    if (!email.includes('@')) { setError('Enter a valid email address'); return }
    if (password.length < 6)  { setError('Password must be at least 6 characters'); return }
    setError(''); setLoading(true)
    const { createSupabaseClientSide } = await import('@/lib/supabase-client')
    const supabase = createSupabaseClientSide()
    const { data, error: e } = await supabase.auth.signUp({ email, password })
    if (e) { setError(e.message); setLoading(false); return }
    if (data.session) { window.location.href = '/dashboard'; return }
    const { data: si, error: sie } = await supabase.auth.signInWithPassword({ email, password })
    if (!sie && si.session) { window.location.href = '/dashboard'; return }
    setError('Account created — check your email to confirm before signing in.')
    setLoading(false)
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
    <div style={{minHeight:'100vh',display:'flex',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'}}>
      {/* Left: form */}
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 24px',background:'#fff'}}>
        <div style={{width:'100%',maxWidth:400}}>
          <Link href="/" style={{fontWeight:800,fontSize:20,textDecoration:'none',color:'#111827',display:'block',marginBottom:36,letterSpacing:-0.5}}>
            Dispute<span style={{color:'#16a34a'}}>IQ</span>
          </Link>

          <h1 style={{fontSize:26,fontWeight:800,letterSpacing:-0.5,marginBottom:4,color:'#111827'}}>Create your account</h1>
          <p style={{fontSize:14,color:'#6b7280',marginBottom:28}}>Start your free 14-day trial. No credit card required.</p>

          <div style={{marginBottom:14}}>
            <label style={{display:'block',fontSize:13,fontWeight:600,marginBottom:6,color:'#374151'}}>Email address</label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField('')}
              onKeyDown={e => e.key === 'Enter' && handleSignup()}
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
              onKeyDown={e => e.key === 'Enter' && handleSignup()}
              placeholder="Min 6 characters"
              style={inputStyle('password')}
            />
          </div>

          {error && (
            <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:9,padding:'10px 12px',fontSize:13,color:'#dc2626',marginBottom:16}}>
              {error}
            </div>
          )}

          <button onClick={handleSignup} disabled={loading}
            style={{width:'100%',background:loading?'#86efac':'#16a34a',color:'#fff',border:'none',borderRadius:10,padding:'13px',fontSize:15,fontWeight:600,cursor:loading?'default':'pointer',marginBottom:16,fontFamily:'inherit',transition:'background .15s'}}>
            {loading ? 'Creating account…' : 'Create account — free'}
          </button>

          <p style={{textAlign:'center',fontSize:13,color:'#9ca3af',marginBottom:12}}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{color:'#16a34a',fontWeight:600,textDecoration:'none'}}>Sign in</Link>
          </p>
          <p style={{textAlign:'center',fontSize:12,color:'#9ca3af'}}>
            By signing up you agree to our{' '}
            <Link href="/terms" style={{color:'#9ca3af',textDecoration:'underline'}}>Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" style={{color:'#9ca3af',textDecoration:'underline'}}>Privacy Policy</Link>
          </p>
        </div>
      </div>

      {/* Right: dark social proof panel */}
      <div className="auth-split-right" style={{flex:1,background:'#111827',display:'flex',alignItems:'center',justifyContent:'center',padding:48}}>
        <div style={{maxWidth:400}}>
          <div style={{fontSize:20,fontWeight:700,marginBottom:28,color:'#fff',letterSpacing:-0.3,lineHeight:1.4}}>
            Win more chargebacks automatically
          </div>

          <div style={{marginBottom:28}}>
            {[
              ['Industry average win rate','30–35%','#9ca3af'],
              ['Win rate with DisputeIQ','60–65%','#4ade80'],
              ['Time to generate response','~60 seconds','#4ade80'],
              ['Setup time','2 minutes','#4ade80'],
            ].map(([label, val, color]) => (
              <div key={label as string} style={{display:'flex',justifyContent:'space-between',padding:'11px 0',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                <span style={{fontSize:14,color:'#9ca3af'}}>{label}</span>
                <span style={{fontSize:14,fontWeight:700,color}}>{val}</span>
              </div>
            ))}
          </div>

          <div style={{padding:20,background:'rgba(255,255,255,0.06)',borderRadius:12,border:'1px solid rgba(255,255,255,0.1)'}}>
            <p style={{fontSize:14,color:'#d1d5db',lineHeight:1.75,margin:0,fontStyle:'italic'}}>
              "We went from a 28% to 61% win rate in six weeks. The first chargeback it handled was a $2,800 order — the response was ready before I even knew the dispute existed."
            </p>
            <div style={{fontSize:12,color:'#6b7280',marginTop:12}}>
              — Head of Operations · Shopify store, $1.4M GMV
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
