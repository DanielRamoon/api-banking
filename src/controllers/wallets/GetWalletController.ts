import { HTTPRequest } from '../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  fail,
  notFound,
  ok
} from '../../adapters/http/HttpResponseAdapter'
import { t } from '../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../helpers/ApplicationError'
import { ApplicationService } from '../../services/ApplicationService'

type GeWalletParams = {
  id?: string
  user_id?: string
  wallet_id: string
  company_id?: string
}

export default class GetWalletController implements HTTPRequest {
  private getWalletService: ApplicationService
  private getWalletBalanceService: ApplicationService

  constructor(
    getWalletService: ApplicationService,
    getWalletBalanceService: ApplicationService
  ) {
    this.getWalletService = getWalletService
    this.getWalletBalanceService = getWalletBalanceService
  }

  async handle({
    id,
    user_id,
    wallet_id,
    company_id
  }: GeWalletParams): Promise<HttpResponse> {
    try {
      const result = await this.getWalletService.run({
        id: wallet_id,
        userId: id ?? user_id,
        companyId: company_id
      })

      if (result instanceof ApplicationError) {
        return notFound(
          new ApplicationError(t('error.notFound', { resource: 'wallet' }))
        )
      }

      const walletWithBalance = await this.getWalletBalanceService.run({
        wallet: result
      })

      return ok(walletWithBalance)
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
