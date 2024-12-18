import { PixKeyType } from '../../../@types/zoop/PixKeyTypes'
import { ApplicationProvider } from '../../../adapters/providers/ApplicationProvider'
import { t } from '../../../config/i18next/I18nextLocalization'
import User from '../../../entities/User'
import Wallet from '../../../entities/Wallet'
import { ApplicationError } from '../../../helpers/ApplicationError'
import { IWalletRepository } from '../../../repositories/IWalletRepository'
import { ApplicationService } from '../../ApplicationService'

type GetPixByKeyParams = {
  user: User
  walletId: string
  companyId: string
  value: string
}

export class GetPixByKeyService implements ApplicationService {
  private walletRepository: IWalletRepository
  private getPixByKeyProvider: ApplicationProvider

  constructor(
    walletRepository: IWalletRepository,
    getPixByKeyProvider: ApplicationProvider
  ) {
    this.walletRepository = walletRepository
    this.getPixByKeyProvider = getPixByKeyProvider
  }

  async run({
    user,
    walletId,
    companyId,
    value
  }: GetPixByKeyParams): Promise<object | ApplicationError> {
    try {
      const wallet = (await this.walletRepository.find(
        walletId,
        user.id,
        companyId
      )) as Wallet

      const paymentDetails = await this.getPixByKeyProvider.execute({
        holderId: user.holderId,
        accountId: wallet?.zoopAccountId,
        value
      })

      if (paymentDetails instanceof ApplicationError) return paymentDetails

      const { data } = paymentDetails as PixKeyType
      return {
        status: data.status,
        value: data.key.value,
        type: data.key.type,
        name: data.account.owner.name,
        createdAt: data.created_at
      }
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
