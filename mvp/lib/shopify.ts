import { OrderData, ShippingData, CustomerComm, DisputeEvidence } from '@/types'

const SHOPIFY_API_VERSION = '2024-01'

export class ShopifyClient {
  private shop: string
  private token: string

  constructor(shopDomain: string, accessToken: string) {
    this.shop  = shopDomain
    this.token = accessToken
  }

  private async call(endpoint: string) {
    const url = `https://${this.shop}/admin/api/${SHOPIFY_API_VERSION}/${endpoint}`
    const res = await fetch(url, {
      headers: {
        'X-Shopify-Access-Token': this.token,
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) throw new Error(`Shopify API error: ${res.status} ${endpoint}`)
    return res.json()
  }

  async getOrder(orderId: string): Promise<OrderData> {
    const { order } = await this.call(`orders/${orderId}.json`)
    return {
      order_number:       String(order.order_number),
      created_at:         order.created_at,
      total_price:        parseFloat(order.total_price),
      currency:           order.currency,
      customer_name:      `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim(),
      customer_email:     order.email || order.customer?.email || '',
      billing_address:    formatAddress(order.billing_address),
      shipping_address:   formatAddress(order.shipping_address),
      fulfillment_status: order.fulfillment_status || 'unfulfilled',
      financial_status:   order.financial_status,
      tags:               order.tags ? order.tags.split(', ') : [],
      line_items:         (order.line_items || []).map((li: any) => ({
        title:         li.title,
        quantity:      li.quantity,
        price:         parseFloat(li.price),
        sku:           li.sku || null,
        variant_title: li.variant_title || null,
      })),
    }
  }

  async getShipping(orderId: string): Promise<ShippingData | null> {
    try {
      const { fulfillments } = await this.call(`orders/${orderId}/fulfillments.json`)
      if (!fulfillments?.length) return null
      const f = fulfillments[0]
      const tracking = f.tracking_numbers?.[0] || f.tracking_number
      return {
        carrier:           f.tracking_company || 'Unknown',
        tracking_number:   tracking || '',
        tracking_url:      f.tracking_urls?.[0] || f.tracking_url || '',
        shipped_at:        f.created_at,
        delivered_at:      null, // enriched via carrier API if needed
        status:            f.status || 'pending',
        proof_of_delivery: f.status === 'success',
        signature_required: false,
      }
    } catch {
      return null
    }
  }

  async getCustomerComms(orderId: string, email: string): Promise<CustomerComm[]> {
    const comms: CustomerComm[] = []
    try {
      // Order notes
      const { order } = await this.call(`orders/${orderId}.json?fields=note,note_attributes,created_at`)
      if (order.note) {
        comms.push({
          date:      order.created_at,
          channel:   'note',
          summary:   order.note.slice(0, 200),
          direction: 'inbound',
        })
      }
      // Order timeline / metafields as proxy for comms
      const { events } = await this.call(`events.json?subject_id=${orderId}&subject_type=Order&verb=placed`)
      if (events?.length) {
        comms.push({
          date:      events[0]?.created_at,
          channel:   'note',
          summary:   'Order placed by customer',
          direction: 'inbound',
        })
      }
    } catch {}
    return comms
  }

  async getDisputeTransactionData(orderId: string) {
    try {
      const { transactions } = await this.call(`orders/${orderId}/transactions.json`)
      const charge = transactions?.find((t: any) => t.kind === 'sale' || t.kind === 'capture')
      return {
        avs_result:  charge?.receipt?.avs_result_code || null,
        cvv_result:  charge?.receipt?.cvs_result_code || null,
        gateway:     charge?.gateway || null,
        auth_code:   charge?.authorization || null,
      }
    } catch {
      return { avs_result: null, cvv_result: null, gateway: null, auth_code: null }
    }
  }

  async buildEvidence(orderId: string): Promise<DisputeEvidence> {
    const [orderData, shipping, txData] = await Promise.all([
      this.getOrder(orderId),
      this.getShipping(orderId),
      this.getDisputeTransactionData(orderId),
    ])
    const comms = await this.getCustomerComms(orderId, orderData.customer_email)

    return {
      order_data:            orderData,
      shipping_data:         shipping,
      customer_comms:        comms,
      avs_result:            txData.avs_result,
      cvv_result:            txData.cvv_result,
      ip_address:            null, // available via Shopify fraud analysis
      device_id:             null,
      billing_address_match: txData.avs_result ? ['Y','A','Z'].includes(txData.avs_result) : null,
      refund_policy_url:     null,
      product_description:   orderData.line_items.map(li => li.title).join(', '),
    }
  }
}

function formatAddress(a: any): string {
  if (!a) return ''
  return [a.address1, a.address2, a.city, a.province, a.zip, a.country]
    .filter(Boolean).join(', ')
}

// Derive available evidence keys from DisputeEvidence object
export function getAvailableEvidenceKeys(evidence: DisputeEvidence): string[] {
  const keys: string[] = []
  if (evidence.order_data)                        keys.push('order_data')
  if (evidence.shipping_data?.proof_of_delivery)  keys.push('proof_of_delivery')
  if (evidence.shipping_data?.tracking_number)    keys.push('shipping_tracking')
  if (evidence.shipping_data?.signature_required) keys.push('signature_confirmation')
  if (evidence.customer_comms?.length > 0)        keys.push('customer_comms')
  if (evidence.avs_result)                        keys.push('avs_result')
  if (evidence.cvv_result)                        keys.push('cvv_result')
  if (evidence.ip_address)                        keys.push('ip_address')
  if (evidence.device_id)                         keys.push('device_id')
  if (evidence.billing_address_match)             keys.push('customer_email_match')
  if (evidence.product_description)               keys.push('product_listing')
  return keys
}
