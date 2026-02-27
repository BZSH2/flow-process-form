declare namespace storeAPI {
  /** 订单支付信息。 */
  interface OrderPayment {
    /** 支付唯一标识。用于其他对象关联本支付。 */
    id?: string
    /** 支付金额。待收款的正十进制数。 */
    amount?: number
    /** 三位 [ISO 货币代码](https://www.iso.org/iso-4217-currency-codes.html)，小写。 */
    currency?: 'bam' | 'bgn' | 'chf' | 'eur' | 'gbp' | 'nok' | 'sek' | 'try'
    /** 支付来源。可以是银行卡或银行账户。部分属性为保护隐私读取时隐藏。 */
    source?:
      | {
          object?: string
          name: string
          number: string
          cvc: string
          exp_month: number
          exp_year: number
          address_line1?: string
          address_line2?: string
          address_city?: string
          address_country: string
          address_post_code?: string
        }
      | {
          object?: string
          name: string
          number: string
          sort_code?: string
          account_type: 'individual' | 'company'
          bank_name: string
          country: string
        }
    /** 支付状态：pending、succeeded 或 failed 之一。 */
    status?: 'pending' | 'succeeded' | 'failed'
  }

  /** 订单资源链接。 */
  interface Links_Order {
    /** 该订单相关的 URL。 */
    order?: string
  }

  /** 宠物订单详情信息。 */
  interface Order {
    /** 订单唯一标识。 */
    id?: number
    /** 所订购的宠物编号。 */
    petId?: number
    /** 订单数量。 */
    quantity?: number
    /** 订单预计发货日期。 */
    shipDate?: string | Date
    /** 订单状态 */
    status?: 'placed' | 'approved' | 'delivered'
    /** 订单是否已完成。 */
    complete?: boolean
  }
}
