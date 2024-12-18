import { t } from '../../config/i18next/I18nextLocalization'
import Wallet, { WalletProps } from '../../entities/Wallet'
import { ApplicationError } from '../../helpers/ApplicationError'
import { IWalletRepository } from '../../repositories/IWalletRepository'
import { ApplicationService } from '../ApplicationService'

type GeWalletParams = {
  id: string
  userId?: string
  companyId?: string
}

export class GetWalletService implements ApplicationService {
  private walletRepository: IWalletRepository

  constructor(walletRepository: IWalletRepository) {
    this.walletRepository = walletRepository
  }

  async run({
    id,
    userId,
    companyId
  }: GeWalletParams): Promise<Wallet | ApplicationError> {
    try {
      const findOrError = await this.walletRepository.find(
        id,
        userId,
        companyId
      )

      if (findOrError instanceof ApplicationError) return findOrError

      return new Wallet(findOrError as WalletProps).serializable_hash
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
