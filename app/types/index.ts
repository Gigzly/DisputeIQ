export type Plan = 'trial' | 'starter' | 'growth' | 'scale'

export type DisputeStatus = 'pending' | 'response_generated' | 'submitted' | 'won' | 'lost'

export type CardNetwork = 'visa' | 'mastercard' | 'amex' | 'discover'

export type Severity = 'low' | 'medium' | 'high' | 'critical'

export interface ShopifyStore {
  id: string
  user_id: string
  shop_domain: string
  access_token: string
  plan: Plan
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  credits_remaining: number
  created_at: string
}

export interface Dispute {
  id: string
  store_id: string
  shopify_dispute_id: string
  order_id: string
  amount: number
  currency: string
  reason: string
  reason_code: string
  network: CardNetwork
  status: DisputeStatus
  evidence: DisputeEvidence | null
  generated_response: GeneratedResponse | null
  outcome: 'won' | 'lost' | null
  due_by: string
  created_at: string
}

export interface DisputeEvidence {
  order_data: OrderData
  shipping_data: ShippingData | null
  customer_comms: CustomerComm[]
  avs_result: string | null
  cvv_result: string | null
  ip_address: string | null
  device_id: string | null
  billing_address_match: boolean | null
  refund_policy_url: string | null
  product_description: string | null
}

export interface OrderData {
  order_number: string
  created_at: string
  total_price: number
  currency: string
  customer_name: string
  customer_email: string
  billing_address: string
  shipping_address: string
  line_items: LineItem[]
  fulfillment_status: string
  financial_status: string
  tags: string[]
}

export interface LineItem {
  title: string
  quantity: number
  price: number
  sku: string | null
  variant_title: string | null
}

export interface ShippingData {
  carrier: string
  tracking_number: string
  tracking_url: string
  shipped_at: string
  delivered_at: string | null
  status: string
  proof_of_delivery: boolean
  signature_required: boolean
}

export interface CustomerComm {
  date: string
  channel: 'email' | 'chat' | 'note'
  summary: string
  direction: 'inbound' | 'outbound'
}

export interface GeneratedResponse {
  summary: string
  evidence_strength: Severity
  win_probability: number
  response_letter: string
  evidence_checklist: EvidenceItem[]
  key_arguments: string[]
  recommended_action: string
}

export interface EvidenceItem {
  item: string
  available: boolean
  required: boolean
  importance: Severity
}

export interface ReasonCodeConfig {
  code: string
  network: CardNetwork
  title: string
  description: string
  required_evidence: string[]
  optional_evidence: string[]
  typical_win_rate: number
  time_limit_days: number
  strategy: string
}
