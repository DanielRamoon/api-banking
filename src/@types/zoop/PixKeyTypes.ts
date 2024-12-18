export type PixKeyTypes = {
  data: {
    items: [pixType]
  }
}

export type PixKeyType = {
  data: pixType
}

type pixType = {
  status: string
  created_at: string
  updated_at: string
  key: {
    value: string
    type: string
  }
  account: {
    id: string
    marketplace_id: string
    holder_id: string
    owner: {
      name: string
      national_registration: string
      type: string
    }
    routing_number: string
    number: string
    type: string
  }
  psp: {
    code: string
    name: string
  }
}
