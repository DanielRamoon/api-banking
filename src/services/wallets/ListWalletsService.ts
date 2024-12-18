import { PaginateAdapter } from '../../adapters/PaginateAdapter'
import { t } from '../../config/i18next/I18nextLocalization'
import Wallet from '../../entities/Wallet'
import { ApplicationError } from '../../helpers/ApplicationError'
import { IWalletRepository } from '../../repositories/IWalletRepository'
import { ApplicationService } from '../ApplicationService'

type ListWalletsParams = {
  userId?: string
  companyId?: string
  page: number
  perPage: number
}

export class ListWalletsService implements ApplicationService {
  private walletRepository: IWalletRepository
  private paginator: PaginateAdapter

  constructor(walletRepository: IWalletRepository) {
    this.walletRepository = walletRepository
    this.paginator = new PaginateAdapter()
  }

  async run({
    userId,
    companyId,
    page,
    perPage
  }: ListWalletsParams): Promise<object | ApplicationError> {
    try {
      this.paginator.setPerPage(perPage)
      this.paginator.setSkip(page)

      const walletsCount = (await this.walletRepository.count()) as number
      const wallets = (await this.walletRepository.list({
        userId,
        companyId,
        page: this.paginator.getSkip(),
        perPage: this.paginator.getPerPage()
      })) as Wallet[]

      const walletsFormatted = wallets.map(wallet => wallet.serializable_hash)

      const walletsPaginated = this.paginator.itemsPaginated(
        walletsFormatted,
        walletsCount
      )

      return walletsPaginated
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
