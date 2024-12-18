import { HTTPRequest } from '../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  clientError,
  ok,
  unprocessable
} from '../../adapters/http/HttpResponseAdapter'
import { t } from '../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../helpers/ApplicationError'
import { UUID_REGEX } from '../../helpers/constants'
import { ApplicationService } from '../../services/ApplicationService'

type DeleteAdminParams = {
  id: string
}

export default class DeleteAdminController implements HTTPRequest {
  private deleteAdminService: ApplicationService

  constructor(deleteAdminService: ApplicationService) {
    this.deleteAdminService = deleteAdminService
  }

  async handle({ id }: DeleteAdminParams): Promise<HttpResponse> {
    try {
      if (!id) return clientError(new ApplicationError(t('error.id.missing')))
      if (!UUID_REGEX.test(id))
        return clientError(t('error.id.invalid', { resource: 'admin' }))

      const result = await this.deleteAdminService.run({ id })

      if (result instanceof ApplicationError) {
        return unprocessable(
          new ApplicationError(t('error.deleting', { resource: 'admin' }))
        )
      }

      return ok({ deleted: result })
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
