import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DisputeIQ — Stop losing winnable chargebacks',
  description: 'AI-powered chargeback defence for Shopify merchants. Improve your win rate from 30% to 60%+.',
  openGraph: {
    title: 'DisputeIQ — Stop losing winnable chargebacks',
    description: 'Automatically generates evidence-backed dispute responses for every chargeback.',
    url: 'https://disputeiq.co',
    siteName: 'DisputeIQ',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
