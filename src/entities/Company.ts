import ApplicationHelper from '../helpers/ApplicationHelper'
import CompanyUser from './CompanyUser'

export type CompanyProps = {
  id?: string
  resource?: string
  name: string
  cnpj: string
  companyName: string
  zoopAccountId?: string
  isBlocked?: boolean
  companyUser?: CompanyUser
  createdAt?: Date
  updatedAt?: Date
}

export default class Company {
  private props: CompanyProps

  constructor(dto: CompanyProps) {
    this.props = dto
  }

  get serializable_hash(): Company {
    return {
      id: this.id,
      resource: this.resource,
      name: this.name,
      cnpj: this.cnpj,
      companyName: this.companyName,
      zoopAccountId: this.zoopAccountId,
      isBlocked: !!this.isBlocked,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    } as Company
  }

  get id(): string {
    return this.props.id ?? ''
  }

  get resource(): string {
    return this.props.resource ?? 'company'
  }

  get name(): string {
    return this.props.name
  }

  get cnpj(): string {
    return ApplicationHelper.CNPJFormatted(this.props.cnpj)
  }

  get companyName(): string {
    return this.props.companyName
  }

  get zoopAccountId(): string {
    return this.props.zoopAccountId ?? ''
  }

  get isBlocked(): boolean {
    return this.props.isBlocked ?? false
  }

  get companyUser(): CompanyUser | null {
    return this.props.companyUser ?? null
  }

  get createdAt(): Date {
    return this.props.createdAt ?? new Date()
  }

  get updatedAt(): Date {
    return this.props.updatedAt ?? new Date()
  }
}
