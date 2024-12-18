export type LoginTypes = {
  data: {
    'X-Auth-Token': string
    'X-Auth-Token-Reading': string
    'Token-Expiration': string
  }
}

export type CompanyDataTypes = {
  CompanyName: string
  CompanyToken: string
  CompanyStatus: string
  'Token-Expiration': string
}
