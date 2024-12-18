import { HTTPRequest } from '../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  clientError,
  fail,
  ok,
  unprocessable
} from '../../adapters/http/HttpResponseAdapter'
import { ApplicationService } from '../../services/ApplicationService'
import { ApplicationError } from '../../helpers/ApplicationError'
import { t } from '../../config/i18next/I18nextLocalization'
import { IUserRepository } from '../../repositories/IUserRepository'
import UserValidator from '../../helpers/validators/zod/UserValidator'

type UpdateUserParams = {
  id: string
  name: string
  email: string
  phone: string
  phone_prefix: string
  company_id: string
}

export default class UpdateUserController implements HTTPRequest {
  private userRepository: IUserRepository
  private updateUserService: ApplicationService

  constructor(
    userRepository: IUserRepository,
    updateUserService: ApplicationService
  ) {
    this.userRepository = userRepository
    this.updateUserService = updateUserService
  }

  async handle({
    id,
    name,
    email,
    phone,
    phone_prefix,
    company_id
  }: UpdateUserParams): Promise<HttpResponse> {
    try {
      const userValidator = new UserValidator(
        {
          id,
          name,
          email,
          taxpayerId: '',
          companyId: company_id,
          phone,
          phonePrefix: phone_prefix
        },
        this.userRepository
      )

      const uesrValid = await userValidator.validate()

      if (!uesrValid) {
        const userErrors = await userValidator.errors()
        return clientError(userErrors)
      }

      const result = await this.updateUserService.run({
        id,
        name,
        email,
        phone,
        phonePrefix: phone_prefix
      })

      if (result instanceof ApplicationError) return unprocessable(result)

      return ok(result)
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
