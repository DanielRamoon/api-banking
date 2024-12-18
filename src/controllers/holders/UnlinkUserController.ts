import { HTTPRequest } from '../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  ok,
  unprocessable
} from '../../adapters/http/HttpResponseAdapter'
import { t } from '../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../helpers/ApplicationError'
import { ApplicationService } from '../../services/ApplicationService'

type UnlinkUserParams = {
  id: string
  user_id: string
}

export default class UnlinkUserController implements HTTPRequest {
  private unlinkUserService: ApplicationService

  constructor(unlinkUserService: ApplicationService) {
    this.unlinkUserService = unlinkUserService
  }

  async handle({ id, user_id }: UnlinkUserParams): Promise<HttpResponse> {
    try {
      const updatedHolder = await this.unlinkUserService.run({ id, user_id })

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
