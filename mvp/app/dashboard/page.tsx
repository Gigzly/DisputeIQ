'use client'
import { useState, useEffect } from 'react'

type Dispute = {
  id: string
  order_id: string
  amount: number
  currency: string
  reason: string
  reason_code: string
  network: string
  status: string
  due_by: string | null
  generated_response: {
    summary: string
    evidence_strength: string
    win_probability: number
    response_letter: string
    key_arguments: string[]
    recommended_action: string
    evidence_checklist: { item: string; available: boolean; required: boolean; importance: string }[]
  } | null
  created_at: string
}

const STATUS_COLORS: Record<string, {bg:string;color:string;label:string}> = {
  pending:            { bg:'#fef9c3', color:'#854d0e', label:'Pending' },
  response_generated: { bg:'#dcfce7', color:'#166534', label:'Response ready' },
  submitted:          { bg:'#dbeafe', color:'#1e40af', label:'Submitted' },
  won:                { bg:'#f0fdf4', color:'#15803d', label:'Won ✓' },
  lost:               { bg:'#fef2f2', color:'#991b1b', label:'Lost' },
}

export default function Dashboard() {
  const [disputes, setDisputes]     = useState<Dispute[]>([])
  const [selected, setSelected]     = useState<Dispute | null>(null)
  const [loading, setLoading]       = useState(true)
  const [user, setUser]             = useState<any>(null)
  const [store, setStore]           = useState<any>(null)
  const [copied, setCopied]         = useState(false)
  const [tab, setTab]               = useState<'disputes'|'connect'|'settings'>('disputes')
  const [shopUrl, setShopUrl]       = useState('')
  const [stats, setStats]           = useState({ total:0, won:0, pending:0, recovered:0, win_rate:0 })

  useEffect(() => {
    const init = async () => {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/auth/login'; return }
      setUser(user)

      // Check if store connected
      const res = await fetch(`/api/store?email=${encodeURIComponent(user.email || '')}`)
      if (res.ok) {
        const data = await res.json()
        if (data.store) {
          setStore(data.store)
          // Load disputes
          const dRes = await fetch(`/api/disputes?shop=${data.store.shop_domain}`)
          if (dRes.ok) {
            const dData = await dRes.json()
            setDisputes(dData.disputes || [])
            setStats(dData.stats || {})
          }
          setTab('disputes')
        } else {
          setTab('connect')
        }
      } else {
        setTab('connect')
      }
      setLoading(false)
    }
    init()
  }, [])

  const copyLetter = () => {
    if (!selected?.generated_response?.response_letter) return
    navigator.clipboard.writeText(selected.generated_response.response_letter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const signOut = async () => {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  const connectShopify = () => {
    let shop = shopUrl.trim().replace(/^https?:\/\//, '').replace(/\/$/, '')
    if (!shop.includes('.myshopify.com')) shop = `${shop}.myshopify.com`
    window.location.href = `/api/shopify-auth?shop=${shop}`
  }

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',fontFamily:'-apple-system,sans-serif',color:'#6b7280',flexDirection:'column',gap:12}}>
      <div style={{fontSize:20,fontWeight:800,color:'#0a0a0a'}}>Dispute<span style={{color:'#16a34a'}}>IQ</span></div>
      <div>Loading your dashboard...</div>
    </div>
  )

  const winPct = stats.total > 0 ? Math.round((stats.won / stats.total) * 100) : 0

  return (
    <div style={{minHeight:'100vh',background:'#f9fafb',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'}}>
      {/* Nav */}
      <nav style={{background:'#fff',borderBottom:'1px solid #e5e7eb',padding:'0 32px',display:'flex',justifyContent:'space-between',alignItems:'center',height:60,position:'sticky',top:0,zIndex:50}}>
        <div style={{display:'flex',alignItems:'center',gap:32}}>
          <span style={{fontWeight:800,fontSize:18,letterSpacing:-0.5}}>Dispute<span style={{color:'#16a34a'}}>IQ</span></span>
          {store && (
            <div style={{display:'flex',gap:4}}>
              {(['disputes','settings'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  style={{padding:'6px 14px',borderRadius:8,border:'none',cursor:'pointer',fontSize:14,fontWeight: tab===t ? 600 : 400,
                    background: tab===t ? '#f0fdf4' : 'transparent',color: tab===t ? '#16a34a' : '#6b7280'}}>
                  {t.charAt(0).toUpperCase()+t.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          {store && <span style={{fontSize:13,color:'#6b7280'}}>📦 {store.shop_domain}</span>}
          <a href="/pricing" style={{fontSize:13,color:'#16a34a',fontWeight:600,textDecoration:'none'}}>Upgrade</a>
          <button onClick={signOut}
            style={{background:'#0a0a0a',color:'#fff',border:'none',borderRadius:8,padding:'8px 16px',cursor:'pointer',fontSize:13,fontWeight:500}}>
            Sign out
          </button>
        </div>
      </nav>

      <div style={{maxWidth:1200,margin:'0 auto',padding:'32px 24px'}}>

        {/* CONNECT TAB */}
        {tab === 'connect' && (
          <div style={{maxWidth:600,margin:'0 auto'}}>
            <div style={{textAlign:'center',marginBottom:40}}>
              <div style={{fontSize:40,marginBottom:16}}>🔗</div>
              <h1 style={{fontSize:28,fontWeight:800,letterSpacing:-1,marginBottom:8}}>Connect your Shopify store</h1>
              <p style={{fontSize:16,color:'#6b7280'}}>DisputeIQ needs read-only access to your store to detect chargebacks and assemble evidence automatically.</p>
            </div>
            <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:16,padding:28,marginBottom:20}}>
              <label style={{display:'block',fontSize:14,fontWeight:600,marginBottom:8}}>Your Shopify store URL</label>
              <div style={{display:'flex',gap:10}}>
                <input value={shopUrl} onChange={e => setShopUrl(e.target.value)}
                  placeholder="yourstore.myshopify.com"
                  style={{flex:1,border:'1.5px solid #e5e7eb',borderRadius:10,padding:'12px 14px',fontSize:14,outline:'none'}}
                  onKeyDown={e => e.key==='Enter' && connectShopify()} />
                <button onClick={connectShopify}
                  style={{background:'#16a34a',color:'#fff',border:'none',borderRadius:10,padding:'12px 20px',fontSize:14,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap'}}>
                  Connect store
                </button>
              </div>
              <p style={{fontSize:12,color:'#9ca3af',marginTop:8}}>Just the subdomain — e.g. "mystore" or "mystore.myshopify.com"</p>
            </div>
            <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:12,padding:20}}>
              <div style={{fontWeight:600,fontSize:14,color:'#15803d',marginBottom:10}}>What DisputeIQ can access</div>
              {['Read your orders and order details','Read shipping and fulfillment data','Read dispute notifications','Nothing else — read-only, cannot modify your store'].map((item,i) => (
                <div key={i} style={{display:'flex',gap:8,fontSize:14,color:'#374151',padding:'4px 0'}}>
                  <span style={{color:'#16a34a',fontWeight:700}}>✓</span>{item}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DISPUTES TAB */}
        {tab === 'disputes' && (
          <>
            {/* Stats */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:16,marginBottom:28}}>
              {[
                {label:'Total disputes',value:stats.total,sub:'all time'},
                {label:'Win rate',value:`${winPct}%`,sub:'vs 30% industry avg',color:'#16a34a'},
                {label:'Open disputes',value:stats.pending,sub:'need attention',color:stats.pending>0?'#d97706':undefined},
                {label:'Revenue recovered',value:`$${(stats.recovered||0).toLocaleString()}`,sub:'from won disputes',color:'#16a34a'},
              ].map(s => (
                <div key={s.label} style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:12,padding:'18px 20px'}}>
                  <div style={{fontSize:11,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:6}}>{s.label}</div>
                  <div style={{fontSize:26,fontWeight:800,letterSpacing:-1,color:s.color||'#0a0a0a'}}>{s.value}</div>
                  <div style={{fontSize:12,color:'#9ca3af',marginTop:3}}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div style={{display:'grid',gridTemplateColumns:selected?'1fr 1fr':'1fr',gap:20}}>
              {/* Dispute list */}
              <div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                  <h2 style={{fontSize:18,fontWeight:700}}>Disputes</h2>
                  <span style={{fontSize:13,color:'#6b7280'}}>{disputes.length} total</span>
                </div>
                {disputes.length === 0 ? (
                  <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:14,padding:'48px 32px',textAlign:'center'}}>
                    <div style={{fontSize:36,marginBottom:12}}>🛡️</div>
                    <div style={{fontWeight:700,fontSize:16,marginBottom:8}}>No disputes yet</div>
                    <div style={{fontSize:14,color:'#6b7280',maxWidth:320,margin:'0 auto'}}>
                      When a chargeback arrives on your Shopify store, DisputeIQ will detect it automatically and generate a response within 60 seconds.
                    </div>
                  </div>
                ) : (
                  <div style={{display:'flex',flexDirection:'column',gap:10}}>
                    {disputes.map(d => {
                      const s = STATUS_COLORS[d.status] || STATUS_COLORS.pending
                      const daysLeft = d.due_by ? Math.ceil((new Date(d.due_by).getTime()-Date.now())/(1000*60*60*24)) : null
                      return (
                        <div key={d.id} onClick={() => setSelected(selected?.id===d.id?null:d)}
                          style={{background:'#fff',border:`1px solid ${selected?.id===d.id?'#16a34a':'#e5e7eb'}`,borderRadius:12,padding:'16px 18px',cursor:'pointer',transition:'border-color .15s'}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                            <div>
                              <span style={{fontWeight:600,fontSize:15}}>Order #{d.order_id?.slice(-6)||'—'}</span>
                              <span style={{fontSize:13,color:'#6b7280',marginLeft:10}}>{d.network?.toUpperCase()} {d.reason_code}</span>
                            </div>
                            <span style={{fontWeight:700,fontSize:15}}>{d.currency} {d.amount?.toFixed(2)}</span>
                          </div>
                          <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                            <span style={{fontSize:12,padding:'3px 8px',borderRadius:20,fontWeight:500,background:s.bg,color:s.color}}>{s.label}</span>
                            {d.generated_response && (
                              <span style={{fontSize:12,color:'#16a34a',fontWeight:500}}>
                                {Math.round(d.generated_response.win_probability*100)}% win probability
                              </span>
                            )}
                            {daysLeft !== null && (
                              <span style={{fontSize:12,color:daysLeft<2?'#dc2626':daysLeft<5?'#d97706':'#6b7280',fontWeight:daysLeft<3?600:400}}>
                                {daysLeft<0?'Overdue':daysLeft===0?'Due today':`Due in ${daysLeft}d`}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Response panel */}
              {selected && (
                <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:14,padding:24,height:'fit-content',position:'sticky',top:80}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
                    <h3 style={{fontWeight:700,fontSize:16}}>Dispute response</h3>
                    <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',cursor:'pointer',fontSize:20,color:'#6b7280',padding:'0 4px'}}>×</button>
                  </div>
                  {!selected.generated_response ? (
                    <div style={{textAlign:'center',padding:'40px 0',color:'#6b7280'}}>
                      <div style={{fontSize:32,marginBottom:8}}>⚙️</div>
                      <div style={{fontSize:14}}>Generating response...<br/>Usually takes 30–60 seconds</div>
                    </div>
                  ) : (
                    <>
                      <div style={{background:'#f9fafb',borderRadius:10,padding:'12px 14px',marginBottom:14,fontSize:14,color:'#374151',lineHeight:1.6}}>
                        {selected.generated_response.summary}
                      </div>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
                        <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:10,padding:'12px',textAlign:'center'}}>
                          <div style={{fontSize:22,fontWeight:800,color:'#16a34a'}}>{Math.round(selected.generated_response.win_probability*100)}%</div>
                          <div style={{fontSize:12,color:'#15803d'}}>Win probability</div>
                        </div>
                        <div style={{background:'#f9fafb',borderRadius:10,padding:'12px',textAlign:'center'}}>
                          <div style={{fontSize:14,fontWeight:700,color:'#374151',textTransform:'capitalize'}}>{selected.generated_response.evidence_strength}</div>
                          <div style={{fontSize:12,color:'#6b7280'}}>Evidence strength</div>
                        </div>
                      </div>
                      <div style={{background:'#eff6ff',borderRadius:10,padding:'12px 14px',marginBottom:14,fontSize:13,color:'#1e40af'}}>
                        <strong>Action: </strong>{selected.generated_response.recommended_action}
                      </div>
                      <div style={{marginBottom:14}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                          <div style={{fontSize:13,fontWeight:600}}>Response letter</div>
                          <button onClick={copyLetter}
                            style={{fontSize:12,background:copied?'#16a34a':'#0a0a0a',color:'#fff',border:'none',borderRadius:7,padding:'5px 12px',cursor:'pointer',fontWeight:500}}>
                            {copied?'✓ Copied':'Copy letter'}
                          </button>
                        </div>
                        <textarea readOnly value={selected.generated_response.response_letter} rows={10}
                          style={{width:'100%',border:'1px solid #e5e7eb',borderRadius:10,padding:'12px',fontSize:13,lineHeight:1.7,resize:'none',background:'#f9fafb',color:'#374151'}} />
                      </div>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>Evidence checklist</div>
                        {selected.generated_response.evidence_checklist?.map((e,i) => (
                          <div key={i} style={{display:'flex',gap:8,fontSize:13,padding:'5px 0',borderBottom:'1px solid #f3f4f6',alignItems:'center'}}>
                            <span>{e.available?'✅':e.required?'❌':'⚪'}</span>
                            <span style={{flex:1,color:e.available?'#374151':e.required?'#dc2626':'#9ca3af'}}>{e.item}</span>
                            {e.required&&!e.available&&<span style={{fontSize:11,color:'#dc2626',fontWeight:600}}>REQUIRED</span>}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* SETTINGS TAB */}
        {tab === 'settings' && store && (
          <div style={{maxWidth:600}}>
            <h2 style={{fontSize:22,fontWeight:800,marginBottom:24,letterSpacing:-0.5}}>Settings</h2>
            <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:14,padding:24,marginBottom:16}}>
              <div style={{fontWeight:600,fontSize:15,marginBottom:16}}>Connected store</div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:'1px solid #f3f4f6'}}>
                <span style={{fontSize:14,color:'#6b7280'}}>Shop domain</span>
                <span style={{fontSize:14,fontWeight:500}}>{store.shop_domain}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:'1px solid #f3f4f6'}}>
                <span style={{fontSize:14,color:'#6b7280'}}>Plan</span>
                <span style={{fontSize:14,fontWeight:500,textTransform:'capitalize'}}>{store.plan}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0'}}>
                <span style={{fontSize:14,color:'#6b7280'}}>Status</span>
                <span style={{fontSize:13,background:'#f0fdf4',color:'#15803d',padding:'3px 10px',borderRadius:20,fontWeight:500}}>Active</span>
              </div>
            </div>
            <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:14,padding:24,marginBottom:16}}>
              <div style={{fontWeight:600,fontSize:15,marginBottom:16}}>Notifications</div>
              {['Email alert when new dispute arrives','Email alert when dispute response is ready','Weekly win rate summary'].map((item,i) => (
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:i<2?'1px solid #f3f4f6':'none'}}>
                  <span style={{fontSize:14,color:'#374151'}}>{item}</span>
                  <div style={{width:40,height:22,background:'#16a34a',borderRadius:11,position:'relative',cursor:'pointer'}}>
                    <div style={{position:'absolute',right:2,top:2,width:18,height:18,background:'#fff',borderRadius:'50%'}} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:14,padding:24}}>
              <div style={{fontWeight:600,fontSize:15,marginBottom:16}}>Subscription</div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{fontSize:14,fontWeight:500,textTransform:'capitalize'}}>{store.plan} plan</div>
                  <div style={{fontSize:13,color:'#6b7280',marginTop:2}}>
                    {store.plan==='trial'?'Free trial':'Active subscription'}
                  </div>
                </div>
                <a href="/pricing" style={{background:'#16a34a',color:'#fff',padding:'10px 18px',borderRadius:10,fontSize:14,fontWeight:600,textDecoration:'none'}}>
                  {store.plan==='trial'?'Upgrade now':'Manage plan'}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
