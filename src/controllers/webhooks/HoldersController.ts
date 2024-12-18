import { HolderWebhookTypes } from '../../@types/zoop/HolderTypes'
import { HTTPRequest } from '../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  accepted,
  fail,
  notFound,
  ok
} from '../../adapters/http/HttpResponseAdapter'
import { t } from '../../config/i18next/I18nextLocalization'
import Holder from '../../entities/Holder'
import { ApplicationError } from '../../helpers/ApplicationError'
import { HOLDER_EVENTS, PING } from '../../helpers/constants'
import { ApplicationService } from '../../services/ApplicationService'

type HolderParams = {
  payload: {
    type: string
    object: HolderWebhookTypes
  }
}

export default class HoldersController implements HTTPRequest {
  private getHolderService: ApplicationService
  private updatetHolderService: ApplicationService

  constructor(
    getHolderService: ApplicationService,
    updatetHolderService: ApplicationService
  ) {
    this.getHolderService = getHolderService
    this.updatetHolderService = updatetHolderService
  }

  async handle({ payload }: HolderParams): Promise<HttpResponse> {
    try {
      if (payload.type === PING) return ok({ message: 'Ok' })

      if (HOLDER_EVENTS.includes(payload.type)) {
        const holderOrError = await this.getHolderService.run({
          id: payload.object.id
        })

        if (holderOrError instanceof ApplicationError)
          return notFound(holderOrError)

        const holder = holderOrError as Holder
        const updatedHolder = await this.updatetHolderService.run({
          ...holder,
          zoopHolderStatus: payload.object.status
        })

        if (updatedHolder instanceof ApplicationError)
          return fail(new ApplicationError(t('error.internal')))

        return ok({ message: 'Ok' })
      }

      return accepted()
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
