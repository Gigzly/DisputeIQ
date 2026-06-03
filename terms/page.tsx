export default function Terms() {
  return (
    <div style={{ maxWidth:760, margin:'0 auto', padding:'60px 24px',
      fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
      color:'#374151', lineHeight:1.7 }}>
      <h1 style={{ fontSize:32, fontWeight:800, letterSpacing:-1, marginBottom:8, color:'#0a0a0a' }}>
        Terms of Service
      </h1>
      <p style={{ color:'#6b7280', marginBottom:40 }}>
        Last updated: {new Date().toLocaleDateString('en-GB', { year:'numeric', month:'long', day:'numeric' })}
      </p>

      <section style={{ marginBottom:32 }}>
        <h2 style={{ fontSize:20, fontWeight:700, marginBottom:10, color:'#0a0a0a' }}>1. Service description</h2>
        <p>DisputeIQ provides AI-assisted chargeback dispute response generation for Shopify merchants.
        The service generates draft dispute responses based on order data from your Shopify store.
        These responses are drafts for your review — you remain responsible for reviewing, editing,
        and submitting all dispute responses to card networks.</p>
      </section>

      <section style={{ marginBottom:32 }}>
        <h2 style={{ fontSize:20, fontWeight:700, marginBottom:10, color:'#0a0a0a' }}>2. Not legal advice</h2>
        <p>DisputeIQ is a software tool, not a legal service. Nothing produced by DisputeIQ constitutes
        legal advice. Dispute outcomes depend on many factors outside our control including card network
        policies, available evidence, and adjudicator decisions. We make no guarantee of dispute outcomes.</p>
      </section>

      <section style={{ marginBottom:32 }}>
        <h2 style={{ fontSize:20, fontWeight:700, marginBottom:10, color:'#0a0a0a' }}>3. Shopify data access</h2>
        <p>By installing DisputeIQ, you grant us read-only access to your Shopify store data
        (orders, fulfillments, customers, disputes) solely for the purpose of generating
        dispute responses. We do not modify your store data or access your funds.</p>
      </section>

      <section style={{ marginBottom:32 }}>
        <h2 style={{ fontSize:20, fontWeight:700, marginBottom:10, color:'#0a0a0a' }}>4. Subscription and billing</h2>
        <p>Subscriptions are billed monthly. A 14-day free trial is available on all plans.
        You may cancel at any time — cancellation takes effect at the end of the current billing period.
        No refunds are provided for partial months.</p>
      </section>

      <section style={{ marginBottom:32 }}>
        <h2 style={{ fontSize:20, fontWeight:700, marginBottom:10, color:'#0a0a0a' }}>5. Limitation of liability</h2>
        <p>DisputeIQ's liability is limited to the amount you paid in the 3 months preceding any claim.
        We are not liable for lost disputes, lost revenue, or consequential damages arising from
        use of the service.</p>
      </section>

      <section style={{ marginBottom:32 }}>
        <h2 style={{ fontSize:20, fontWeight:700, marginBottom:10, color:'#0a0a0a' }}>6. Acceptable use</h2>
        <p>You may not use DisputeIQ to generate fraudulent dispute responses or to misrepresent
        transaction details to card networks. Violation of this policy results in immediate
        account termination.</p>
      </section>

      <section>
        <h2 style={{ fontSize:20, fontWeight:700, marginBottom:10, color:'#0a0a0a' }}>7. Contact</h2>
        <p>Questions: <a href="mailto:hello@disputeiq.co" style={{ color:'#16a34a' }}>hello@disputeiq.co</a></p>
      </section>
    </div>
  )
}
