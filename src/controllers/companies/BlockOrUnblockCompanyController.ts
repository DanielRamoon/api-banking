import { HTTPRequest } from '../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  fail,
  ok,
  unprocessable
} from '../../adapters/http/HttpResponseAdapter'
import { t } from '../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../helpers/ApplicationError'
import { ApplicationService } from '../../services/ApplicationService'

type BlockOrUnblockCompanyParams = {
  id: string
  is_blocked: string
}

export default class BlockOrUnblockCompanyController implements HTTPRequest {
  private blockorUnblockCompanyService: ApplicationService

  constructor(blockorUnblockCompanyService: ApplicationService) {
    this.blockorUnblockCompanyService = blockorUnblockCompanyService
  }

  async handle({
    id,
    is_blocked
  }: BlockOrUnblockCompanyParams): Promise<HttpResponse> {
    try {
      const result = await this.blockorUnblockCompanyService.run({
        id,
        is_blocked
      })

      if (result instanceof ApplicationError) {
        return unprocessable(result)
      }

      return ok(result)
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
