import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://disputeiq.co'),
  title: {
    default: 'DisputeIQ — Stop losing winnable chargebacks',
    template: '%s | DisputeIQ',
  },
  description: 'AI-powered chargeback defence for Shopify merchants. Auto-generate evidence-backed dispute responses. Win rate from 30% to 60%+.',
  openGraph: {
    title: 'DisputeIQ — Stop losing winnable chargebacks',
    description: 'Automatically generates evidence-backed dispute responses for every chargeback.',
    url: 'https://disputeiq.co',
    siteName: 'DisputeIQ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DisputeIQ — Stop losing winnable chargebacks',
    description: 'AI-powered chargeback defence for Shopify merchants.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
