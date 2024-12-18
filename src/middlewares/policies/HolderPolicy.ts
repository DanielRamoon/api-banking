import { NextFunction, Request, Response } from 'express'
import ApplicationUser from '../../entities/ApplicationUser'
import { unauthorized } from '../../adapters/http/HttpResponseAdapter'
import { ApplicationError } from '../../helpers/ApplicationError'
import { t } from '../../config/i18next/I18nextLocalization'
import Admin from '../../entities/Admin'

export class HolderPolicy {
  public canCreateHolder() {
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

  public canListHolder() {
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

  public canGetHolder() {
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

  public canUpdateHolder() {
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

  public canLinkUser() {
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

  public canUnlinkUser() {
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

  public canSendHolderDocuments() {
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
