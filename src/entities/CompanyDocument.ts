export type CompanyDocumentProps = {
  id?: string
  resource: string
  type: string
  file: string
  companyId: string
  createdAt: Date
  updatedAt: Date
}

export default class CompanyDocument {
  private props: CompanyDocumentProps

  constructor(dto: CompanyDocumentProps) {
    this.props = dto
  }

  get id(): string {
    return this.props.id ?? ''
  }

  get resource(): string {
    return this.props.resource
  }

  get type(): string {
    return this.props.type
  }

  get file(): string {
    return this.props.file
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
