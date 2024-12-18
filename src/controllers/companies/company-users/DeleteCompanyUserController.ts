import { HTTPRequest } from '../../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  clientError,
  ok,
  unprocessable
} from '../../../adapters/http/HttpResponseAdapter'
import { t } from '../../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../../helpers/ApplicationError'
import { UUID_REGEX } from '../../../helpers/constants'
import { ApplicationService } from '../../../services/ApplicationService'

type DeleteCompanyUserParams = {
  company_user_id: string
}

export default class DeleteCompanyUserController implements HTTPRequest {
  private deleteCompanyUserService: ApplicationService

  constructor(deleteCompanyUserService: ApplicationService) {
    this.deleteCompanyUserService = deleteCompanyUserService
  }

  async handle({
    company_user_id
  }: DeleteCompanyUserParams): Promise<HttpResponse> {
    try {
      if (!company_user_id)
        return clientError(new ApplicationError(t('error.id.missing')))
      if (!UUID_REGEX.test(company_user_id))
        return clientError(t('error.id.invalid', { resource: 'company user' }))

      const result = await this.deleteCompanyUserService.run({
        id: company_user_id
      })

      if (result instanceof ApplicationError) {
        return unprocessable(
          new ApplicationError(
            t('error.deleting', { resource: 'company user' })
          )
        )
      }

      return ok({ deleted: result })
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
