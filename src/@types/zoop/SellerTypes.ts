export type SellerTypes = {
  data: {
    id: string
    status: string
    resource: string
    type: string
    account_balance: string
    current_balance: string
    first_name: string
    last_name: string
    email: string
    phone_number: string
    taxpayer_id: string
    birthdate: string
    fiscal_responsibility: string
    owner: {
      first_name: string
      last_name: string
      email: string
      phone_number: string
      taxpayer_id: string
      birthdate: string
    }
    description: string
    business_name: string
    business_phone: string
    business_email: string
    business_website: string
    business_description: string
    business_facebook: string
    business_twitter: string
    ein: string
    statement_descriptor: string
    business_address: {
      line1: string
      line2: string
      line3: string
      neighborhood: string
      city: string
      state: string
      postal_code: string
      country_code: string
    }
    business_opening_date: string
    owner_address: {
      line1: string
      line2: string
      line3: string
      neighborhood: string
      city: string
      state: string
      postal_code: string
      country_code: string
    }
    address: {
      line1: string
      line2: string
      line3: string
      neighborhood: string
      city: string
      state: string
      postal_code: string
      country_code: string
    }
    delinquent: string
    default_debit: string
    default_credit: string
    mcc: string
    metadata: {
      additionalProp: string
    }
    created_at: string
    updated_at: string
  }
}
