/* eslint-disable no-unused-vars */
import ApplicationUser from './ApplicationUser'
import Company from './Company'

export type CompanyUserProps = {
  id?: string
  resource?: string
  name: string
  email: string
  encryptedPassword?: string
  isBlocked?: boolean
  role: Role
  company?: Company
  companyId?: string
  createdAt?: Date
  updatedAt?: Date
}

export enum Role {
  owner = 'owner',
  manager = 'manager',
  admin = 'admin'
}

export default class CompanyUser implements ApplicationUser {
  private props: CompanyUserProps

  constructor(dto: CompanyUserProps) {
    this.props = dto
  }

  get serializable_hash(): CompanyUser {
    return {
      id: this.id,
      resource: this.resource,
      email: this.email,
      name: this.name,
      role: this.role,
      company: this.company,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    } as CompanyUser
  }

  get id(): string {
    return this.props.id ?? ''
  }

  get isOwner(): boolean {
    return this.props.role === 'owner'
  }

  get isManager(): boolean {
    return this.props.role === 'manager'
  }

  get isAdmin(): boolean {
    return this.props.role === 'admin'
  }

  get resource(): string {
    return this.props.resource ?? 'company_user'
  }

  get name(): string {
    return this.props.name
  }

  get email(): string {
    return this.props.email
  }

  get encryptedPassword(): string {
    return this.props.encryptedPassword ?? ''
  }

  get role(): string {
    return this.props.role
  }

  get companyId(): string {
    return this.props.companyId ?? ''
  }

  get company(): Company | undefined {
    return this.props.company
  }

  get createdAt(): Date {
    return this.props.createdAt ?? new Date()
  }

  get updatedAt(): Date {
    return this.props.updatedAt ?? new Date()
  }
}
