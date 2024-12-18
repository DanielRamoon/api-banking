import { Role } from '../../../entities/CompanyUser'
import { HTTPRequest } from '../../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  clientError,
  created,
  fail,
  unprocessable
} from '../../../adapters/http/HttpResponseAdapter'
import { t } from '../../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../../helpers/ApplicationError'
import { ICompanyUserRepository } from '../../../repositories/ICompanyUserRepository'
import { ApplicationService } from '../../../services/ApplicationService'
import CompanyUserValidator from '../../../helpers/validators/zod/CompanyUserValidator'
import PasswordValidator from '../../../helpers/validators/zod/PasswordValidator'
import PasswordHelper from '../../../helpers/PasswordHelper'

type CreateCompanyUserParams = {
  company_id: string
  name: string
  email: string
  role: string
  password: string
  confirm: string
}

export default class CreateCompanyUserController implements HTTPRequest {
  private companyUserRepository: ICompanyUserRepository
  private createCompanyUserService: ApplicationService

  constructor(
    companyUserRepository: ICompanyUserRepository,
    createCompanyUserService: ApplicationService
  ) {
    this.companyUserRepository = companyUserRepository
    this.createCompanyUserService = createCompanyUserService
  }

  async handle({
    company_id,
    name,
    email,
    role,
    password,
    confirm
  }: CreateCompanyUserParams): Promise<HttpResponse> {
    try {
      const companyUserValidator = new CompanyUserValidator(
        {
          companyId: company_id,
          name,
          email,
          role: role as Role,
          resource: 'company_user',
          encryptedPassword: '',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        this.companyUserRepository,
        true
      )

      const passwordValidator = new PasswordValidator({ password, confirm })

      const companyUserValid = await companyUserValidator.validate()
      const passwordValid = await passwordValidator.validate()

      const errors = []
      if (!companyUserValid) {
        const companyUserErrors = await companyUserValidator.errors()
        errors.push({ companyUser: companyUserErrors })
      }

      if (!passwordValid) {
        const passwordErrors = await passwordValidator.errors()
        errors.push({ password: passwordErrors })
      }

      if (errors.length > 0) {
        return clientError(errors)
      }

      const encryptedPassword = await PasswordHelper.encrypt(password)

      const result = await this.createCompanyUserService.run({
        companyId: company_id,
        name,
        email,
        role,
        encryptedPassword
      })

      if (result instanceof ApplicationError) return unprocessable(result)

      return created(result)
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
