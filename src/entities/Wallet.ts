import User from './User'

/* eslint-disable no-unused-vars */
export type WalletProps = {
  id?: string
  resource: string
  zoopAccountId: string
  isPrimary: boolean
  transactionLevel: TransactionLevel
  userId: string
  user?: User
  createdAt: Date
  updatedAt: Date
}

export enum TransactionLevel {
  block = 'block',
  external = 'external',
  internal = 'internal',
  company = 'company'
}

export default class Wallet {
  private props: WalletProps

  constructor(dto: WalletProps) {
    this.props = dto
  }

  get serializable_hash(): Wallet {
    return {
      id: this.id,
      resource: this.resource,
      zoopAccountId: this.zoopAccountId,
      holderId: this.holderId,
      transactionLevel: this.transactionLevel,
      isPrimary: this.isPrimary,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    } as Wallet
  }

  get id(): string {
    return this.props.id ?? ''
  }

  get resource(): string {
    return this.props.resource
  }

  get zoopAccountId(): string {
    return this.props.zoopAccountId
  }

  get isPrimary(): boolean {
    return this.props.isPrimary
  }

  get transactionLevel(): TransactionLevel {
    return this.props.transactionLevel
  }

  get userId(): string {
    return this.props.userId
  }

  get holderId(): string | null {
    if (this.props.user) return this.props.user.holderId

    return null
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }
}
