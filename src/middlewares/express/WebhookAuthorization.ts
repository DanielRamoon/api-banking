/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplicationError } from '../../helpers/ApplicationError'
import ApplicationAuthenticator from '../ApplicationAuthenticator'
import { unauthorized } from '../../adapters/http/HttpResponseAdapter'
import { NextFunction, Response, Request } from 'express'
import { t } from '../../config/i18next/I18nextLocalization'

export class WebhookAuthorization implements Partial<ApplicationAuthenticator> {
  #authorization = process.env.WEBHOOK_AUTHORIZATION

  public authorize = () => {
    return async (request: Request, response: Response, next: NextFunction) => {
      try {
        const authHeaders = request.headers.authorization

        if (
          !authHeaders ||
          !this.#authorization ||
          authHeaders !== this.#authorization
        ) {
          return response
            .status(401)
            .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
        }

        return next()
      } catch (error) {
        return response
          .status(500)
          .send(fail(new ApplicationError(t('error.internal'))))
      }
    }
  }
}
