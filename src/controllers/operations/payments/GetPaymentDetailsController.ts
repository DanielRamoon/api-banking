import { HTTPRequest } from '../../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  ok,
  unprocessable
} from '../../../adapters/http/HttpResponseAdapter'
import { t } from '../../../config/i18next/I18nextLocalization'
import ApplicationUser from '../../../entities/ApplicationUser'
import { ApplicationError } from '../../../helpers/ApplicationError'
import { ApplicationService } from '../../../services/ApplicationService'

type GetPaymentDetailsParams = {
  user: ApplicationUser
  company_id: string
  wallet_id: string
  bar_code: string
}

export default class GetPaymentDetailsController implements HTTPRequest {
  private getPaymentDetailsService: ApplicationService

  constructor(getPaymentDetailsService: ApplicationService) {
    this.getPaymentDetailsService = getPaymentDetailsService
  }

  async handle({
    user,
    company_id,
    wallet_id,
    bar_code
  }: GetPaymentDetailsParams): Promise<HttpResponse> {
    try {
      const result = await this.getPaymentDetailsService.run({
        userId: user.id,
        companyId: company_id,
        walletId: wallet_id,
        barCode: bar_code
      })

      if (result instanceof ApplicationError) {
        return unprocessable(
          new ApplicationError(
            t('error.provider.barcode', { provider: 'zoop' })
          )
        )
      }

      return ok(result)
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
