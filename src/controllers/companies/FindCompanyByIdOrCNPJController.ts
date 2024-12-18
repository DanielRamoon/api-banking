import { HTTPRequest } from '../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  notFound,
  ok
} from '../../adapters/http/HttpResponseAdapter'
import { t } from '../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../helpers/ApplicationError'
import { ICompanyRepository } from '../../repositories/ICompanyRepository'

type FindCompanyParam = {
  search: string
}

export default class FindCompanyByIdOrCNPJController implements HTTPRequest {
  private companyRepository: ICompanyRepository

  constructor(companyRepository: ICompanyRepository) {
    this.companyRepository = companyRepository
  }

  async handle({ search }: FindCompanyParam): Promise<HttpResponse> {
    try {
      const company = await this.companyRepository.findByIdOrCNPJ(search)

      if (!company) {
        return notFound(
          new ApplicationError(
            t('error.notFound', {
              resource: 'company'
            })
          )
        )
      }

      return ok({ company: company.serializable_hash })
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
