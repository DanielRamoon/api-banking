import { HTTPRequest } from '../adapters/http/HttpRequestAdapter'
import { HttpResponse, fail, ok } from '../adapters/http/HttpResponseAdapter'
import { t } from '../config/i18next/I18nextLocalization'
import { ApplicationError } from '../helpers/ApplicationError'

export default class IntegrityController implements HTTPRequest {
  async handle(params: object): Promise<HttpResponse> {
    try {
      return ok({
        app_name: t('app_name'),
        app_version: t('app_version'),
        params
      })
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
