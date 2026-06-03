import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import { scoreOrderRisk, enhanceRiskAssessment, OrderRiskSignals } from '@/lib/fraud-prevention'

export async function POST(req: NextRequest) {
  // Verify this is coming from our Shopify webhook or internal call
  const secret = req.headers.get('x-internal-secret')
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body: OrderRiskSignals = await req.json()
  const admin = createSupabaseAdmin()

  // Run rule-based scoring (fast, no API call)
  const assessment = scoreOrderRisk(body)

  // For high-risk orders, enhance with Claude
  let finalRecommendation = assessment.recommended_action
  if (assessment.risk_level === 'high' || assessment.risk_level === 'critical') {
    finalRecommendation = await enhanceRiskAssessment(body, assessment)
  }

  // Save risk assessment to DB
  await admin.from('order_risk_assessments').insert({
    order_id:             body.order_id,
    risk_score:           assessment.risk_score,
    risk_level:           assessment.risk_level,
    risk_factors:         assessment.risk_factors,
    protective_factors:   assessment.protective_factors,
    recommended_action:   finalRecommendation,
  try {
    await admin.from('order_risk_assessments').insert({
      order_id:             body.order_id,
      risk_score:           assessment.risk_score,
      risk_level:           assessment.risk_level,
      risk_factors:         assessment.risk_factors,
      protective_factors:   assessment.protective_factors,
      recommended_action:   finalRecommendation,
    })
  } catch (_) {}

  return NextResponse.json({
    ...assessment,
    recommended_action: finalRecommendation,
  })
}
