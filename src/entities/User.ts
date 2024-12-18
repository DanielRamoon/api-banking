import ApplicationHelper from '../helpers/ApplicationHelper'
import ApplicationUser from './ApplicationUser'
import Company, { CompanyProps } from './Company'
import Holder, { HolderProps } from './Holder'
import Wallet, { WalletProps } from './Wallet'

export type UserProps = {
  id?: string
  resource?: string
  companyId: string
  holderId?: string
  name: string
  email: string
  taxpayerId: string
  cnpj?: string
  phonePrefix: string
  phone: string
  holder?: Holder
  company?: Company
  wallets?: Wallet[]
  encryptedPassword?: string
  isBlocked?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export default class User implements ApplicationUser {
  props: UserProps

  constructor(dto: UserProps) {
    this.props = dto
  }

  get serializable_hash(): User {
    return {
      id: this.id,
      resource: this.resource,
      email: this.email,
      name: this.name,
      taxpayerId: this.taxpayerId,
      cnpj: this.cnpj,
      phone: this.phoneFormatted,
      isBlocked: !!this.isBlocked,
      companyId: this.companyId,
      holder: this.holder,
      company: this.company,
      wallets: this.wallets,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    } as User
  }

  get id(): string {
    return this.props.id ?? ''
  }

  get resource(): string {
    return this.props.resource ?? 'user'
  }

  get email(): string {
    return this.props.email
  }

  get name(): string {
    return this.props.name
  }

  get taxpayerId(): string {
    return ApplicationHelper.taxpayerIdFormatted(this.props.taxpayerId)
  }

  get cnpj(): string {
    return ApplicationHelper.CNPJFormatted(this.props.cnpj ?? '')
  }

  get phonePrefix(): string {
    return this.props.phonePrefix
  }

  get phone(): string {
    return this.props.phone
  }

  get holder(): Holder | null {
    if (this.props.holder)
      return new Holder(this.props.holder as HolderProps).serializable_hash

    return null
  }

  get company(): Company | null {
    if (this.props.company)
      return new Company(this.props.company as CompanyProps).serializable_hash

    return null
  }

  get companyId(): string {
    return this.props.companyId ?? ''
  }

  get holderId(): string {
    return this.props.holderId ?? ''
  }

  get phoneFormatted(): string {
    return ApplicationHelper.phoneFormatted(
      `${this.props.phonePrefix} ${this.props.phone}`
    )
  }

  get wallets(): Wallet[] | undefined {
    return this.props.wallets?.map(
      wallet => new Wallet(wallet as WalletProps).serializable_hash
    )
  }

  get isBlocked(): boolean {
    return !!this.props.isBlocked
  }

  get createdAt(): Date {
    return this.props.createdAt ?? new Date()
  }

  get updatedAt(): Date {
    return this.props.updatedAt ?? new Date()
  }
}
