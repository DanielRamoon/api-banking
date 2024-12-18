import { HTTPRequest } from '../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  clientError,
  ok,
  unprocessable
} from '../../adapters/http/HttpResponseAdapter'
import { t } from '../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../helpers/ApplicationError'
import CompanyValidator from '../../helpers/validators/zod/CompanyValidator'
import { ICompanyRepository } from '../../repositories/ICompanyRepository'
import { ApplicationService } from '../../services/ApplicationService'

type UpdateCompanyParams = {
  id: string
  name: string
  cnpj: string
  company_name: string
}

export default class UpdateCompanyController implements HTTPRequest {
  private companyRepository: ICompanyRepository
  private updateCompanyService: ApplicationService

  constructor(
    companyRepository: ICompanyRepository,
    updateCompanyService: ApplicationService
  ) {
    this.companyRepository = companyRepository
    this.updateCompanyService = updateCompanyService
  }

  async handle({
    id,
    name,
    cnpj,
    company_name
  }: UpdateCompanyParams): Promise<HttpResponse> {
    try {
      const companyValidator = new CompanyValidator(
        { id, name, cnpj, companyName: company_name },
        this.companyRepository
      )

      const companyValid = await companyValidator.validate()
      if (!companyValid) {
        const companyErrors = await companyValidator.errors()
        return clientError(companyErrors)
      }

      const result = await this.updateCompanyService.run({
        id,
        name,
        cnpj,
        companyName: company_name
      })

      if (result instanceof ApplicationError) return unprocessable(result)

      return ok(result)
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
