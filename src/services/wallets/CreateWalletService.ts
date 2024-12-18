import { t } from '../../config/i18next/I18nextLocalization'
import Wallet, { TransactionLevel, WalletProps } from '../../entities/Wallet'
import { ApplicationError } from '../../helpers/ApplicationError'
import { IWalletRepository } from '../../repositories/IWalletRepository'
import { ApplicationService } from '../ApplicationService'

type CreateWalletParams = {
  userId: string
  zoopAccountId: string
  isPrimary: boolean
  transactionLevel: TransactionLevel
}

export class CreateWalletService implements ApplicationService {
  private walletRepository: IWalletRepository

  constructor(walletRepository: IWalletRepository) {
    this.walletRepository = walletRepository
  }

  async run({
    userId,
    zoopAccountId,
    isPrimary,
    transactionLevel
  }: CreateWalletParams): Promise<Wallet | ApplicationError> {
    try {
      const wallet = await this.walletRepository.create({
        userId,
        zoopAccountId,
        isPrimary,
        transactionLevel
      })

      if (wallet instanceof ApplicationError) return wallet

      return new Wallet(wallet as WalletProps).serializable_hash
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
