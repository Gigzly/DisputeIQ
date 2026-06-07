'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Install() {
  const [shopUrl, setShopUrl]           = useState('')
  const [loading, setLoading]           = useState(false)
  const [autoRedirecting, setAutoRedirecting] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const shop   = params.get('shop')
    if (shop) {
      setAutoRedirecting(true)
      window.location.href = `/api/shopify-auth?shop=${encodeURIComponent(shop)}`
    }
  }, [])

  const install = () => {
    if (!shopUrl.trim()) return
    setLoading(true)
    let shop = shopUrl.trim().replace(/^https?:\/\//, '').replace(/\/$/, '')
    if (!shop.includes('.myshopify.com')) shop = `${shop}.myshopify.com`
    window.location.href = `/api/shopify-auth?shop=${encodeURIComponent(shop)}`
  }

  if (autoRedirecting) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system,sans-serif', flexDirection: 'column', gap: 14, background: '#f7f7f8' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#111827', letterSpacing: -0.5 }}>Dispute<span style={{ color: '#16a34a' }}>IQ</span></div>
      <div style={{ width: 36, height: 36, border: '3px solid #e8e8e8', borderTopColor: '#16a34a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <div style={{ fontSize: 14, color: '#6b7280' }}>Connecting to Shopify…</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f8', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        <div style={{ textAlign: 'center', marginBottom: 10 }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: 22, letterSpacing: -0.5, textDecoration: 'none', color: '#111827' }}>
            Dispute<span style={{ color: '#16a34a' }}>IQ</span>
          </Link>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, marginBottom: 10, color: '#111827' }}>Install DisputeIQ</h1>
          <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.65 }}>
            Enter your Shopify store URL to connect and start winning chargebacks automatically.
          </p>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: 28, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#111827' }}>
            Your Shopify store URL
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              value={shopUrl}
              onChange={e => setShopUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && install()}
              placeholder="yourstore.myshopify.com"
              style={{ flex: 1, border: '1.5px solid #e8e8e8', borderRadius: 10, padding: '12px 14px', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#111827' }}
            />
            <button
              onClick={install}
              disabled={loading || !shopUrl.trim()}
              style={{ background: loading ? '#86efac' : '#16a34a', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 22px', fontSize: 14, fontWeight: 600, cursor: loading ? 'default' : 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
              {loading ? 'Connecting…' : 'Install →'}
            </button>
          </div>
          <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>e.g. "mystore" or "mystore.myshopify.com"</p>
        </div>

        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 18, marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: '#15803d', marginBottom: 10 }}>Read-only access only</div>
          {['Orders and order details', 'Shipping and fulfillment data', 'Dispute notifications', 'Cannot modify your store or access funds'].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#374151', padding: '3px 0' }}>
              <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>{item}
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#9ca3af' }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
