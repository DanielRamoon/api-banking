/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplicationError } from '../../helpers/ApplicationError'
import VerifyTokenService from '../../services/VerifyTokenService'
import ApplicationAuthenticator from '../ApplicationAuthenticator'
import { unauthorized } from '../../adapters/http/HttpResponseAdapter'
import { NextFunction, Response, Request } from 'express'
import { t } from '../../config/i18next/I18nextLocalization'
import { ApplicationRepositoryHelper } from '../../helpers/ApplicationRepositoryHelper'

type VerifiedTokenProps = {
  id: string
  email: string
  type: string
}

export class Authorization implements Partial<ApplicationAuthenticator> {
  private applicationRepository: ApplicationRepositoryHelper
  verififyTokenService: VerifyTokenService

  constructor(applicationRepository: ApplicationRepositoryHelper) {
    this.applicationRepository = applicationRepository
    this.verififyTokenService = new VerifyTokenService()
  }

  public authorize = () => {
    return async (request: Request, response: Response, next: NextFunction) => {
      try {
        const authHeaders = request.headers.authorization

        if (!authHeaders) {
          return response
            .status(401)
            .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
        }

        const [, token] = authHeaders.split(/\s/)
        const verifiedToken = await this.verififyTokenService.run({ token })

        if (!verifiedToken) {
          console.log('verifiedToken', verifiedToken)
          return response
            .status(401)
            .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
        }

        if (verifiedToken instanceof ApplicationError) {
          return response
            .status(401)
            .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
        }

        const { email, type } = verifiedToken as VerifiedTokenProps
        const repositoryInstance =
          this.applicationRepository.getRepositoryInstance(type)

        const user: any = await repositoryInstance.findUser(type, email)

        if (user instanceof ApplicationError) {
          return response
            .status(401)
            .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
        }

        if (user.isBlocked) {
          return response
            .status(401)
            .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
        }

        request.user = user
        console.log('user', user)

        return next()
      } catch (error) {
        return response
          .status(500)
          .send(fail(new ApplicationError(t('error.internal'))))
      }
    }
  }
}
