export default function Privacy() {
  return (
    <div style={{ maxWidth:760, margin:'0 auto', padding:'60px 24px', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', color:'#374151', lineHeight:1.7 }}>
      <h1 style={{ fontSize:32, fontWeight:800, letterSpacing:-1, marginBottom:8, color:'#0a0a0a' }}>Privacy Policy</h1>
      <p style={{ color:'#6b7280', marginBottom:40 }}>Last updated: {new Date().toLocaleDateString('en-GB', { year:'numeric', month:'long', day:'numeric' })}</p>

      <section style={{ marginBottom:36 }}>
        <h2 style={{ fontSize:20, fontWeight:700, marginBottom:12, color:'#0a0a0a' }}>What we collect</h2>
        <p>DisputeIQ collects the minimum data necessary to provide chargeback dispute assistance:</p>
        <ul style={{ paddingLeft:20, marginTop:8 }}>
          <li style={{ marginBottom:6 }}>Your Shopify store domain and a read-only access token (to pull order and shipping data)</li>
          <li style={{ marginBottom:6 }}>Order data for disputed transactions only (order number, amounts, customer addresses, shipping tracking)</li>
          <li style={{ marginBottom:6 }}>Transaction metadata (AVS result, CVV result, gateway response codes)</li>
          <li style={{ marginBottom:6 }}>Your email address for alerts and product communications</li>
          <li style={{ marginBottom:6 }}>Billing information processed by Stripe (we never see or store your card details)</li>
        </ul>
      </section>

      <section style={{ marginBottom:36 }}>
        <h2 style={{ fontSize:20, fontWeight:700, marginBottom:12, color:'#0a0a0a' }}>How we use it</h2>
        <p>We use your data exclusively to:</p>
        <ul style={{ paddingLeft:20, marginTop:8 }}>
          <li style={{ marginBottom:6 }}>Generate dispute response documents for your chargebacks</li>
          <li style={{ marginBottom:6 }}>Send you alerts when new disputes arrive</li>
          <li style={{ marginBottom:6 }}>Calculate your win rate and recovery metrics</li>
          <li style={{ marginBottom:6 }}>Process your subscription via Stripe</li>
        </ul>
        <p style={{ marginTop:12 }}>We do not sell your data, share it with third parties for marketing purposes, or use it to train AI models.</p>
      </section>

      <section style={{ marginBottom:36 }}>
        <h2 style={{ fontSize:20, fontWeight:700, marginBottom:12, color:'#0a0a0a' }}>Shopify data access</h2>
        <p>Our Shopify integration uses read-only OAuth with the following scopes: <code style={{ background:'#f3f4f6', padding:'2px 6px', borderRadius:4, fontSize:13 }}>read_orders</code>, <code style={{ background:'#f3f4f6', padding:'2px 6px', borderRadius:4, fontSize:13 }}>read_fulfillments</code>, <code style={{ background:'#f3f4f6', padding:'2px 6px', borderRadius:4, fontSize:13 }}>read_customers</code>, <code style={{ background:'#f3f4f6', padding:'2px 6px', borderRadius:4, fontSize:13 }}>read_disputes</code>.</p>
        <p style={{ marginTop:8 }}>We cannot modify your store, process orders, or access your Shopify Payments balance. We only read data related to disputed transactions.</p>
      </section>

      <section style={{ marginBottom:36 }}>
        <h2 style={{ fontSize:20, fontWeight:700, marginBottom:12, color:'#0a0a0a' }}>Data retention</h2>
        <p>Dispute evidence and generated responses are retained for 24 months to allow win/loss tracking and to assist with re-disputes. You may request deletion of your data at any time by emailing hello@disputeiq.co.</p>
      </section>

      <section style={{ marginBottom:36 }}>
        <h2 style={{ fontSize:20, fontWeight:700, marginBottom:12, color:'#0a0a0a' }}>Your rights (GDPR)</h2>
        <p>If you are in the European Economic Area, you have the right to access, correct, or delete your personal data. Contact us at hello@disputeiq.co to exercise these rights.</p>
      </section>

      <section style={{ marginBottom:36 }}>
        <h2 style={{ fontSize:20, fontWeight:700, marginBottom:12, color:'#0a0a0a' }}>Contact</h2>
        <p>Questions about this policy: <a href="mailto:hello@disputeiq.co" style={{ color:'#16a34a' }}>hello@disputeiq.co</a></p>
      </section>
    </div>
  )
}
