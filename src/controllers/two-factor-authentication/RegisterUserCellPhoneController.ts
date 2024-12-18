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

type RegisterUserCellPhoneParams = {
  cellPhone: string
}

const uniqueIdentifier = '123456'

export default class RegisterUserCellPhoneController implements HTTPRequest {
  private loginService: ApplicationService
  private registerCellphoneUserService: ApplicationService

  constructor(
    loginService: ApplicationService,
    registerCellphoneUserService: ApplicationService
  ) {
    this.loginService = loginService
    this.registerCellphoneUserService = registerCellphoneUserService
  }

  async handle({
    cellPhone
  }: RegisterUserCellPhoneParams): Promise<HttpResponse> {
    try {
      const login = await this.loginService.run({})

      if (login instanceof ApplicationError) {
        return unprocessable(JSON.parse(login.message))
      }

      const logggedCompany = (login as LoginTypes).data

      const result = await this.registerCellphoneUserService.run({
        cellPhone,
        uniqueIdentifier,
        applicationToken: logggedCompany['X-Auth-Token-Reading'],
        xAuthToken: logggedCompany['X-Auth-Token']
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
