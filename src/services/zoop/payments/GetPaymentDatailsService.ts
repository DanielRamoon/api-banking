import { PaymentTypes } from '../../../@types/zoop/PaymentTypes'
import { ApplicationProvider } from '../../../adapters/providers/ApplicationProvider'
import { t } from '../../../config/i18next/I18nextLocalization'
import Wallet from '../../../entities/Wallet'
import { ApplicationError } from '../../../helpers/ApplicationError'
import { IWalletRepository } from '../../../repositories/IWalletRepository'
import { ApplicationService } from '../../ApplicationService'

type GetPaymentDatailsParams = {
  userId: string
  companyId: string
  walletId: string
  barCode: string
}

export class GetPaymentDatailsService implements ApplicationService {
  private walletRepository: IWalletRepository
  private getPaymentDetailsProvider: ApplicationProvider

  constructor(
    walletRepository: IWalletRepository,
    getPaymentDetailsProvider: ApplicationProvider
  ) {
    this.walletRepository = walletRepository
    this.getPaymentDetailsProvider = getPaymentDetailsProvider
  }

  async run({
    userId,
    companyId,
    walletId,
    barCode
  }: GetPaymentDatailsParams): Promise<PaymentTypes | ApplicationError> {
    try {
      const wallet = (await this.walletRepository.find(
        walletId,
        userId,
        companyId
      )) as Wallet

      const paymentDetails = await this.getPaymentDetailsProvider.execute({
        accountId: wallet?.zoopAccountId,
        barCode
      })

      if (paymentDetails instanceof ApplicationError) return paymentDetails

      return paymentDetails as PaymentTypes
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
