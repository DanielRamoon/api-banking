import { Role } from '../../../entities/CompanyUser'
import { HTTPRequest } from '../../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  clientError,
  ok,
  unprocessable
} from '../../../adapters/http/HttpResponseAdapter'
import { t } from '../../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../../helpers/ApplicationError'
import { ApplicationService } from '../../../services/ApplicationService'
import CompanyUserValidator from '../../../helpers/validators/zod/CompanyUserValidator'
import { ICompanyUserRepository } from '../../../repositories/ICompanyUserRepository'

type UpdateCompanyUserParams = {
  company_user_id: string
  name: string
  role: string
  company_id: string
  email: string
}

export default class UpdateCompanyUserController implements HTTPRequest {
  private companyRepository: ICompanyUserRepository
  private updateCompanyUserService: ApplicationService

  constructor(
    companyRepository: ICompanyUserRepository,
    updateCompanyUserService: ApplicationService
  ) {
    this.companyRepository = companyRepository
    this.updateCompanyUserService = updateCompanyUserService
  }

  async handle({
    company_user_id,
    name,
    role,
    company_id,
    email
  }: UpdateCompanyUserParams): Promise<HttpResponse> {
    try {
      const companyUserValidator = new CompanyUserValidator(
        {
          id: company_user_id,
          name,
          email,
          role: role as Role,
          resource: 'company_user',
          encryptedPassword: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          companyId: company_id
        },
        this.companyRepository
      )

      const companyUserValid = await companyUserValidator.validate()
      if (!companyUserValid) {
        const companyUserErrors = await companyUserValidator.errors()
        return clientError(companyUserErrors)
      }

      const result = await this.updateCompanyUserService.run({
        id: company_user_id,
        name,
        role
      })

      if (result instanceof ApplicationError) return unprocessable(result)

      return ok(result)
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
