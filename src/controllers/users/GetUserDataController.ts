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

type GetUserDataParams = {
  id: string
}

export default class GetUserDataController implements HTTPRequest {
  private getUserDataService: ApplicationService

  constructor(getUserDataService: ApplicationService) {
    this.getUserDataService = getUserDataService
  }

  async handle({ id }: GetUserDataParams): Promise<HttpResponse> {
    try {
      const result = await this.getUserDataService.run({ id })

      if (result instanceof ApplicationError) {
        return notFound(
          new ApplicationError(t('error.notFound', { resource: 'user' }))
        )
      }

      return ok(result)
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
