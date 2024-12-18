import { SellerTypes } from '../../../@types/zoop/SellerTypes'
import { ApplicationProvider } from '../../../adapters/providers/ApplicationProvider'
import { t } from '../../../config/i18next/I18nextLocalization'
import { AccountType } from '../../../entities/Holder'
import { ApplicationError } from '../../../helpers/ApplicationError'
import { ApplicationService } from '../../ApplicationService'

type FindOrCreateSellerParams = {
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

export class FindOrCreateSellerService implements ApplicationService {
  private findSellerProvider: ApplicationProvider
  private createSellerService: ApplicationService

  constructor(
    findSellerProvider: ApplicationProvider,
    createSellerService: ApplicationService
  ) {
    this.findSellerProvider = findSellerProvider
    this.createSellerService = createSellerService
  }

  async run(
    params: FindOrCreateSellerParams
  ): Promise<SellerTypes | ApplicationError> {
    try {
      const _sellerProvider = await this.findSellerProvider.execute({
        taxpayerId: params.taxpayerId,
        cnpj: params.cnpj
      })

      if (
        _sellerProvider instanceof ApplicationError &&
        _sellerProvider.status !== 404
      )
        return _sellerProvider

      if (_sellerProvider.status === 200) return _sellerProvider as SellerTypes

      const _sellerService = await this.createSellerService.run(params)

      if (_sellerService instanceof ApplicationError) return _sellerService

      return _sellerService as SellerTypes
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
