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

type GeOperationParams = {
  id?: string
  user_id?: string
  operation_id: string
}

export default class GetOperationController implements HTTPRequest {
  private getOperationService: ApplicationService

  constructor(getOperationService: ApplicationService) {
    this.getOperationService = getOperationService
  }

  async handle({
    id,
    user_id,
    operation_id
  }: GeOperationParams): Promise<HttpResponse> {
    try {
      const result = await this.getOperationService.run({
        id: operation_id,
        userId: id ?? user_id
      })

      if (result instanceof ApplicationError) {
        return notFound(
          new ApplicationError(t('error.notFound', { resource: 'operation' }))
        )
      }

      return ok(result)
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
