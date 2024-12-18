export type CompanyOperationProps = {
  id?: string
  resource: string
  zoopOperationId: string
  type: string
  amount: number
  currency: string
  companyId: string
  createdAt: Date
  updatedAt: Date
}

export default class CompanyOperation {
  private props: CompanyOperationProps

  constructor(dto: CompanyOperationProps) {
    this.props = dto
  }

  get id(): string {
    return this.props.id ?? ''
  }

  get resource(): string {
    return this.props.resource
  }

  get zoopOperationId(): string {
    return this.props.zoopOperationId
  }

  get type(): string {
    return this.props.type
  }

  get amount(): number {
    return this.props.amount
  }

  get currency(): string {
    return this.props.currency
  }

  get companyId(): string {
    return this.props.companyId
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }
}
