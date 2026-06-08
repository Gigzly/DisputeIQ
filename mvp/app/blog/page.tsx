import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chargeback Guides for Shopify Merchants — DisputeIQ Blog',
  description: 'Practical guides on winning chargebacks, reason codes, win rate benchmarks, and chargeback prevention for Shopify merchants.',
}

const POSTS = [
  {
    slug: 'visa-10-4-chargeback-response',
    title: 'Visa 10.4 Chargeback: How to Write a Winning Response (2026 Guide)',
    date: '2026-06-08',
    readTime: '8 min',
    tag: 'Visa 10.4',
    excerpt: 'Visa 10.4 is the most common fraud dispute code — and one of the most winnable. Here\'s exactly what evidence you need, how CE 3.0 gets automatic reversals, and a template response letter.',
  },
  {
    slug: 'shopify-chargeback-win-rate',
    title: 'Shopify Chargeback Win Rate Benchmarks: What\'s Normal in 2026?',
    date: '2026-06-08',
    readTime: '6 min',
    tag: 'Benchmarks',
    excerpt: 'The average win rate is 30–35%. Merchants using automated evidence assembly reach 58–67%. Here\'s what drives the difference — and how to find out where you actually stand.',
  },
  {
    slug: 'chargeback-reason-codes-guide',
    title: 'Chargeback Reason Codes: Complete Guide for Shopify Merchants (2026)',
    date: '2026-06-01',
    readTime: '8 min',
    tag: 'Reason codes',
    excerpt: 'Every chargeback has a reason code. Most merchants ignore them. That gap is why the average win rate is 30% instead of 60%.',
  },
  {
    slug: 'how-to-win-shopify-chargebacks',
    title: 'How to Win a Shopify Chargeback: Step-by-Step Guide',
    date: '2026-06-01',
    readTime: '6 min',
    tag: 'Guide',
    excerpt: 'The merchants who consistently win chargebacks do one thing differently: they match their evidence to the reason code requirements.',
  },
  {
    slug: 'irish-merchants-payment-disputes',
    title: 'Payment Disputes for Irish Shopify Merchants: What You Need to Know',
    date: '2026-06-01',
    readTime: '5 min',
    tag: 'Ireland',
    excerpt: 'Irish merchants face the same chargeback rules as UK and EU merchants — but with some important differences around PSD2, SCA, and Shopify Payments availability.',
  },
]

export default function Blog() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      <nav style={{ borderBottom: '1px solid #e5e7eb', padding: '0 40px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: 18, textDecoration: 'none', color: '#0a0a0a' }}>Dispute<span style={{ color: '#16a34a' }}>IQ</span></Link>
        <Link href="/auth/signup" style={{ background: '#16a34a', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Get started free</Link>
      </nav>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1, marginBottom: 8 }}>Chargeback guides</h1>
        <p style={{ fontSize: 16, color: '#6b7280', marginBottom: 40 }}>Everything Shopify merchants need to know about winning chargebacks.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {POSTS.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', padding: '24px 0', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 11, background: '#f3f4f6', color: '#374151', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>{post.tag}</span>
                <span style={{ fontSize: 13, color: '#9ca3af' }}>{new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · {post.readTime} read</span>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.3, marginBottom: 8, color: '#0a0a0a' }}>{post.title}</h2>
              <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
