import { ReasonCodeConfig } from '@/types'

export const REASON_CODES: ReasonCodeConfig[] = [
  // ── VISA ──────────────────────────────────────────────────────────────────
  {
    code: '10.4', network: 'visa',
    title: 'Other Fraud – Card Absent Environment',
    description: 'Cardholder claims they did not authorise the transaction.',
    required_evidence: ['avs_result','cvv_result','ip_address','device_id','order_data','customer_email_match'],
    optional_evidence: ['prior_purchase_history','delivery_confirmation','customer_comms','3ds_authentication'],
    typical_win_rate: 0.52, time_limit_days: 30,
    strategy: 'Demonstrate the transaction was authorised. AVS/CVV match, device fingerprint, IP geolocation matching billing address, and prior purchase history from the same card are your strongest weapons. If 3DS authenticated, you win automatically — include that proof first.',
  },
  {
    code: '10.5', network: 'visa',
    title: 'Visa Fraud Monitoring Program',
    description: 'Transaction flagged under Visa\'s fraud monitoring program.',
    required_evidence: ['avs_result','cvv_result','order_data','3ds_authentication'],
    optional_evidence: ['ip_address','device_id','prior_purchase_history','customer_comms'],
    typical_win_rate: 0.38, time_limit_days: 30,
    strategy: '3DS authentication is an automatic win here. Without it, layer every authorisation signal available — AVS, CVV, IP, device. These are harder disputes to win without 3DS; focus your response on the strength of what you do have.',
  },
  {
    code: '11.1', network: 'visa',
    title: 'Card Recovery Bulletin',
    description: 'Card was listed as lost or stolen at the time of transaction.',
    required_evidence: ['avs_result','cvv_result','3ds_authentication','order_data'],
    optional_evidence: ['ip_address','device_id','signature_confirmation'],
    typical_win_rate: 0.35, time_limit_days: 30,
    strategy: '3DS authentication is decisive — if you have it, the dispute should be reversed. Without 3DS, this is a difficult dispute. Lead with every authorisation signal you have and note any in-person signature if the card was used in a physical context.',
  },
  {
    code: '12.5', network: 'visa',
    title: 'Incorrect Transaction Amount',
    description: 'Cardholder claims the transaction amount differs from what was agreed.',
    required_evidence: ['order_data','transaction_records','pricing_confirmation'],
    optional_evidence: ['customer_comms','terms_acceptance','cart_screenshot'],
    typical_win_rate: 0.78, time_limit_days: 30,
    strategy: 'Show your order records and pricing confirmation proving the charged amount matches exactly what the customer agreed to. This is usually a quick win with clean transaction records. Include the checkout page or receipt showing the agreed amount.',
  },
  {
    code: '13.1', network: 'visa',
    title: 'Merchandise / Services Not Received',
    description: 'Cardholder claims goods or services were not received.',
    required_evidence: ['shipping_tracking','proof_of_delivery','order_data'],
    optional_evidence: ['signature_confirmation','customer_comms','delivery_photo','carrier_statement'],
    typical_win_rate: 0.68, time_limit_days: 30,
    strategy: 'Proof of delivery is decisive. Include carrier tracking showing delivered status, timestamp, and address match. Signature confirmation if available. If the customer communicated after expected delivery without complaint, include those messages — they imply receipt.',
  },
  {
    code: '13.2', network: 'visa',
    title: 'Cancelled Recurring Transaction',
    description: 'Cardholder claims a recurring charge was not cancelled when requested.',
    required_evidence: ['subscription_terms','cancellation_policy','order_data','no_cancellation_request_proof'],
    optional_evidence: ['customer_comms','login_activity','terms_acceptance'],
    typical_win_rate: 0.44, time_limit_days: 30,
    strategy: 'Show the cancellation policy was clearly disclosed at signup and that no cancellation request was received. Login activity logs after the dispute date are powerful — if they were using the service, they had not cancelled.',
  },
  {
    code: '13.3', network: 'visa',
    title: 'Not as Described or Defective Merchandise',
    description: 'Cardholder claims item was materially different from description or defective.',
    required_evidence: ['product_listing','product_photos','order_data','return_policy'],
    optional_evidence: ['customer_comms','return_not_requested','expert_opinion','comparison_evidence'],
    typical_win_rate: 0.55, time_limit_days: 30,
    strategy: 'Show the product matched its description exactly. Screenshot the listing as it appeared at time of purchase. If the customer never contacted you about the issue before disputing, that gap is significant — include your communication log showing no complaint.',
  },
  {
    code: '13.6', network: 'visa',
    title: 'Credit Not Processed',
    description: 'Cardholder claims a credit or refund was not processed.',
    required_evidence: ['refund_policy','refund_not_owed_proof','order_data'],
    optional_evidence: ['customer_comms','return_not_received','terms_acceptance'],
    typical_win_rate: 0.71, time_limit_days: 30,
    strategy: 'If refund was processed, show the transaction record with date — dispute is invalid. If refund was not owed (outside policy window, used service, etc.), show the refund policy accepted at checkout and explain clearly why the refund was not issued.',
  },
  {
    code: '13.7', network: 'visa',
    title: 'Cancelled Merchandise / Services',
    description: 'Cardholder claims goods or services were cancelled.',
    required_evidence: ['cancellation_policy','service_delivered_proof','order_data'],
    optional_evidence: ['customer_comms','no_cancellation_request','login_activity'],
    typical_win_rate: 0.58, time_limit_days: 30,
    strategy: 'Prove the service or goods were delivered before any cancellation request. If digital services, show access logs. Include cancellation policy shown at checkout.',
  },

  // ── MASTERCARD ────────────────────────────────────────────────────────────
  {
    code: '4808', network: 'mastercard',
    title: 'Required Authorization Not Obtained',
    description: 'Transaction was processed without proper authorisation.',
    required_evidence: ['transaction_records','authorization_code','order_data'],
    optional_evidence: ['customer_comms','avs_result','cvv_result'],
    typical_win_rate: 0.61, time_limit_days: 45,
    strategy: 'Show the authorisation code on the transaction record. If you have a valid auth code, this dispute is straightforward to win. Include the full transaction record showing the authorization was properly obtained.',
  },
  {
    code: '4834', network: 'mastercard',
    title: 'Duplicate Processing',
    description: 'Cardholder claims the transaction was processed more than once.',
    required_evidence: ['transaction_records','order_data','single_charge_proof'],
    optional_evidence: ['customer_comms'],
    typical_win_rate: 0.82, time_limit_days: 45,
    strategy: 'If the charge was legitimately single, show your transaction records proving one charge only. This is usually a quick win — the evidence is clear-cut.',
  },
  {
    code: '4837', network: 'mastercard',
    title: 'No Cardholder Authorisation',
    description: 'Cardholder denies participating in the transaction.',
    required_evidence: ['avs_result','cvv_result','ip_address','order_data'],
    optional_evidence: ['3ds_authentication','device_fingerprint','prior_purchase_history','customer_comms'],
    typical_win_rate: 0.48, time_limit_days: 45,
    strategy: 'Authorisation evidence is everything. 3DS authentication is an automatic win if available. Otherwise layer AVS match + CVV match + IP geo + device fingerprint + prior purchase history from same card. The more signals, the stronger the case.',
  },
  {
    code: '4841', network: 'mastercard',
    title: 'Cancelled Recurring or Digital Goods',
    description: 'Recurring transaction after cancellation was requested.',
    required_evidence: ['subscription_terms','no_cancellation_request_proof','order_data'],
    optional_evidence: ['customer_comms','login_activity','cancellation_policy'],
    typical_win_rate: 0.41, time_limit_days: 45,
    strategy: 'Show cancellation policy was disclosed and no valid cancellation request was received. Active usage logs after the alleged cancellation date are extremely helpful.',
  },
  {
    code: '4850', network: 'mastercard',
    title: 'Installment Billing Dispute',
    description: 'Dispute over installment billing amount or schedule.',
    required_evidence: ['installment_agreement','order_data','billing_schedule'],
    optional_evidence: ['customer_comms','terms_acceptance','payment_history'],
    typical_win_rate: 0.64, time_limit_days: 45,
    strategy: 'Show the signed installment agreement and billing schedule the customer agreed to. Include the full payment history showing all prior installments were charged correctly. If the customer made prior installment payments without complaint, that confirms acceptance of the terms.',
  },
  {
    code: '4853', network: 'mastercard',
    title: 'Cardholder Dispute – Not as Described',
    description: 'Goods or services were not as described or are defective.',
    required_evidence: ['product_listing','product_photos','order_data','return_policy'],
    optional_evidence: ['customer_comms','return_not_requested','delivery_confirmation'],
    typical_win_rate: 0.59, time_limit_days: 45,
    strategy: 'Document exactly what was described vs what was delivered and show they match. Screenshot your listing. Include the return policy. If customer never attempted to return or contact you, that is powerful evidence they had no genuine grievance.',
  },
  {
    code: '4855', network: 'mastercard',
    title: 'Goods or Services Not Provided',
    description: 'Merchandise or services ordered were not received.',
    required_evidence: ['shipping_tracking','proof_of_delivery','order_data'],
    optional_evidence: ['signature_confirmation','customer_comms','digital_delivery_log'],
    typical_win_rate: 0.65, time_limit_days: 45,
    strategy: 'Same as Visa 13.1 — delivery proof is decisive. For digital goods, include server logs showing the download or access event with IP and timestamp.',
  },

  // ── AMEX ──────────────────────────────────────────────────────────────────
  {
    code: 'C02', network: 'amex',
    title: 'Credit Not Received',
    description: 'Cardmember states credit was not received.',
    required_evidence: ['refund_policy','refund_not_owed_proof','order_data'],
    optional_evidence: ['customer_comms','return_not_received'],
    typical_win_rate: 0.66, time_limit_days: 20,
    strategy: 'Amex favours cardmembers — respond fast, before the 20-day window. If credit was processed, show the transaction record. If not owed, show the policy and explain clearly. Amex responds well to clear, concise, factual responses.',
  },
  {
    code: 'C08', network: 'amex',
    title: 'Goods / Services Not Received',
    description: 'Cardmember did not receive the goods or services.',
    required_evidence: ['proof_of_delivery','shipping_tracking','order_data'],
    optional_evidence: ['signature_confirmation','customer_comms','digital_delivery_log'],
    typical_win_rate: 0.61, time_limit_days: 20,
    strategy: 'Amex has a shorter window — act immediately. Proof of delivery with carrier confirmation is decisive. For digital goods, server-side access logs with timestamp and IP.',
  },
  {
    code: 'C14', network: 'amex',
    title: 'Paid by Other Means',
    description: 'Cardmember claims the transaction was paid through another method.',
    required_evidence: ['single_payment_proof','order_data','transaction_records'],
    optional_evidence: ['customer_comms'],
    typical_win_rate: 0.79, time_limit_days: 20,
    strategy: 'Show your records proving only one payment method was used and no double-charge occurred. Usually straightforward with clean transaction records.',
  },
  {
    code: 'C31', network: 'amex',
    title: 'Goods / Services Not as Described',
    description: 'Cardmember claims goods or services were not as described.',
    required_evidence: ['product_listing','product_photos','order_data','return_policy'],
    optional_evidence: ['customer_comms','return_not_requested','comparison_evidence'],
    typical_win_rate: 0.57, time_limit_days: 20,
    strategy: 'Amex requires speed — submit within the 20-day window. Show the product listing matched the description exactly, and include your return policy. If the cardmember never contacted you or attempted a return, include that communication record (or lack thereof) prominently.',
  },
  {
    code: 'FR2', network: 'amex',
    title: 'Fraud – Card Absent',
    description: 'Cardmember did not authorise the transaction.',
    required_evidence: ['avs_result','cvv_result','ip_address','order_data'],
    optional_evidence: ['3ds_authentication','device_fingerprint','prior_purchase_history'],
    typical_win_rate: 0.44, time_limit_days: 20,
    strategy: 'Amex fraud disputes are harder to win — they lean toward the cardmember. Prioritise 3DS authentication proof if available. Layer all authorisation signals. Amex values concise, well-organised responses over lengthy ones.',
  },
  {
    code: 'P08', network: 'amex',
    title: 'Duplicate Charges',
    description: 'Cardmember claims the transaction was charged more than once.',
    required_evidence: ['transaction_records','single_charge_proof','order_data'],
    optional_evidence: ['customer_comms'],
    typical_win_rate: 0.84, time_limit_days: 20,
    strategy: 'Show your transaction records proving a single charge only. Amex is strict about duplicate processing — if your records are clean, this is a strong win. Submit quickly given the 20-day Amex window.',
  },
]

export function getReasonCode(code: string, network: string): ReasonCodeConfig | null {
  return REASON_CODES.find(
    rc => rc.code === code && rc.network === network.toLowerCase()
  ) || null
}

export function getWinProbability(
  code: string,
  network: string,
  availableEvidence: string[]
): number {
  const rc = getReasonCode(code, network)
  if (!rc) return 0.3

  const requiredMet   = rc.required_evidence.filter(e => availableEvidence.includes(e)).length
  const requiredTotal = rc.required_evidence.length
  const optionalMet   = rc.optional_evidence.filter(e => availableEvidence.includes(e)).length

  const baseRate     = rc.typical_win_rate
  const requiredRatio = requiredTotal > 0 ? requiredMet / requiredTotal : 1
  const optionalBonus = Math.min(optionalMet * 0.04, 0.15)

  return Math.min(baseRate * requiredRatio + optionalBonus, 0.92)
}
