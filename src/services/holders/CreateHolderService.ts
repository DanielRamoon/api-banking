import { t } from '../../config/i18next/I18nextLocalization'
import Holder, {
  AccountType,
  EstablishmentFormat,
  HolderProps
} from '../../entities/Holder'
import { ApplicationError } from '../../helpers/ApplicationError'
import { IHolderRepository } from '../../repositories/IHolderRepository'
import { ApplicationService } from '../ApplicationService'

type CreateHolderParams = {
  taxpayerId: string
  name: string
  accountType: AccountType
  email: string
  cnpj: string
  revenueCents: number
  cbo: string
  rg: string
  pep: boolean
  mothersName: string
  birthday: Date
  cnae: number
  legalName: string
  establishmentFormat: EstablishmentFormat
  establishmentDate: Date
  phoneAreaCode: string
  phonePrefix: string
  phoneNumber: string
  addressStreet: string
  addressNumber: string
  addressCity: string
  addressComplement: string
  addressState: string
  addressNeighborhood: string
  addressPostalCode: string
  addressCountry: string
}

export class CreateHolderService implements ApplicationService {
  private holderRepository: IHolderRepository

  constructor(holderRepository: IHolderRepository) {
    this.holderRepository = holderRepository
  }

  async run({
    taxpayerId,
    name,
    accountType,
    email,
    cnpj,
    revenueCents,
    cbo,
    rg,
    pep,
    mothersName,
    birthday,
    cnae,
    legalName,
    establishmentFormat,
    establishmentDate,
    phoneAreaCode,
    phonePrefix,
    phoneNumber,
    addressStreet,
    addressNumber,
    addressCity,
    addressComplement,
    addressState,
    addressNeighborhood,
    addressPostalCode,
    addressCountry
  }: CreateHolderParams): Promise<Holder | ApplicationError> {
    try {
      const holder = await this.holderRepository.create({
        taxpayerId,
        name,
        accountType,
        email,
        cnpj,
        revenueCents,
        cbo,
        rg,
        pep,
        mothersName,
        birthday,
        cnae,
        legalName,
        establishmentFormat,
        establishmentDate,
        phoneAreaCode,
        phonePrefix,
        phoneNumber,
        addressStreet,
        addressNumber,
        addressCity,
        addressComplement,
        addressState,
        addressNeighborhood,
        addressPostalCode,
        addressCountry
      })

      if (holder instanceof ApplicationError) return holder

      return new Holder(holder as HolderProps).serializable_hash
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
