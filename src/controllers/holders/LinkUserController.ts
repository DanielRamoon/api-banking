import { HTTPRequest } from '../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  ok,
  unprocessable
} from '../../adapters/http/HttpResponseAdapter'
import { t } from '../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../helpers/ApplicationError'
import { ApplicationService } from '../../services/ApplicationService'

type LinkUserParams = {
  id: string
  user_id: string
  holderId: string
}

export default class LinkUserController implements HTTPRequest {
  private linkUserService: ApplicationService

  constructor(linkUserService: ApplicationService) {
    this.linkUserService = linkUserService
  }

  async handle({ id, user_id }: LinkUserParams): Promise<HttpResponse> {
    try {
      const updatedHolder = await this.linkUserService.run({ id, user_id })
      if (updatedHolder instanceof ApplicationError)
        return unprocessable(updatedHolder)
      return ok({
        holder: updatedHolder
      })
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
