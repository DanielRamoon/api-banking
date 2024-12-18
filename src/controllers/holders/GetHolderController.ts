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

type GetHolderParams = {
  id?: string
}

export default class GetHolderController implements HTTPRequest {
  private getHolderService: ApplicationService

  constructor(getHolderService: ApplicationService) {
    this.getHolderService = getHolderService
  }

  async handle({ id }: GetHolderParams): Promise<HttpResponse> {
    try {
      const result = await this.getHolderService.run({
        id
      })

      if (result instanceof ApplicationError) {
        return notFound(
          new ApplicationError(t('error.notFound', { resource: 'holder' }))
        )
      }

      return ok(result)
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
