'use client'
import { useEffect, useState } from 'react'

export default function ShopifyCallback() {
  const [status, setStatus] = useState('Setting up your account…')

  useEffect(() => {
    const init = async () => {
      const params = new URLSearchParams(window.location.search)
      const shop   = params.get('shop')

      // Persist shop domain immediately so dashboard and sub-pages can find it
      if (shop) {
        localStorage.setItem('disputeiq_shop', shop)
        sessionStorage.setItem('disputeiq_shop', shop)
      }

      // The magic link puts session tokens in the URL hash (#access_token=...&refresh_token=...).
      // The Supabase JS client auto-detects and processes these on initialisation.
      setStatus('Signing you in…')
      const { createSupabaseClientSide } = await import('@/lib/supabase-client')
      const supabase = createSupabaseClientSide()

      // getSession() waits for the client to finish parsing any hash tokens
      const { data: { session } } = await supabase.auth.getSession()

      // Manual fallback: if hash parsing didn't run yet, parse it ourselves
      if (!session) {
        const hash       = window.location.hash.slice(1)
        const hashParams = new URLSearchParams(hash)
        const at         = hashParams.get('access_token')
        const rt         = hashParams.get('refresh_token')
        if (at && rt) {
          await supabase.auth.setSession({ access_token: at, refresh_token: rt })
        }
      }

      setStatus('Redirecting to dashboard…')
      window.location.href = shop
        ? `/dashboard?shop=${encodeURIComponent(shop)}&installed=1`
        : '/dashboard'
    }
    init()
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', flexDirection: 'column', gap: 16, background: '#f7f7f8' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#111827', letterSpacing: -0.5 }}>
        Dispute<span style={{ color: '#16a34a' }}>IQ</span>
      </div>
      <div style={{ width: 40, height: 40, border: '3px solid #e8e8e8', borderTopColor: '#16a34a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <div style={{ fontSize: 14, color: '#6b7280' }}>{status}</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
