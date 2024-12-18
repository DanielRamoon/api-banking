export type OperationTypes = {
  id: string
  status: string
  holder_id: string
  amount_in_cents: number
  amount: number
  account_id: string
  creditor: {
    account: {
      digital_account_id: string
      number: string
    }
    holder_id: string
    name: string
    national_registration: string
  }
}
