'use client'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [disputes, setDisputes]   = useState<any[]>([])
  const [selected, setSelected]   = useState<any>(null)
  const [loading, setLoading]     = useState(true)
  const [copied, setCopied]       = useState(false)
  const [stats, setStats]         = useState({ total: 0, won: 0, pending: 0, recovered: 0 })

  useEffect(() => {
    // Check auth
    import('@supabase/supabase-js').then(({ createClient }) => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user) {
          window.location.href = '/auth/login'
          return
        }
        setLoading(false)
      })
    })
  }, [])

  const copyLetter = () => {
    if (!selected?.generated_response?.response_letter) return
    navigator.clipboard.writeText(selected.generated_response.response_letter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const winPct = stats.total > 0 ? Math.round((stats.won / stats.total) * 100) : 0

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', fontFamily:'-apple-system,sans-serif', color:'#6b7280' }}>
      Loading...
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#f9fafb', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      <nav style={{ background:'#fff', borderBottom:'1px solid #e5e7eb', padding:'16px 32px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontWeight:800, fontSize:18, letterSpacing:-0.5 }}>
          Dispute<span style={{ color:'#16a34a' }}>IQ</span>
        </span>
        <div style={{ display:'flex', gap:20, fontSize:14, color:'#6b7280', alignItems:'center' }}>
          <a href="/pricing" style={{ color:'#16a34a', fontWeight:600 }}>Upgrade</a>
          <button onClick={async () => {
            const { createClient } = await import('@supabase/supabase-js')
            const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
            await supabase.auth.signOut()
            window.location.href = '/auth/login'
          }} style={{ background:'#0a0a0a', color:'#fff', border:'none', borderRadius:8, padding:'8px 16px', cursor:'pointer', fontSize:14 }}>
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'32px 24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16, marginBottom:32 }}>
          {[
            { label:'Total disputes', value: stats.total, sub:'all time' },
            { label:'Win rate', value:`${winPct}%`, sub:'vs 30% avg', color:'#16a34a' },
            { label:'Open disputes', value: stats.pending, sub:'need attention', color: stats.pending > 0 ? '#d97706' : undefined },
            { label:'Revenue recovered', value:`$${stats.recovered.toLocaleString()}`, sub:'from won disputes', color:'#16a34a' },
          ].map(s => (
            <div key={s.label} style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'20px 20px 16px' }}>
              <div style={{ fontSize:12, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:6 }}>{s.label}</div>
              <div style={{ fontSize:28, fontWeight:800, letterSpacing:-1, color: s.color || '#0a0a0a' }}>{s.value}</div>
              <div style={{ fontSize:12, color:'#9ca3af', marginTop:3 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:14, padding:'60px 32px', textAlign:'center' }}>
          <div style={{ fontSize:32, marginBottom:12 }}>✓</div>
          <div style={{ fontWeight:700, fontSize:18, marginBottom:8 }}>DisputeIQ is live</div>
          <div style={{ fontSize:14, color:'#6b7280', maxWidth:400, margin:'0 auto' }}>
            Connect your Shopify store to start automatically handling chargebacks.
            Disputes will appear here when they arrive.
          </div>
          <div style={{ marginTop:24, padding:'16px 20px', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:10, display:'inline-block', fontSize:14, color:'#15803d' }}>
            Next step: Connect your Shopify store via the install link
          </div>
        </div>
      </div>
    </div>
  )
}
