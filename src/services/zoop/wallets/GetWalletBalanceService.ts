import { WalletTypes } from '../../../@types/zoop/WalletTypes'
import { ApplicationProvider } from '../../../adapters/providers/ApplicationProvider'
import { t } from '../../../config/i18next/I18nextLocalization'
import Wallet from '../../../entities/Wallet'
import { ApplicationError } from '../../../helpers/ApplicationError'
import { ApplicationService } from '../../ApplicationService'

type GetWalletBalanceParams = {
  wallets?: Array<object>
  wallet?: object
}

export class GetWalletBalanceService implements ApplicationService {
  private findWalletProvider: ApplicationProvider

  constructor(findWalletProvider: ApplicationProvider) {
    this.findWalletProvider = findWalletProvider
  }

  private DEFAULT_WALLET_BALANCE = {
    value: '0.00',
    currency: 'BRL'
  }

  async run({
    wallets,
    wallet
  }: GetWalletBalanceParams): Promise<object | ApplicationError> {
    try {
      if (wallet) {
        const accountId = (wallet as Wallet).zoopAccountId
        const holderId = (wallet as Wallet).holderId ?? ''

        const balance = await this.#getWalletBalance(
          holderId,
          accountId,
          this.findWalletProvider
        )

        wallet = {
          ...wallet,
          balance
        }
      } else if (wallets && wallets.length > 0) {
        const items = await Promise.all(
          wallets.map(async item => {
            const wallet = item as Wallet
            const accountId = wallet.zoopAccountId
            const holderId = wallet.holderId ?? ''

            const balance = await this.#getWalletBalance(
              holderId,
              accountId,
              this.findWalletProvider
            )

            const walletWithBalance = {
              ...wallet,
              balance
            }

            return walletWithBalance
          })
        )

        wallets = items
      }

      return (wallets || wallet) as unknown as object
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }

  async #getWalletBalance(
    holderId: string,
    accountId: string,
    findWalletProvider: ApplicationProvider
  ): Promise<object> {
    try {
      const balance = await findWalletProvider.execute({ holderId, accountId })

      if (balance instanceof ApplicationError)
        return this.DEFAULT_WALLET_BALANCE

      return (balance as unknown as WalletTypes).data
    } catch (error) {
      return this.DEFAULT_WALLET_BALANCE
    }
  }
}
