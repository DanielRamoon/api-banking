import { HTTPRequest } from '../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  clientError,
  created,
  fail,
  unprocessable
} from '../../adapters/http/HttpResponseAdapter'
import { ApplicationService } from '../../services/ApplicationService'
import { ApplicationError } from '../../helpers/ApplicationError'
import { t } from '../../config/i18next/I18nextLocalization'
import { IUserRepository } from '../../repositories/IUserRepository'
import UserValidator from '../../helpers/validators/zod/UserValidator'
import PasswordHelper from '../../helpers/PasswordHelper'
import { randomUUID } from 'crypto'

type CreateUserParams = {
  name: string
  email: string
  cnpj?: string
  taxpayer_id: string
  phone: string
  phone_prefix: string
  company_id: string
  password: string
  confirm: string
}

export default class CreateUserController implements HTTPRequest {
  private userRepository: IUserRepository
  private createUserService: ApplicationService

  constructor(
    userRepository: IUserRepository,
    createUserService: ApplicationService
  ) {
    this.userRepository = userRepository
    this.createUserService = createUserService
  }

  async handle({
    name,
    email,
    taxpayer_id,
    phone,
    phone_prefix,
    company_id,
    cnpj
  }: CreateUserParams): Promise<HttpResponse> {
    try {
      const userValidator = new UserValidator(
        {
          name,
          email,
          taxpayerId: taxpayer_id,
          phone,
          phonePrefix: phone_prefix,
          companyId: company_id,
          cnpj: cnpj || undefined
        },
        this.userRepository,
        true
      )

      const uesrValid = await userValidator.validate()

      if (!uesrValid) {
        const userErrors = await userValidator.errors()
        return clientError(userErrors)
      }

      const encryptedPassword = await PasswordHelper.encrypt(randomUUID())

      const result = await this.createUserService.run({
        name,
        cnpj,
        email,
        phone,
        encryptedPassword,
        taxpayerId: taxpayer_id,
        companyId: company_id,
        phonePrefix: phone_prefix
      })

      if (result instanceof ApplicationError) return unprocessable(result)

      return created({
        user: result
      })
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
