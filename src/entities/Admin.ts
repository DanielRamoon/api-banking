/* eslint-disable no-unused-vars */
import ApplicationUser from './ApplicationUser'

export type AdminProps = {
  id?: string
  resource?: string
  name: string
  email: string
  encryptedPassword?: string
  isBlocked?: boolean
  role: Role
  createdAt?: Date
  updatedAt?: Date
}

export enum Role {
  admin = 'admin',
  super_admin = 'super_admin'
}

export default class Admin implements ApplicationUser {
  private props: AdminProps

  constructor(dto: AdminProps) {
    this.props = dto
  }

  get serializable_hash(): Admin {
    return {
      id: this.id,
      resource: this.resource,
      email: this.email,
      name: this.name,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    } as Admin
  }

  get id(): string {
    return this.props.id ?? ''
  }

  get isAdmin(): boolean {
    return this.props.role === 'admin'
  }

  get isSuperAdmin(): boolean {
    return this.props.role === 'super_admin'
  }

  get resource(): string {
    return this.props.resource ?? 'admin'
  }

  get name(): string {
    return this.props.name ?? ''
  }

  get email(): string {
    return this.props.email ?? ''
  }

  get encryptedPassword(): string {
    return this.props.encryptedPassword ?? ''
  }

  get role(): string {
    return this.props.role
  }

  get createdAt(): Date {
    return this.props.createdAt ?? new Date()
  }

  get updatedAt(): Date {
    return this.props.updatedAt ?? new Date()
  }
}
