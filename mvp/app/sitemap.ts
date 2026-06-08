import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://disputeiq.co'
  const now  = new Date()
  return [
    { url: base,                                                          lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/pricing`,                                             lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/install`,                                             lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/about`,                                               lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/prevention`,                                          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/referral`,                                            lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/blog`,                                                lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/blog/visa-10-4-chargeback-response`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/shopify-chargeback-win-rate`,                    lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/chargeback-reason-codes-guide`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/how-to-win-shopify-chargebacks`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/irish-merchants-payment-disputes`,               lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/privacy`,                                             lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/terms`,                                               lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ]
}
