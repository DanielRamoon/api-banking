import { NextFunction, Request, Response } from 'express'
import ApplicationUser from '../../entities/ApplicationUser'
import { unauthorized } from '../../adapters/http/HttpResponseAdapter'
import { ApplicationError } from '../../helpers/ApplicationError'
import { t } from '../../config/i18next/I18nextLocalization'
import Admin from '../../entities/Admin'

export class AdminPolicy {
  public canCreateAdmin() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { user } = request

      if (!user) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      if (!this.basicAdminAccess(user)) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      next()
    }
  }

  public canListAdmin() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { user } = request

      if (!user) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      if (!this.basicAdminAccess(user)) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      next()
    }
  }

  public canGetAdminDetails() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { user } = request

      if (!user) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      if (!this.basicAdminAccess(user)) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      next()
    }
  }

  public canUpdateAdmin() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { user } = request

      if (!user) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      if (!this.basicAdminAccess(user)) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      next()
    }
  }

  public canDeleteAdmin() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { user } = request

      if (!user) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      if (!this.basicAdminAccess(user)) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      next()
    }
  }

  public canListLogs() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { user } = request

      if (!user) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      if (!this.basicAdminAccess(user)) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      next()
    }
  }

  private basicAdminAccess(user: ApplicationUser): boolean {
    return user instanceof Admin
  }
}
