'use client'
import { useEffect } from 'react'

declare global {
  interface Window {
    $crisp: any[]
    CRISP_WEBSITE_ID: string
  }
}

export default function CrispChat() {
  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID
    if (!id || typeof window === 'undefined') return
    window.$crisp = []
    window.CRISP_WEBSITE_ID = id
    const s = document.createElement('script')
    s.src = 'https://client.crisp.chat/l.js'
    s.async = true
    document.head.appendChild(s)
    return () => { document.head.removeChild(s) }
  }, [])
  return null
}
