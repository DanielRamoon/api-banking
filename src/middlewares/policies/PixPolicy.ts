import { NextFunction, Request, Response } from 'express'
import ApplicationUser from '../../entities/ApplicationUser'
import User from '../../entities/User'
import { unauthorized } from '../../adapters/http/HttpResponseAdapter'
import { ApplicationError } from '../../helpers/ApplicationError'
import { t } from '../../config/i18next/I18nextLocalization'

export class PixPolicy {
  public canCreatePixKey() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { user } = request
      const id: string = user.id
      const company_id: string =
        request.query.company_id || request.body.company_id

      if (!user) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      if (
        !this.basicUserAccess(user, company_id) ||
        !this.currentUser(user, id)
      ) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      next()
    }
  }

  public canListPixKeys() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { user } = request
      const id: string = user.id
      const company_id: string =
        request.query.company_id || request.body.company_id

      if (!user) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      if (
        !this.basicUserAccess(user, company_id) ||
        !this.currentUser(user, id)
      ) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      next()
    }
  }

  public canGetPixByKey() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { user } = request
      const id: string = user.id
      const company_id: string =
        request.query.company_id || request.body.company_id

      if (!user) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      if (
        !this.basicUserAccess(user, company_id) ||
        !this.currentUser(user, id)
      ) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      next()
    }
  }

  private basicUserAccess(user: ApplicationUser, company_id: string): boolean {
    if (user instanceof User) {
      const { companyId } = user.props

      return companyId === company_id
    }

    return false
  }

  private currentUser(user: ApplicationUser, id: string): boolean {
    return user instanceof User && id === user.id
  }
}
