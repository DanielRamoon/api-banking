import { HTTPRequest } from '../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  clientError,
  created,
  fail,
  unprocessable
} from '../../adapters/http/HttpResponseAdapter'
import { Role } from '../../entities/CompanyUser'
import CompanyUserValidator from '../../helpers/validators/zod/CompanyUserValidator'
import CompanyValidator from '../../helpers/validators/zod/CompanyValidator'
import { ICompanyRepository } from '../../repositories/ICompanyRepository'
import { ICompanyUserRepository } from '../../repositories/ICompanyUserRepository'
import { ApplicationService } from '../../services/ApplicationService'
import { ApplicationError } from '../../helpers/ApplicationError'
import PasswordHelper from '../../helpers/PasswordHelper'
import { t } from '../../config/i18next/I18nextLocalization'
import { randomUUID } from 'node:crypto'

type CreateCompanyParams = {
  name: string
  cnpj: string
  company_name: string
  company_user: CreateCompanyUserParams
}

type CreateCompanyUserParams = {
  name: string
  email: string
  role: Role
  password: string
  confirm: string
}

export default class CreateCompanyController implements HTTPRequest {
  private companyRepository: ICompanyRepository
  private companyUserRepository: ICompanyUserRepository
  private createCompanyService: ApplicationService

  constructor(
    companyRepository: ICompanyRepository,
    companyUserRepository: ICompanyUserRepository,
    createCompanyService: ApplicationService
  ) {
    this.companyRepository = companyRepository
    this.companyUserRepository = companyUserRepository
    this.createCompanyService = createCompanyService
  }

  async handle({
    name,
    cnpj,
    company_name,
    company_user
  }: CreateCompanyParams): Promise<HttpResponse> {
    try {
      const companyValidator = new CompanyValidator(
        { name, cnpj, companyName: company_name },
        this.companyRepository,
        true
      )

      const companyUserValidator = new CompanyUserValidator(
        {
          name: company_user.name,
          email: company_user.email,
          role: Role.owner
        },
        this.companyUserRepository,
        true
      )

      const companyValid = await companyValidator.validate()
      const companyUserValid = await companyUserValidator.validate()

      const errors = []
      if (!companyValid) {
        const companyErrors = await companyValidator.errors()
        errors.push({ company: companyErrors })
      }

      if (!companyUserValid) {
        const companyUserErrors = await companyUserValidator.errors()
        errors.push({ companyUser: companyUserErrors })
      }

      if (errors.length > 0) {
        return clientError(errors)
      }

      const encryptedPassword = await PasswordHelper.encrypt(randomUUID())

      const result = await this.createCompanyService.run({
        name,
        cnpj,
        companyName: company_name,
        companyUser: { ...company_user, encryptedPassword }
      })

      if (result instanceof ApplicationError) return unprocessable(result)

      return created(result)
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
