import { Request, Response, NextFunction } from 'express'
import Admin from '../../entities/Admin'
import { unauthorized } from '../../adapters/http/HttpResponseAdapter'
import { ApplicationError } from '../../helpers/ApplicationError'
import { t } from '../../config/i18next/I18nextLocalization'

export class CompanyPolicy {
  public canListCompany() {
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

  public canCreateCompany() {
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

  public canUpdateCompany() {
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

  public canBlockOrUnblockCompany() {
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

  private basicAdminAccess(user: object): boolean {
    return user instanceof Admin
  }
}
