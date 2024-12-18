import { t } from '../../config/i18next/I18nextLocalization'
import Holder, { AccountType, EstablishmentFormat } from '../../entities/Holder'
import { ApplicationError } from '../../helpers/ApplicationError'
import { IHolderRepository } from '../../repositories/IHolderRepository'
import { ApplicationService } from '../ApplicationService'

type CreateHolderParams = {
  id?: string
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

export class CreateOrUpdateHolderService implements ApplicationService {
  private holderRepository: IHolderRepository
  private updateHolderService: ApplicationService
  private createHolderService: ApplicationService

  constructor(
    holderRepository: IHolderRepository,
    updateHolderService: ApplicationService,
    createHolderService: ApplicationService
  ) {
    this.holderRepository = holderRepository
    this.updateHolderService = updateHolderService
    this.createHolderService = createHolderService
  }

  async run(params: CreateHolderParams): Promise<Holder | ApplicationError> {
    try {
      const holder = params.id
        ? await this.updateHolderService.run(params)
        : await this.createHolderService.run({ ...params, id: null })

      if (holder instanceof ApplicationError) return holder

      return holder as Holder
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
