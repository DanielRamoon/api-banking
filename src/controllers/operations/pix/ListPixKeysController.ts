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

type ListPixKeysParams = {
  user: ApplicationUser
  company_id: string
  wallet_id: string
}

export default class ListPixKeysController implements HTTPRequest {
  private listPixKeysService: ApplicationService

  constructor(listPixKeysService: ApplicationService) {
    this.listPixKeysService = listPixKeysService
  }

  async handle({
    user,
    company_id,
    wallet_id
  }: ListPixKeysParams): Promise<HttpResponse> {
    try {
      const result = await this.listPixKeysService.run({
        user,
        companyId: company_id,
        walletId: wallet_id
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
