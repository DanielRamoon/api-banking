import { PaymentTypes } from '../../../@types/zoop/PaymentTypes'
import { ApplicationProvider } from '../../../adapters/providers/ApplicationProvider'
import { t } from '../../../config/i18next/I18nextLocalization'
import User from '../../../entities/User'
import Wallet from '../../../entities/Wallet'
import { ApplicationError } from '../../../helpers/ApplicationError'
import { ApplicationService } from '../../ApplicationService'

type CreateExternalTransferSendParams = {
  user: User
  wallet: Wallet
  amount: number
  bankCode: string
  routingNumber: number
  routingCheckDigit: number
  accountNumber: number
  accountCheckDigit: string
  document: string
  referenceId: string
  description?: number
  purposeCode?: string
}

export class CreateExternalTransferSendService implements ApplicationService {
  private createExternalTransferSendProvider: ApplicationProvider

  constructor(createExternalTransferSendProvider: ApplicationProvider) {
    this.createExternalTransferSendProvider = createExternalTransferSendProvider
  }

  async run({
    user,
    wallet,
    amount,
    bankCode,
    routingNumber,
    routingCheckDigit,
    accountNumber,
    referenceId,
    accountCheckDigit,
    document,
    description,
    purposeCode
  }: CreateExternalTransferSendParams): Promise<
    PaymentTypes | ApplicationError
  > {
    try {
      const nameArray = user.name.split(/\s/)
      const firstName = nameArray.shift()
      const lastName = nameArray.pop()

      const ted = await this.createExternalTransferSendProvider.execute({
        holderId: user.holderId,
        accountId: wallet.zoopAccountId,
        referenceId,
        amount,
        description,
        purposeCode,
        recipient: {
          bankCode,
          routingNumber,
          routingCheckDigit,
          accountNumber,
          accountCheckDigit,
          document,
          name: {
            firstName,
            lastName
          }
        }
      })

      if (ted instanceof ApplicationError) return ted

      return ted as PaymentTypes
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
