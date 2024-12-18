export type P2PTransferTypes = {
  data: {
    id: string
    resource: string
    type: string
    status: string
    confirmed: string
    recipient: string
    sender: string
    amount: number
    fee: number
    net_amount: number
    currency: string
    description: string
    statement_descriptor: null
    bank_account: null
    transfer_date: string
    created_at: string
    updated_at: string
    metadata: unknown
    from: {
      id: string
      account: {
        id: string
        holder: string
        balance: string
        currency: string
        routing_number: number
        number: string
        status: string
        metadata: unknown
        object_type: string
        created_at: string
        updated_at: string
        primary: true
        resource: string
      }
      amount: string
      gross_amount: string
      nsu: number
      date: string
      fee: string
      object_type: string
      object_id: string
      type: string
      created_at: string
      dflag: string
      authorization: {
        external_key: string
        type: string
        status: string
      }
      transfer: {
        id: string
        authorization_code: string
      }
      resource: string
    }
    to: {
      id: string
      account: {
        id: string
        holder: string
      }
      amount: string
      gross_amount: string
      nsu: number
      date: string
      fee: string
      current_balance: string
      object_type: string
      object_id: string
      type: string
      created_at: string
      dflag: string
      authorization: {
        external_key: string
        type: string
        status: string
      }
      transfer: {
        id: string
        authorization_code: string
      }
      resource: string
    }
  }
}
