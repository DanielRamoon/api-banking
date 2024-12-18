import { PaymentTypes } from '../../../@types/zoop/PaymentTypes'
import { ApplicationProvider } from '../../../adapters/providers/ApplicationProvider'
import { t } from '../../../config/i18next/I18nextLocalization'
import User from '../../../entities/User'
import Wallet from '../../../entities/Wallet'
import { ApplicationError } from '../../../helpers/ApplicationError'
import { ApplicationService } from '../../ApplicationService'

type CreatePaymentParams = {
  user: User
  wallet: Wallet
  barCode: string
  amount: number
  referenceId: string
  interest?: number
  discount?: number
}

export class CreatePaymentService implements ApplicationService {
  private createPaymentProvider: ApplicationProvider

  constructor(createPaymentProvider: ApplicationProvider) {
    this.createPaymentProvider = createPaymentProvider
  }

  async run({
    user,
    wallet,
    barCode,
    amount,
    referenceId,
    interest,
    discount
  }: CreatePaymentParams): Promise<PaymentTypes | ApplicationError> {
    try {
      const payment = await this.createPaymentProvider.execute({
        accountId: wallet.zoopAccountId,
        interest,
        discount,
        barCode,
        amount,
        statementDescriptor: user.name,
        referenceId
      })

      if (payment instanceof ApplicationError) return payment

      return payment as PaymentTypes
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
