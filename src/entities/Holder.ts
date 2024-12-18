import ApplicationHelper from '../helpers/ApplicationHelper'
import HolderDocument, { HolderDocumentProps } from './HolderDocument'
import Operation, { OperationProps } from './Operation'

/* eslint-disable no-unused-vars */
export type HolderProps = {
  id?: string
  resource?: string
  zoopHolderId?: string
  zoopAccountId?: string
  zoopSellerId?: string
  zoopHolderStatus?: string
  taxpayerId: string
  name: string
  accountType: AccountType
  email: string
  cnpj?: string
  revenueCents?: number
  cbo?: string
  rg?: string
  pep?: boolean
  mothersName?: string
  birthday?: string
  cnae?: string
  legalName?: string
  establishmentFormat?: EstablishmentFormat
  establishmentDate?: string
  phoneAreaCode?: string
  phonePrefix?: string
  phoneNumber?: string
  addressStreet?: string
  addressNumber?: string
  addressCity?: string
  addressComplement?: string
  addressState?: string
  addressNeighborhood?: string
  addressPostalCode?: string
  addressCountry?: string
  holderDocuments?: HolderDocument[]
  operations?: Operation[]
  createdAt?: Date
  updatedAt?: Date
}

export enum EstablishmentFormat {
  SS = 'SS',
  COOP = 'COOP',
  SPE = 'SPE',
  LTDA = 'LTDA',
  SA = 'SA',
  ME = 'ME',
  MEI = 'MEI',
  EI = 'EI',
  EIRELI = 'EIRELI',
  SNC = 'SNC',
  SCS = 'SCS',
  SCA = 'SCA'
}

export enum AccountType {
  business = 'business',
  individual = 'individual'
}

export default class Holder {
  private props: HolderProps

  constructor(dto: HolderProps) {
    this.props = dto
  }

  get serializable_hash(): Holder {
    return {
      id: this.id,
      resource: this.resource,
      zoopHolderId: this.zoopHolderId,
      zoopAccountId: this.zoopAccountId,
      zoopHolderStatus: this.zoopHolderStatus,
      zoopSellerId: this.zoopSellerId,
      taxpayerId: this.taxpayerId,
      name: this.name,
      accountType: this.accountType,
      email: this.email,
      cnpj: this.cnpj,
      revenueCents: this.revenueCents,
      cbo: this.cbo,
      rg: this.rg,
      pep: this.pep,
      mothersName: this.mothersName,
      birthday: this.birthday,
      cnae: this.cnae,
      legalName: this.legalName,
      establishmentFormat: this.establishmentFormat,
      establishmentDate: this.establishmentDate,
      phoneAreaCode: this.phoneAreaCode,
      phonePrefix: this.phonePrefix,
      phoneNumber: this.phoneNumber,
      addressStreet: this.addressStreet,
      addressNumber: this.addressNumber,
      addressCity: this.addressCity,
      addressComplement: this.addressComplement,
      addressState: this.addressState,
      addressNeighborhood: this.addressNeighborhood,
      addressPostalCode: this.addressPostalCode,
      addressCountry: this.addressCountry,
      holderDocuments: this.holderDocuments,
      operations: this.operations,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    } as Holder
  }

  get isBusiness(): boolean {
    return this.props.accountType === 'business'
  }

  get isIndividual(): boolean {
    return this.props.accountType === 'individual'
  }

  get id(): string {
    return this.props.id ?? ''
  }

  get resource(): string {
    return this.props.resource ?? 'holder'
  }

  get zoopHolderId(): string {
    return this.props.zoopHolderId ?? ''
  }

  get zoopAccountId(): string {
    return this.props.zoopAccountId ?? ''
  }

  get zoopSellerId(): string {
    return this.props.zoopSellerId ?? ''
  }

  get zoopHolderStatus(): string {
    return this.props.zoopHolderStatus ?? ''
  }

  get taxpayerId(): string {
    return ApplicationHelper.taxpayerIdFormatted(this.props.taxpayerId)
  }

  get name(): string {
    return this.props.name
  }

  get accountType(): AccountType {
    return this.props.accountType
  }

  get email(): string {
    return this.props.email
  }

  get cnpj(): string {
    return ApplicationHelper.CNPJFormatted(this.props.cnpj ?? '')
  }

  get revenueCents(): number | null {
    return this.props.revenueCents ?? null
  }

  get cbo(): string {
    return this.props.cbo ?? ''
  }

  get rg(): string {
    return this.props.rg ?? ''
  }

  get pep(): boolean | null {
    return this.props.pep ?? null
  }

  get mothersName(): string {
    return this.props.mothersName ?? ''
  }

  get birthday(): string {
    return this.props.birthday ?? ''
  }

  get cnae(): string {
    return this.props.cnae ?? ''
  }

  get legalName(): string {
    return this.props.legalName ?? ''
  }

  get establishmentFormat(): EstablishmentFormat | null {
    return this.props.establishmentFormat ?? null
  }

  get establishmentDate(): string {
    return this.props.establishmentDate ?? ''
  }

  get phoneAreaCode(): string {
    return this.props.phoneAreaCode ?? ''
  }

  get phonePrefix(): string {
    return this.props.phonePrefix ?? ''
  }

  get phoneNumber(): string {
    return this.props.phoneNumber ?? ''
  }

  get phone(): string {
    const { phoneAreaCode, phonePrefix, phoneNumber } = this.props
    return `+${phoneAreaCode} (${phonePrefix}) ${phoneNumber}`
  }

  get addressStreet(): string {
    return this.props.addressStreet ?? ''
  }

  get addressNumber(): string {
    return this.props.addressNumber ?? ''
  }

  get addressCity(): string {
    return this.props.addressCity ?? ''
  }

  get addressComplement(): string {
    return this.props.addressComplement ?? ''
  }

  get addressState(): string {
    return this.props.addressState ?? ''
  }

  get addressNeighborhood(): string {
    return this.props.addressNeighborhood ?? ''
  }

  get addressPostalCode(): string {
    return this.props.addressPostalCode ?? ''
  }

  get addressCountry(): string {
    return this.props.addressCountry ?? ''
  }

  get holderDocuments(): HolderDocument[] | undefined {
    return this.props.holderDocuments?.map(
      document =>
        new HolderDocument(document as HolderDocumentProps).serializable_hash
    )
  }

  get operations(): Operation[] | undefined {
    return this.props.operations?.map(
      operation => new Operation(operation as OperationProps).serializable_hash
    )
  }

  get createdAt(): Date | null {
    return this.props.createdAt ?? null
  }

  get updatedAt(): Date | null {
    return this.props.updatedAt ?? null
  }
}
