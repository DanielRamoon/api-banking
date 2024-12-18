export type HolderTypes = {
  data: HolderWebhookTypes
}

export type HolderWebhookTypes = {
  type: string
  id: string
  name: string
  revenue: number
  email: string
  status: string
  onboarding_type: string
  marketplace_id: string
  marketplace_name: string
  created_at: string
  updated_at: string
  national_registration: string
  birthday: string
  mothers_name: string
  pep: boolean
  cbo: string
}
