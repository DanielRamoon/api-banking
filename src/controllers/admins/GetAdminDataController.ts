import { HTTPRequest } from '../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  fail,
  notFound,
  ok
} from '../../adapters/http/HttpResponseAdapter'
import { t } from '../../config/i18next/I18nextLocalization'
import Admin, { AdminProps } from '../../entities/Admin'
import { ApplicationError } from '../../helpers/ApplicationError'
import { IAdminRepository } from '../../repositories/IAdminRepository'

type GetAdminDataParams = {
  id: string
}

export default class GetAdminDataController implements HTTPRequest {
  private adminRepostitory: IAdminRepository

  constructor(adminRepostitory: IAdminRepository) {
    this.adminRepostitory = adminRepostitory
  }

  async handle({ id }: GetAdminDataParams): Promise<HttpResponse> {
    try {
      const result = await this.adminRepostitory.find(id)

      if (result instanceof ApplicationError) {
        return notFound(
          new ApplicationError(t('error.notFound', { resource: 'admin' }))
        )
      }

      return ok(new Admin(result as AdminProps).serializable_hash)
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
