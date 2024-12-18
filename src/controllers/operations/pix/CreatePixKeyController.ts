import { HTTPRequest } from '../../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  clientError,
  notFound,
  ok,
  unprocessable
} from '../../../adapters/http/HttpResponseAdapter'
import { t } from '../../../config/i18next/I18nextLocalization'
import ApplicationUser from '../../../entities/ApplicationUser'
import Wallet, { WalletProps } from '../../../entities/Wallet'
import { ApplicationError } from '../../../helpers/ApplicationError'
import { EMAIL, PHONE } from '../../../helpers/constants'
import PixKeyValidator from '../../../helpers/validators/zod/PixKeyValidator'
import { IWalletRepository } from '../../../repositories/IWalletRepository'
import { ApplicationService } from '../../../services/ApplicationService'

type CreatePixKeyParams = {
  user: ApplicationUser
  company_id: string
  wallet_id: string
  type: string
  value: string
}

export default class CreatePixKeyController implements HTTPRequest {
  private createPixKeyService: ApplicationService
  private walletRepository: IWalletRepository

  constructor(
    createPixKeyService: ApplicationService,
    walletRepository: IWalletRepository
  ) {
    this.createPixKeyService = createPixKeyService
    this.walletRepository = walletRepository
  }

  async handle({
    user,
    company_id,
    wallet_id,
    type,
    value
  }: CreatePixKeyParams): Promise<HttpResponse> {
    try {
      const _wallet = await this.walletRepository.find(
        wallet_id,
        user.id,
        company_id
      )

      if (_wallet instanceof ApplicationError) return notFound(_wallet)

      const wallet = new Wallet(_wallet as WalletProps).serializable_hash

      const pixKeyValidator = new PixKeyValidator({
        user_id: user.id,
        zoop_account_id: wallet.zoopAccountId,
        company_id,
        wallet_id,
        type,
        value
      })

      const paymentValid = await pixKeyValidator.validate()

      if (!paymentValid) {
        const errors = await pixKeyValidator.errors()
        return clientError(errors)
      }

      let _value = [PHONE, EMAIL].includes(type) ? value : null
      _value = type === PHONE ? `+${value.replace(/[^\d]+/g, '')}` : _value

      const result = await this.createPixKeyService.run({
        user,
        type,
        wallet,
        value: _value,
        xAuthTokenReading: '',
        xSessionToken: ''
      })

      if (result instanceof ApplicationError) {
        return unprocessable(
          new ApplicationError(
            t('error.provider.pix_create', { provider: 'zoop' })
          )
        )
      }

      return ok(result)
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
