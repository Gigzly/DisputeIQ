import Anthropic from '@anthropic-ai/sdk'
import { DisputeEvidence, GeneratedResponse, ReasonCodeConfig } from '@/types'
import { getReasonCode, getWinProbability } from './reason-codes'
import { getAvailableEvidenceKeys } from './shopify'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are an expert chargeback analyst with 15 years of experience 
helping merchants win dispute cases. You understand every card network's evidence 
requirements, reason codes, and what adjudicators actually look for.

Your job is to analyse dispute evidence and generate:
1. A professional dispute response letter
2. An evidence strength assessment
3. Key arguments ranked by persuasiveness
4. A recommended action

Rules:
- Be factual and specific — reference actual data points from the evidence
- Use the card network's preferred language and structure
- Never overstate evidence — adjudicators penalise merchants who exaggerate
- Flag missing evidence that would strengthen the case
- Be concise — adjudicators read hundreds of responses, brevity wins
- Always output valid JSON only — no markdown, no preamble`

export async function generateDisputeResponse(
  evidence: DisputeEvidence,
  reasonCode: string,
  network: string,
  disputeAmount: number,
  currency: string
): Promise<GeneratedResponse> {

  const rc = getReasonCode(reasonCode, network)
  const availableKeys = getAvailableEvidenceKeys(evidence)
  const winProb = getWinProbability(reasonCode, network, availableKeys)

  const evidenceSummary = buildEvidenceSummary(evidence)
  const missingEvidence = rc
    ? rc.required_evidence.filter(e => !availableKeys.includes(e))
    : []

  const prompt = `Analyse this chargeback and generate a dispute response.

DISPUTE DETAILS:
- Amount: ${currency} ${disputeAmount.toFixed(2)}
- Network: ${network.toUpperCase()}
- Reason Code: ${reasonCode}
- Reason: ${rc?.title || 'Unknown'}
- Strategy hint: ${rc?.strategy || 'Focus on available evidence'}

AVAILABLE EVIDENCE:
${evidenceSummary}

MISSING EVIDENCE (flag these in your response):
${missingEvidence.length > 0 ? missingEvidence.join(', ') : 'None — all required evidence available'}

Generate a JSON response with this exact structure:
{
  "summary": "2-3 sentence executive summary of the dispute and our position",
  "evidence_strength": "low|medium|high|critical",
  "win_probability": ${winProb.toFixed(2)},
  "response_letter": "The full formal dispute response letter ready to submit. Professional tone, 200-350 words. Reference specific evidence data points (order numbers, dates, amounts, tracking numbers). Structure: opening statement → evidence presented → conclusion requesting chargeback reversal.",
  "evidence_checklist": [
    {"item": "evidence item name", "available": true/false, "required": true/false, "importance": "low|medium|high|critical"}
  ],
  "key_arguments": ["Most persuasive argument", "Second argument", "Third argument"],
  "recommended_action": "Clear one-sentence instruction on what the merchant should do next"
}`

  const response = await anthropic.messages.create({
    model:      'claude-sonnet-4-6',
    max_tokens: 2000,
    system:     SYSTEM_PROMPT,
    messages:   [{ role: 'user', content: prompt }],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text : ''
  const clean = raw.replace(/```json|```/g, '').trim()

  try {
    const parsed = JSON.parse(clean)
    return {
      summary:            parsed.summary || '',
      evidence_strength:  parsed.evidence_strength || 'medium',
      win_probability:    parsed.win_probability || winProb,
      response_letter:    parsed.response_letter || '',
      evidence_checklist: parsed.evidence_checklist || [],
      key_arguments:      parsed.key_arguments || [],
      recommended_action: parsed.recommended_action || 'Review and submit the response letter.',
    }
  } catch (e) {
    throw new Error(`Failed to parse Claude response: ${e}`)
  }
}

function buildEvidenceSummary(evidence: DisputeEvidence): string {
  const lines: string[] = []
  const o = evidence.order_data

  if (o) {
    lines.push(`Order #${o.order_number} placed ${new Date(o.created_at).toDateString()}`)
    lines.push(`Amount: ${o.currency} ${o.total_price.toFixed(2)}`)
    lines.push(`Customer: ${o.customer_name} <${o.customer_email}>`)
    lines.push(`Billing address: ${o.billing_address}`)
    lines.push(`Shipping address: ${o.shipping_address}`)
    lines.push(`Fulfillment: ${o.fulfillment_status} | Payment: ${o.financial_status}`)
    if (o.line_items.length > 0) {
      lines.push(`Items: ${o.line_items.map(i => `${i.quantity}x ${i.title}`).join(', ')}`)
    }
  }

  if (evidence.shipping_data) {
    const s = evidence.shipping_data
    lines.push(`Shipping: ${s.carrier} tracking ${s.tracking_number}`)
    lines.push(`Shipped: ${new Date(s.shipped_at).toDateString()}`)
    lines.push(`Delivery status: ${s.status}`)
    if (s.delivered_at) lines.push(`Delivered: ${new Date(s.delivered_at).toDateString()}`)
    if (s.proof_of_delivery) lines.push('Proof of delivery: YES')
  } else {
    lines.push('Shipping data: NOT AVAILABLE')
  }

  if (evidence.avs_result) lines.push(`AVS result: ${evidence.avs_result}`)
  if (evidence.cvv_result) lines.push(`CVV result: ${evidence.cvv_result}`)
  if (evidence.ip_address) lines.push(`Transaction IP: ${evidence.ip_address}`)
  if (evidence.billing_address_match !== null) {
    lines.push(`Billing address match: ${evidence.billing_address_match ? 'YES' : 'NO'}`)
  }

  if (evidence.customer_comms.length > 0) {
    lines.push(`Customer communications: ${evidence.customer_comms.length} records`)
    evidence.customer_comms.slice(0, 3).forEach(c => {
      lines.push(`  [${c.date}] ${c.direction} via ${c.channel}: ${c.summary}`)
    })
  } else {
    lines.push('Customer communications: NONE ON RECORD')
  }

  return lines.join('\n')
}
