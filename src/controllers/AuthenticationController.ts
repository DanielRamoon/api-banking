/* eslint-disable @typescript-eslint/no-explicit-any */
import { HTTPRequest } from '../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  clientError,
  fail,
  ok,
  unauthorized
} from '../adapters/http/HttpResponseAdapter'
import { t } from '../config/i18next/I18nextLocalization'
import { ApplicationError } from '../helpers/ApplicationError'
import { ApplicationService } from '../services/ApplicationService'
import CreateTokenService from '../services/CreateTokenService'

export type AuthenticationProps = {
  type: string
  email: string
  password: string
}

export default class AuthenticationController implements HTTPRequest {
  private authenticationService: ApplicationService
  createTokenService: CreateTokenService

  constructor(authenticationService: ApplicationService) {
    this.authenticationService = authenticationService
    this.createTokenService = new CreateTokenService()
  }

  async handle({
    type,
    email,
    password
  }: AuthenticationProps): Promise<HttpResponse> {
    try {
      if (!type || !email || !password) {
        return clientError(
          new ApplicationError(
            t('error.authentication.failed', {
              resource: type
            })
          )
        )
      }

      const result: any = await this.authenticationService.run({
        type,
        email,
        password
      })

      if (result instanceof ApplicationError) return unauthorized(result)

      const token = await this.createTokenService.run({
        payload: { id: result.id, email, type }
      })

      return ok({
        token,
        user: result
      })
    } catch (error: any) {
      return fail(new ApplicationError(error.message))
    }
  }
}
