import { LoginTypes } from '../../@types/zoop/2FACompanyTypes'
import { HTTPRequest } from '../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  fail,
  ok,
  unprocessable
} from '../../adapters/http/HttpResponseAdapter'
import { t } from '../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../helpers/ApplicationError'
import { ApplicationService } from '../../services/ApplicationService'

type ValidateCodeSentByBySMSParams = {
  code: string
}

export default class ValidateCodeSentByBySMSController implements HTTPRequest {
  private loginService: ApplicationService
  private validateCodeSentByBySMSService: ApplicationService

  constructor(
    loginService: ApplicationService,
    validateCodeSentByBySMSService: ApplicationService
  ) {
    this.loginService = loginService
    this.validateCodeSentByBySMSService = validateCodeSentByBySMSService
  }

  async handle({ code }: ValidateCodeSentByBySMSParams): Promise<HttpResponse> {
    try {
      const login = await this.loginService.run({})

      if (login instanceof ApplicationError) {
        return unprocessable(JSON.parse(login.message))
      }

      const logggedCompany = (login as LoginTypes).data

      const result = await this.validateCodeSentByBySMSService.run({
        userToken: logggedCompany['X-Auth-Token-Reading'],
        xAuthToken: logggedCompany['X-Auth-Token'],
        userPassword: code
      })

      if (result instanceof ApplicationError) {
        return unprocessable(result)
      }

      return ok(result)
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
