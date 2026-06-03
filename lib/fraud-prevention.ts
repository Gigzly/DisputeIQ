import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export interface OrderRiskSignals {
  order_id: string
  order_value: number
  currency: string
  customer_email: string
  billing_country: string
  shipping_country: string
  avs_result: string | null
  cvv_result: string | null
  ip_country: string | null
  is_first_order: boolean
  prior_orders_count: number
  prior_chargebacks: number
  shipping_speed: string
  email_domain_age_days: number | null
  billing_shipping_match: boolean
  high_value_items: boolean
  digital_goods: boolean
}

export interface RiskAssessment {
  risk_score: number          // 0-100
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  recommended_action: string
  risk_factors: RiskFactor[]
  protective_factors: string[]
}

export interface RiskFactor {
  factor: string
  severity: 'low' | 'medium' | 'high'
  description: string
}

// Rule-based scoring — fast, deterministic, no API call needed
export function scoreOrderRisk(signals: OrderRiskSignals): RiskAssessment {
  let score = 0
  const riskFactors: RiskFactor[] = []
  const protectiveFactors: string[] = []

  // ── High-weight risk signals ────────────────────────────────────────────
  if (signals.prior_chargebacks > 0) {
    score += 35
    riskFactors.push({
      factor: 'Prior chargeback history',
      severity: 'high',
      description: `Customer has ${signals.prior_chargebacks} prior chargeback(s)`,
    })
  }

  if (signals.avs_result && !['Y', 'A', 'Z'].includes(signals.avs_result)) {
    score += 20
    riskFactors.push({
      factor: 'AVS mismatch',
      severity: 'high',
      description: `AVS result: ${signals.avs_result} — billing address does not fully match`,
    })
  }

  if (signals.cvv_result && signals.cvv_result !== 'M') {
    score += 15
    riskFactors.push({
      factor: 'CVV mismatch',
      severity: 'high',
      description: `CVV result: ${signals.cvv_result}`,
    })
  }

  // ── Medium-weight risk signals ──────────────────────────────────────────
  if (!signals.billing_shipping_match) {
    score += 15
    riskFactors.push({
      factor: 'Billing/shipping address mismatch',
      severity: 'medium',
      description: 'Billing and shipping countries differ',
    })
  }

  if (signals.ip_country && signals.billing_country &&
      signals.ip_country !== signals.billing_country) {
    score += 12
    riskFactors.push({
      factor: 'IP/billing country mismatch',
      severity: 'medium',
      description: `IP location (${signals.ip_country}) differs from billing country (${signals.billing_country})`,
    })
  }

  if (signals.is_first_order && signals.order_value > 200) {
    score += 10
    riskFactors.push({
      factor: 'High-value first order',
      severity: 'medium',
      description: `First order worth ${signals.currency} ${signals.order_value}`,
    })
  }

  if (signals.shipping_speed === 'overnight' || signals.shipping_speed === 'express') {
    score += 8
    riskFactors.push({
      factor: 'Expedited shipping requested',
      severity: 'medium',
      description: 'Fraudsters often request fastest shipping to receive goods before dispute',
    })
  }

  if (signals.email_domain_age_days !== null && signals.email_domain_age_days < 30) {
    score += 10
    riskFactors.push({
      factor: 'Very new email domain',
      severity: 'medium',
      description: `Email domain created ${signals.email_domain_age_days} days ago`,
    })
  }

  if (signals.digital_goods) {
    score += 5
    riskFactors.push({
      factor: 'Digital goods',
      severity: 'low',
      description: 'Digital orders have higher chargeback rates and no proof of delivery',
    })
  }

  // ── Protective factors (reduce risk) ────────────────────────────────────
  if (signals.prior_orders_count >= 3 && signals.prior_chargebacks === 0) {
    score -= 15
    protectiveFactors.push(`${signals.prior_orders_count} prior orders with no chargebacks`)
  }

  if (signals.avs_result === 'Y') {
    score -= 8
    protectiveFactors.push('Full AVS match')
  }

  if (signals.cvv_result === 'M') {
    score -= 5
    protectiveFactors.push('CVV match confirmed')
  }

  if (signals.billing_shipping_match && signals.avs_result === 'Y') {
    score -= 5
    protectiveFactors.push('Consistent address data across all signals')
  }

  // ── Clamp and classify ───────────────────────────────────────────────────
  score = Math.max(0, Math.min(100, score))

  let risk_level: RiskAssessment['risk_level']
  let recommended_action: string

  if (score >= 70) {
    risk_level = 'critical'
    recommended_action = 'Hold order for manual review before fulfilling. Consider requesting additional verification from customer.'
  } else if (score >= 45) {
    risk_level = 'high'
    recommended_action = 'Fulfil with caution. Require signature on delivery. Keep all order documentation. Consider calling customer to confirm.'
  } else if (score >= 25) {
    risk_level = 'medium'
    recommended_action = 'Fulfil normally but ensure full tracking and delivery confirmation. Document all customer communications.'
  } else {
    risk_level = 'low'
    recommended_action = 'Low risk. Fulfil normally.'
  }

  return { risk_score: score, risk_level, recommended_action, risk_factors: riskFactors, protective_factors: protectiveFactors }
}

// AI-enhanced assessment for high-risk orders — deeper analysis
export async function enhanceRiskAssessment(
  signals: OrderRiskSignals,
  baseAssessment: RiskAssessment
): Promise<string> {
  if (baseAssessment.risk_level === 'low' || baseAssessment.risk_level === 'medium') {
    return baseAssessment.recommended_action
  }

  const response = await anthropic.messages.create({
    model:      'claude-sonnet-4-6',
    max_tokens: 300,
    system:     'You are a fraud analyst. Given order risk signals, provide a concise 2-3 sentence recommendation for the merchant. Be specific and actionable. No preamble.',
    messages: [{
      role: 'user',
      content: `Order risk assessment needed:
Risk score: ${baseAssessment.risk_score}/100 (${baseAssessment.risk_level})
Order value: ${signals.currency} ${signals.order_value}
Risk factors: ${baseAssessment.risk_factors.map(f => f.factor).join(', ')}
Protective factors: ${baseAssessment.protective_factors.join(', ') || 'none'}
First order: ${signals.is_first_order}
Prior orders: ${signals.prior_orders_count}

What should this merchant do before fulfilling this order?`,
    }],
  })

  return response.content[0].type === 'text'
    ? response.content[0].text
    : baseAssessment.recommended_action
}
