import Wallet, { WalletProps } from './Wallet'

export type OperationProps = {
  id?: string
  resource: string
  zoopOperationId: string
  type: string
  amountCents: number
  currency: string
  status: string
  barCode?: string
  discount?: number
  interest?: number
  fine?: number
  fee?: string
  description?: string
  referenceId: string
  holderId: string
  walletId: string
  userId: string
  wallet?: Wallet
  createdAt?: Date
  updatedAt?: Date
}

export default class Operation {
  private props: OperationProps

  constructor(dto: OperationProps) {
    this.props = dto
  }

  get serializable_hash(): Operation {
    return {
      id: this.id,
      resource: this.resource,
      zoopOperationId: this.zoopOperationId,
      amountCents: this.amountCents,
      status: this.status,
      barCode: this.barCode,
      discount: this.discount,
      interest: this.interest,
      fine: this.fine,
      fee: this.fee,
      description: this.description,
      referenceId: this.referenceId,
      holderId: this.holderId,
      walletId: this.walletId,
      userId: this.userId,
      type: this.type,
      currency: this.currency,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      wallet: this.wallet
    } as Operation
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

  get amountCents(): number {
    return this.props.amountCents
  }

  get discount(): number {
    return this.props.discount ?? 0
  }

  get interest(): number {
    return this.props.interest ?? 0
  }

  get fine(): number {
    return this.props.fine ?? 0
  }

  get fee(): string {
    return this.props.fee ?? ''
  }

  get description(): string {
    return this.props.description ?? ''
  }

  get referenceId(): string {
    return this.props.referenceId ?? ''
  }

  get currency(): string {
    return this.props.currency
  }

  get status(): string {
    return this.props.status
  }

  get barCode(): string {
    return this.props.barCode ?? ''
  }

  get holderId(): string {
    return this.props.holderId
  }

  get walletId(): string {
    return this.props.walletId
  }

  get userId(): string {
    return this.props.userId
  }

  get wallet(): Wallet | null {
    if (this.props.wallet)
      return new Wallet(this.props.wallet as WalletProps).serializable_hash

    return null
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt ?? undefined
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt ?? undefined
  }
}
