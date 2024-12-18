import { PixKeyType } from '../../../@types/zoop/PixKeyTypes'
import { ApplicationProvider } from '../../../adapters/providers/ApplicationProvider'
import { t } from '../../../config/i18next/I18nextLocalization'
import User from '../../../entities/User'
import Wallet from '../../../entities/Wallet'
import { ApplicationError } from '../../../helpers/ApplicationError'
import { ApplicationService } from '../../ApplicationService'

type CreatePixKeyParams = {
  user: User
  wallet: Wallet
  type: string
  value: string
  xAuthTokenReading: string
  xSessionToken: string
}

export class CreatePixKeyService implements ApplicationService {
  private createPixKeyProvider: ApplicationProvider

  constructor(createPixKeyProvider: ApplicationProvider) {
    this.createPixKeyProvider = createPixKeyProvider
  }

  async run({
    user,
    wallet,
    type,
    value,
    xAuthTokenReading,
    xSessionToken
  }: CreatePixKeyParams): Promise<object | ApplicationError> {
    try {
      const createPixParams = {
        holderId: user.holderId,
        accountId: wallet.zoopAccountId,
        type,
        xAuthTokenReading,
        xSessionToken
      } as unknown as CreatePixKeyParams

      if (value) createPixParams['value'] = value

      const pixKey = await this.createPixKeyProvider.execute(createPixParams)
      if (pixKey instanceof ApplicationError) return pixKey

      const { data } = pixKey as PixKeyType
      const formattedPixKey = {
        status: data.status,
        value: data.key.value,
        type: data.key.type,
        name: data.account.owner.name,
        createdAt: data.created_at
      }

      return formattedPixKey
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
