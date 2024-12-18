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

type BlockOrUnblockUserParams = {
  id: string
  is_blocked: string
}

export default class BlockOrUnblockUserController implements HTTPRequest {
  private blockorUnblockUserService: ApplicationService

  constructor(blockorUnblockUserService: ApplicationService) {
    this.blockorUnblockUserService = blockorUnblockUserService
  }

  async handle({
    id,
    is_blocked
  }: BlockOrUnblockUserParams): Promise<HttpResponse> {
    try {
      const result = await this.blockorUnblockUserService.run({
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
