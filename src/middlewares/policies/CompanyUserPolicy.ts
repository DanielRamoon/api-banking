import { NextFunction, Request, Response } from 'express'
import { unauthorized } from '../../adapters/http/HttpResponseAdapter'
import { ApplicationError } from '../../helpers/ApplicationError'
import { t } from '../../config/i18next/I18nextLocalization'
import Admin from '../../entities/Admin'
import ApplicationUser from '../../entities/ApplicationUser'
import CompanyUser, { Role } from '../../entities/CompanyUser'

export class CompanyUserPolicy {
  public canCreateCompanyUser() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { user } = request

      if (!user) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      if (!this.basicAdminAccess(user) && !this.isCompanyUserOwner(user)) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      next()
    }
  }

  public canUpdateCompanyUser() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { user } = request

      if (!user) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      if (!this.basicAdminAccess(user) && !this.isCompanyUserOwner(user)) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      next()
    }
  }

  public canListCompanyUser() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { user } = request

      if (!user) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      if (!this.basicAdminAccess(user) && !this.isCompanyUserOwner(user)) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      next()
    }
  }

  public canGetCompanyUser() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { user } = request

      if (!user) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      if (!this.basicAdminAccess(user) && !this.isCompanyUserOwner(user)) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      next()
    }
  }

  public canDeleteCompanyUser() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { user } = request

      if (!user) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      if (!this.basicAdminAccess(user) && !this.isCompanyUserOwner(user)) {
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

  private isCompanyUserOwner(user: ApplicationUser): boolean {
    return user instanceof CompanyUser && user.role === Role.owner
  }
}
