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

type GetPixByKeyParams = {
  user: ApplicationUser
  company_id: string
  wallet_id: string
  value: string
}

export default class GetPixByKeyController implements HTTPRequest {
  private getPixByKeyService: ApplicationService

  constructor(getPixByKeyService: ApplicationService) {
    this.getPixByKeyService = getPixByKeyService
  }

  async handle({
    user,
    company_id,
    wallet_id,
    value
  }: GetPixByKeyParams): Promise<HttpResponse> {
    try {
      const result = await this.getPixByKeyService.run({
        user,
        companyId: company_id,
        walletId: wallet_id,
        value
      })

      if (result instanceof ApplicationError) {
        return unprocessable(
          new ApplicationError(t('error.provider.pix', { provider: 'zoop' }))
        )
      }

      return ok(result)
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
