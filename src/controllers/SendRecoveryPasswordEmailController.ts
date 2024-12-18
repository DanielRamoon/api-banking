import { HTTPRequest } from '../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  fail,
  ok,
  unprocessable
} from '../adapters/http/HttpResponseAdapter'
import { t } from '../config/i18next/I18nextLocalization'
import { ApplicationError } from '../helpers/ApplicationError'
import SendMailService from '../services/SendMailService'

export type RecoveryPasswordProps = {
  type: string
  email: string
  name: string
}

// eslint-disable-next-line indent, prettier/prettier
export default class SendRecoveryPasswordEmailController implements HTTPRequest {
  private sendMailService: SendMailService

  constructor(sendMailService: SendMailService) {
    this.sendMailService = sendMailService
  }

  async handle({
    type,
    email,
    name
  }: RecoveryPasswordProps): Promise<HttpResponse> {
    try {
      const result = await this.sendMailService.run({ type, email, name })
      if (result instanceof ApplicationError) return unprocessable(result)

      return ok(result)
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
