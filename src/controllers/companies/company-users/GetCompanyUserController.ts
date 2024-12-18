import { HTTPRequest } from '../../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  fail,
  notFound,
  ok
} from '../../../adapters/http/HttpResponseAdapter'
import { t } from '../../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../../helpers/ApplicationError'
import { ApplicationService } from '../../../services/ApplicationService'

type GetCompanyUserParams = {
  company_user_id?: string
  company_id: string
}

export default class GetCompanyUserController implements HTTPRequest {
  private getCompanyUserService: ApplicationService

  constructor(getCompanyUserService: ApplicationService) {
    this.getCompanyUserService = getCompanyUserService
  }

  async handle({
    company_user_id,
    company_id
  }: GetCompanyUserParams): Promise<HttpResponse> {
    try {
      const result = await this.getCompanyUserService.run({
        id: company_user_id,
        companyId: company_id
      })

      if (result instanceof ApplicationError) {
        return notFound(
          new ApplicationError(
            t('error.notFound', { resource: 'company_user' })
          )
        )
      }

      return ok(result)
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
