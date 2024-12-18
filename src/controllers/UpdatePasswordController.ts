import { HTTPRequest } from '../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  clientError,
  fail,
  ok,
  unprocessable
} from '../adapters/http/HttpResponseAdapter'
import { t } from '../config/i18next/I18nextLocalization'
import { ApplicationError } from '../helpers/ApplicationError'
import PasswordValidator from '../helpers/validators/zod/PasswordValidator'
import { ApplicationService } from '../services/ApplicationService'

export type UpdatePasswordProps = {
  token: string
  password: string
  confirmPassword: string
}

export default class UpdatePasswordController implements HTTPRequest {
  private updatePasswordService: ApplicationService

  constructor(updatePasswordService: ApplicationService) {
    this.updatePasswordService = updatePasswordService
  }

  async handle({
    token,
    password,
    confirmPassword
  }: UpdatePasswordProps): Promise<HttpResponse> {
    try {
      const passwordValidator = new PasswordValidator({
        password,
        confirm: confirmPassword
      })

      const passwordValid = await passwordValidator.validate()

      if (!passwordValid) {
        const passwordErrors = await passwordValidator.errors()
        return clientError(passwordErrors)
      }

      const result = await this.updatePasswordService.run({
        token,
        password,
        confirmPassword
      })
      if (result instanceof ApplicationError) return unprocessable(result)

      return ok(result)
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
