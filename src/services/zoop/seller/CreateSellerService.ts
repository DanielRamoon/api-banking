import { SellerTypes } from '../../../@types/zoop/SellerTypes'
import { ApplicationProvider } from '../../../adapters/providers/ApplicationProvider'
import { t } from '../../../config/i18next/I18nextLocalization'
import { AccountType } from '../../../entities/Holder'
import { ApplicationError } from '../../../helpers/ApplicationError'
import { ApplicationService } from '../../ApplicationService'

type CreateSellerParams = {
  accountType: AccountType
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  taxpayerId: string
  cnpj: string
  birthdate: string
  legalName: string
  statementDescriptor: string
  addressCountry: string
  addressPostalCode: string
  addressCity: string
  addressState: string
  addressNeighborhood: string
  addressStreet: string
  addressNumber: string
  addressComplement: string
}

export class CreateSellerService implements ApplicationService {
  private createSellerIndividual: ApplicationProvider
  private createSellerBusiness: ApplicationProvider

  constructor(
    createSellerIndividual: ApplicationProvider,
    createSellerBusiness: ApplicationProvider
  ) {
    this.createSellerIndividual = createSellerIndividual
    this.createSellerBusiness = createSellerBusiness
  }

  async run(
    params: CreateSellerParams
  ): Promise<SellerTypes | ApplicationError> {
    try {
      const seller =
        params.accountType === AccountType.individual
          ? await this.createSellerIndividual.execute({ ...params })
          : await this.createSellerBusiness.execute({ ...params })

      if (seller instanceof ApplicationError) return seller

      return seller as SellerTypes
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
