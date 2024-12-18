import { LoginTypes } from '../../../@types/zoop/2FACompanyTypes'
import { PixKeyTypes } from '../../../@types/zoop/PixKeyTypes'
import { ApplicationProvider } from '../../../adapters/providers/ApplicationProvider'
import { t } from '../../../config/i18next/I18nextLocalization'
import User from '../../../entities/User'
import Wallet from '../../../entities/Wallet'
import { ApplicationError } from '../../../helpers/ApplicationError'
import { IWalletRepository } from '../../../repositories/IWalletRepository'
import { ApplicationService } from '../../ApplicationService'

type ListPixKeysParams = {
  user: User
  walletId: string
  companyId: string
  xAuthTokenReading: string
  xSessionToken: string
}

export class ListPixKeysService implements ApplicationService {
  private walletRepository: IWalletRepository
  private listPixKeysProvider: ApplicationProvider
  private loginProvider: ApplicationProvider

  constructor(
    walletRepository: IWalletRepository,
    listPixKeysProvider: ApplicationProvider,
    loginProvider: ApplicationProvider
  ) {
    this.walletRepository = walletRepository
    this.listPixKeysProvider = listPixKeysProvider
    this.loginProvider = loginProvider
  }

  async run({
    user,
    walletId,
    companyId
  }: ListPixKeysParams): Promise<object[] | ApplicationError> {
    try {
      const wallet = (await this.walletRepository.find(
        walletId,
        user.id,
        companyId
      )) as Wallet

      const company = await this.loginProvider.execute({})
      if (company instanceof ApplicationError) return company

      const loggedCompany = (company as LoginTypes).data

      const paymentDetails = await this.listPixKeysProvider.execute({
        holderId: user.holderId,
        accountId: wallet?.zoopAccountId,
        xAuthTokenReading: loggedCompany['X-Auth-Token-Reading'],
        xSessionToken: loggedCompany['X-Auth-Token']
      })

      if (paymentDetails instanceof ApplicationError) return paymentDetails

      const { data } = paymentDetails as PixKeyTypes
      const formattedPaymentDetails = data.items.map(pixKey => {
        return {
          status: pixKey.status,
          value: pixKey.key.value,
          type: pixKey.key.type,
          name: pixKey.account.owner.name,
          createdAt: pixKey.created_at
        }
      })

      return formattedPaymentDetails
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
