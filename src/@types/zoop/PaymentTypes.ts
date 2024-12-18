export type PaymentTypes = {
  data: {
    id: string
    account_id: string
    marketplace_id: string
    amount: number
    discount: number
    interest: number
    fine: number
    bar_code: string
    status: string
    payment_id: string
    resource: string
    recipient_document: string
    referenc_id: object
    operation: {
      id: string
      amount: string
      gross_amount: string
      nsu: 11
      date: string
      fee: string
      current_balance: string
      object_type: string
      object_id: string
      type: string
      created_at: string
      updated_at: string
      dflag: string
      authorization: {
        external_key: string
        type: string
        status: string
      }
      resource: string
    }
    external_transfer_id: string
    formated_amount: string
    description: string
    reference_id: string
    recipient:
      | {
          bank_code: string
          routing_number: string
          routing_check_digit: string
          account_number: string
          account_check_digit: string
          document: number
          name: string
        }
      | number
  }
}
