import Link from 'next/link'
import ROICalculator from '@/components/roi-calculator'

const REASON_TABLE = [
  { code:'13.1', network:'Visa',       color:{bg:'#eff6ff',fg:'#1e40af'}, reason:'Merchandise Not Received',    rate:'68%' },
  { code:'10.4', network:'Visa',       color:{bg:'#eff6ff',fg:'#1e40af'}, reason:'Card Absent Fraud',           rate:'52%' },
  { code:'4853', network:'Mastercard', color:{bg:'#fef3c7',fg:'#92400e'}, reason:'Not as Described',            rate:'59%' },
  { code:'4855', network:'Mastercard', color:{bg:'#fef3c7',fg:'#92400e'}, reason:'Goods Not Provided',          rate:'65%' },
  { code:'C08',  network:'Amex',       color:{bg:'#fdf4ff',fg:'#7e22ce'}, reason:'Goods / Services Not Received', rate:'61%' },
  { code:'C02',  network:'Amex',       color:{bg:'#fdf4ff',fg:'#7e22ce'}, reason:'Credit Not Received',         rate:'66%' },
]

export default function Home() {
  return (
    <div style={{ minHeight:'100vh', background:'#fff', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', color:'#111827' }}>

      {/* Nav */}
      <nav style={{ borderBottom:'1px solid #f3f4f6', padding:'0 40px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, background:'rgba(255,255,255,0.96)', backdropFilter:'blur(8px)', zIndex:50 }}>
        <Link href="/" style={{ fontWeight:800, fontSize:20, letterSpacing:-0.5, textDecoration:'none', color:'#111827' }}>
          Dispute<span style={{ color:'#16a34a' }}>IQ</span>
        </Link>
        <div style={{ display:'flex', gap:4, alignItems:'center' }}>
          <Link href="/blog"    style={{ fontSize:14, color:'#6b7280', fontWeight:500, textDecoration:'none', padding:'8px 14px' }}>Blog</Link>
          <Link href="/about"   style={{ fontSize:14, color:'#6b7280', fontWeight:500, textDecoration:'none', padding:'8px 14px' }}>About</Link>
          <Link href="/pricing" style={{ fontSize:14, color:'#6b7280', fontWeight:500, textDecoration:'none', padding:'8px 14px' }}>Pricing</Link>
          <Link href="/auth/login"   style={{ fontSize:14, color:'#374151', fontWeight:500, textDecoration:'none', padding:'8px 14px' }}>Sign in</Link>
          <Link href="/auth/signup"  style={{ background:'#111827', color:'#fff', padding:'9px 20px', borderRadius:9, fontSize:14, fontWeight:600, textDecoration:'none', marginLeft:6 }}>
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth:800, margin:'0 auto', padding:'96px 24px 80px', textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#f0fdf4', color:'#15803d', padding:'6px 14px', borderRadius:20, fontSize:13, fontWeight:600, marginBottom:28, border:'1px solid #bbf7d0' }}>
          <span style={{ width:7, height:7, background:'#16a34a', borderRadius:'50%', display:'inline-block', flexShrink:0 }} />
          Now live for Shopify merchants
        </div>
        <h1 className="hero-title" style={{ fontSize:'clamp(40px,6vw,62px)', fontWeight:900, lineHeight:1.05, letterSpacing:-2.5, marginBottom:24, color:'#111827' }}>
          Stop losing<br/><span style={{ color:'#16a34a' }}>winnable</span> chargebacks
        </h1>
        <p style={{ fontSize:19, color:'#6b7280', maxWidth:540, margin:'0 auto 40px', lineHeight:1.65 }}>
          DisputeIQ connects to your Shopify store and automatically generates evidence-backed dispute responses formatted for each card network's exact requirements.
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginBottom:16 }}>
          <Link href="/auth/signup" style={{ background:'#16a34a', color:'#fff', padding:'15px 32px', borderRadius:10, fontSize:15, fontWeight:700, textDecoration:'none', display:'inline-block' }}>
            Start free 14-day trial →
          </Link>
          <Link href="/about" style={{ background:'transparent', color:'#374151', padding:'15px 28px', borderRadius:10, fontSize:15, fontWeight:500, textDecoration:'none', border:'1.5px solid #e5e7eb', display:'inline-block' }}>
            Our story
          </Link>
        </div>
        <p style={{ fontSize:13, color:'#9ca3af' }}>No credit card · Read-only Shopify access · Setup in 2 minutes</p>
      </div>

      {/* Stats bar */}
      <div style={{ borderTop:'1px solid #f3f4f6', borderBottom:'1px solid #f3f4f6', padding:'44px 24px' }}>
        <div className="stats-grid" style={{ maxWidth:920, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:32, textAlign:'center' }}>
          {[
            { val:'62%',    label:'Average win rate with DisputeIQ' },
            { val:'30%',    label:'Industry average without automation' },
            { val:'60s',    label:'Response generation time' },
            { val:'$8,400', label:'Average annual recovery per store' },
          ].map(({ val, label }) => (
            <div key={val}>
              <div style={{ fontSize:42, fontWeight:900, letterSpacing:-1.5, color:'#111827', lineHeight:1 }}>{val}</div>
              <div style={{ fontSize:13, color:'#6b7280', marginTop:8, lineHeight:1.5 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Product screenshot mockup */}
      <div style={{ background:'#f9fafb', borderTop:'1px solid #f3f4f6', borderBottom:'1px solid #f3f4f6', padding:'64px 24px' }}>
        <div style={{ maxWidth:960, margin:'0 auto', textAlign:'center', marginBottom:36 }}>
          <h2 style={{ fontSize:30, fontWeight:900, letterSpacing:-1, marginBottom:10 }}>Everything you need, nothing you don't</h2>
          <p style={{ fontSize:16, color:'#6b7280' }}>A clean dashboard that shows you what matters: deadlines, win probability, and exactly what to submit.</p>
        </div>
        {/* Browser chrome mockup */}
        <div style={{ maxWidth:900, margin:'0 auto', borderRadius:14, overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.12)', border:'1px solid #e5e7eb' }}>
          {/* Browser bar */}
          <div style={{ background:'#f3f4f6', padding:'12px 16px', display:'flex', alignItems:'center', gap:8, borderBottom:'1px solid #e5e7eb' }}>
            <div style={{ display:'flex', gap:6 }}>
              {['#fc5753','#fdbc40','#33c748'].map(c => <div key={c} style={{ width:12, height:12, borderRadius:'50%', background:c }} />)}
            </div>
            <div style={{ flex:1, background:'#fff', borderRadius:6, padding:'5px 12px', fontSize:12, color:'#9ca3af', marginLeft:8 }}>
              disputeiq.co/dashboard
            </div>
          </div>
          {/* Mock dashboard */}
          <div style={{ background:'#f7f7f8', display:'flex', height:340 }}>
            {/* Sidebar */}
            <div style={{ width:180, background:'#fff', borderRight:'1px solid #e8e8e8', padding:'16px 12px', flexShrink:0 }}>
              <div style={{ fontWeight:800, fontSize:14, letterSpacing:-0.3, marginBottom:20, color:'#111827' }}>Dispute<span style={{ color:'#16a34a' }}>IQ</span></div>
              {[{ label:'Disputes', active:true }, { label:'Settings', active:false }].map(item => (
                <div key={item.label} style={{ padding:'8px 10px', borderRadius:7, marginBottom:4, fontSize:12, fontWeight:item.active?600:400, background:item.active?'#f0fdf4':'transparent', color:item.active?'#15803d':'#374151' }}>
                  {item.label}
                </div>
              ))}
            </div>
            {/* Main area */}
            <div style={{ flex:1, padding:'20px', overflow:'hidden' }}>
              {/* KPI strip */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:16 }}>
                {[
                  { label:'Total', value:'12' },
                  { label:'Win rate', value:'61%', green:true },
                  { label:'Open', value:'3' },
                  { label:'Recovered', value:'$4,240', green:true },
                ].map(s => (
                  <div key={s.label} style={{ background:'#fff', border:'1px solid #e8e8e8', borderRadius:8, padding:'10px 12px' }}>
                    <div style={{ fontSize:9, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>{s.label}</div>
                    <div style={{ fontSize:16, fontWeight:800, color:s.green?'#16a34a':'#111827' }}>{s.value}</div>
                  </div>
                ))}
              </div>
              {/* Dispute rows */}
              {[
                { order:'#567890', code:'VISA 13.1', amount:'$149.99', status:'Response ready', statusBg:'#dcfce7', statusColor:'#166534', due:'Due in 5d', urgent:false },
                { order:'#234567', code:'VISA 10.4', amount:'$89.00',  status:'Response ready', statusBg:'#dcfce7', statusColor:'#166534', due:'Due in 2d', urgent:true },
                { order:'#890123', code:'MC 4853',   amount:'$220.00', status:'Won ✓',          statusBg:'#f0fdf4', statusColor:'#15803d', due:'',        urgent:false },
              ].map(d => (
                <div key={d.order} style={{ background:'#fff', border:`1.5px solid ${d.urgent?'#fca5a5':'#e8e8e8'}`, borderRadius:9, padding:'10px 14px', marginBottom:8, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <span style={{ fontWeight:700, fontSize:12 }}>Order {d.order}</span>
                    <span style={{ fontSize:11, color:'#9ca3af', marginLeft:8 }}>{d.code}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:20, background:d.statusBg, color:d.statusColor }}>{d.status}</span>
                    {d.due && <span style={{ fontSize:11, color:d.urgent?'#dc2626':'#9ca3af', fontWeight:d.urgent?700:400 }}>{d.due}</span>}
                    <span style={{ fontWeight:700, fontSize:12 }}>{d.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Problem / Solution */}
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'80px 24px' }}>
        <div className="grid-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
          <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:16, padding:32 }}>
            <div style={{ fontSize:12, fontWeight:700, color:'#dc2626', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:18 }}>The problem</div>
            <h2 style={{ fontSize:22, fontWeight:800, letterSpacing:-0.5, marginBottom:22, color:'#111827', lineHeight:1.3 }}>
              Most merchants lose 70% of chargebacks they could have won
            </h2>
            {['Wrong evidence submitted for the reason code','Generic response letters that miss the specific claim','Missing the submission deadline entirely','No time to research card network requirements'].map((item,i) => (
              <div key={i} style={{ display:'flex', gap:10, fontSize:14, color:'#7f1d1d', padding:'6px 0', lineHeight:1.6 }}>
                <span style={{ color:'#dc2626', fontWeight:700, flexShrink:0 }}>✕</span>{item}
              </div>
            ))}
          </div>
          <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:16, padding:32 }}>
            <div style={{ fontSize:12, fontWeight:700, color:'#16a34a', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:18 }}>The solution</div>
            <h2 style={{ fontSize:22, fontWeight:800, letterSpacing:-0.5, marginBottom:22, color:'#111827', lineHeight:1.3 }}>
              DisputeIQ does it right, for every chargeback, automatically
            </h2>
            {['Analyses the exact reason code and required evidence','Assembles order, shipping, and customer data automatically','Generates a formatted response for that specific card network','Alerts you instantly — review and submit in 2 minutes'].map((item,i) => (
              <div key={i} style={{ display:'flex', gap:10, fontSize:14, color:'#14532d', padding:'6px 0', lineHeight:1.6 }}>
                <span style={{ color:'#16a34a', fontWeight:700, flexShrink:0 }}>✓</span>{item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ background:'#f9fafb', borderTop:'1px solid #f3f4f6', borderBottom:'1px solid #f3f4f6', padding:'72px 24px' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <h2 style={{ fontSize:36, fontWeight:900, letterSpacing:-1.5, marginBottom:12 }}>From chargeback to response in 60 seconds</h2>
            <p style={{ fontSize:16, color:'#6b7280' }}>Four steps. No manual work — you only review.</p>
          </div>
          <div className="grid-4" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:18 }}>
            {[
              { num:'01', title:'Connect your store',    desc:'Read-only Shopify OAuth. 90 seconds. We can never modify your store or access funds.' },
              { num:'02', title:'Dispute arrives',        desc:'Detected via Shopify webhook instantly. Evidence assembled from your order data automatically.' },
              { num:'03', title:'Response generated',    desc:'AI generates a formatted response for that exact reason code and card network — ~60 seconds.' },
              { num:'04', title:'You review and submit', desc:'Email with a link. Two minutes to review. Win rate improves from 30% to 60%+.' },
            ].map(s => (
              <div key={s.num} style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:14, padding:24, boxShadow:'0 1px 2px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize:30, fontWeight:900, color:'#16a34a', marginBottom:14, letterSpacing:-1, lineHeight:1 }}>{s.num}</div>
                <div style={{ fontSize:15, fontWeight:700, marginBottom:8, color:'#111827' }}>{s.title}</div>
                <div style={{ fontSize:14, color:'#6b7280', lineHeight:1.65 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROI Calculator */}
      <div style={{ padding:'72px 24px' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <h2 style={{ fontSize:34, fontWeight:900, letterSpacing:-1.5, marginBottom:12 }}>Will it pay for itself?</h2>
          <p style={{ fontSize:16, color:'#6b7280' }}>Enter your store's numbers. See the ROI in real time.</p>
        </div>
        <ROICalculator />
      </div>

      {/* Reason codes table */}
      <div style={{ background:'#f9fafb', borderTop:'1px solid #f3f4f6', borderBottom:'1px solid #f3f4f6', padding:'72px 24px' }}>
        <div style={{ maxWidth:880, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:44 }}>
            <h2 style={{ fontSize:34, fontWeight:900, letterSpacing:-1.5, marginBottom:12 }}>Win rates by reason code</h2>
            <p style={{ fontSize:16, color:'#6b7280', maxWidth:540, margin:'0 auto' }}>
              DisputeIQ knows the exact evidence requirements for all 22 reason codes — and assembles it automatically.
            </p>
          </div>
          <div style={{ border:'1px solid #e5e7eb', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ display:'grid', gridTemplateColumns:'90px 120px 1fr 160px', background:'#f9fafb', borderBottom:'1px solid #e5e7eb', padding:'12px 22px' }}>
              {['Code','Network','Reason','Win rate with DisputeIQ'].map(h => (
                <div key={h} style={{ fontSize:11, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.06em' }}>{h}</div>
              ))}
            </div>
            {REASON_TABLE.map((row, i) => (
              <div key={row.code} style={{ display:'grid', gridTemplateColumns:'90px 120px 1fr 160px', padding:'14px 22px', borderBottom:i<REASON_TABLE.length-1?'1px solid #f3f4f6':'none', background:'#fff', alignItems:'center' }}>
                <div style={{ fontFamily:'ui-monospace,monospace', fontSize:13, fontWeight:700, color:'#374151' }}>{row.code}</div>
                <div><span style={{ fontSize:11, padding:'3px 9px', borderRadius:20, fontWeight:600, background:row.color.bg, color:row.color.fg }}>{row.network}</span></div>
                <div style={{ fontSize:14, color:'#374151' }}>{row.reason}</div>
                <div style={{ fontSize:16, fontWeight:900, color:'#16a34a', letterSpacing:-0.3 }}>{row.rate}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize:12, color:'#9ca3af', marginTop:12, textAlign:'center' }}>22 reason codes supported across Visa, Mastercard, and Amex</p>
        </div>
      </div>

      {/* Testimonial */}
      <div style={{ padding:'72px 24px' }}>
        <div style={{ maxWidth:620, margin:'0 auto', textAlign:'center' }}>
          <div style={{ fontSize:48, color:'#16a34a', marginBottom:20, letterSpacing:-2, fontWeight:900, lineHeight:1 }}>"</div>
          <p style={{ fontSize:20, color:'#111827', lineHeight:1.75, fontWeight:500, marginBottom:28, letterSpacing:-0.2 }}>
            We went from a 28% win rate to 61% in six weeks. The first chargeback it handled was a $2,800 Visa 13.1 — it had the tracking data, delivery confirmation, and response letter ready before I even knew the dispute existed.
          </p>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:14 }}>
            <div style={{ width:42, height:42, background:'#16a34a', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:17, flexShrink:0 }}>J</div>
            <div style={{ textAlign:'left' }}>
              <div style={{ fontSize:14, fontWeight:600, color:'#111827' }}>James T.</div>
              <div style={{ fontSize:13, color:'#6b7280' }}>Head of Operations · Shopify store, $1.4M GMV</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust signals */}
      <div style={{ background:'#f9fafb', borderTop:'1px solid #f3f4f6', borderBottom:'1px solid #f3f4f6', padding:'32px 24px' }}>
        <div style={{ maxWidth:800, margin:'0 auto', display:'flex', justifyContent:'center', gap:32, flexWrap:'wrap' }}>
          {[
            ['🔒', 'Read-only Shopify access'],
            ['🇪🇺', 'GDPR compliant'],
            ['🔐', 'Encrypted in transit'],
            ['🛡️', 'Data never sold or shared'],
            ['✅', 'No credit card to start'],
          ].map(([icon, label]) => (
            <div key={label as string} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'#6b7280', fontWeight:500 }}>
              <span>{icon}</span>{label}
            </div>
          ))}
        </div>
      </div>

      {/* Dark CTA */}
      <div style={{ background:'#111827', padding:'88px 24px', textAlign:'center' }}>
        <h2 style={{ fontSize:38, fontWeight:900, letterSpacing:-1.5, color:'#fff', marginBottom:16, lineHeight:1.1 }}>Stop losing winnable chargebacks</h2>
        <p style={{ fontSize:17, color:'#9ca3af', marginBottom:40, maxWidth:400, margin:'0 auto 40px', lineHeight:1.7 }}>
          Connect in 2 minutes. See your win rate improve before you pay a cent.
        </p>
        <Link href="/auth/signup" style={{ background:'#16a34a', color:'#fff', padding:'16px 36px', borderRadius:10, fontSize:16, fontWeight:700, textDecoration:'none', display:'inline-block' }}>
          Get started free →
        </Link>
        <p style={{ color:'#4b5563', fontSize:13, marginTop:20 }}>No credit card · 14-day trial · Cancel anytime</p>
      </div>

      {/* Footer */}
      <footer style={{ padding:'24px 40px', borderTop:'1px solid #f3f4f6', display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:13, color:'#9ca3af', flexWrap:'wrap', gap:12 }}>
        <span style={{ fontWeight:600, color:'#374151' }}>Dispute<span style={{ color:'#16a34a' }}>IQ</span> <span style={{ fontWeight:400, color:'#9ca3af' }}>© 2026</span></span>
        <div style={{ display:'flex', gap:20 }}>
          {[['About','/about'],['Blog','/blog'],['Pricing','/pricing'],['Privacy','/privacy'],['Terms','/terms'],['Sign in','/auth/login']].map(([label,href]) => (
            <Link key={href} href={href} style={{ color:'#9ca3af', textDecoration:'none' }}>{label}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
