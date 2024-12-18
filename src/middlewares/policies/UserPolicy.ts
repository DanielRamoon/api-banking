import { NextFunction, Request, Response } from 'express'
import ApplicationUser from '../../entities/ApplicationUser'
import User from '../../entities/User'
import { unauthorized } from '../../adapters/http/HttpResponseAdapter'
import { ApplicationError } from '../../helpers/ApplicationError'
import { t } from '../../config/i18next/I18nextLocalization'
import Admin from '../../entities/Admin'

export class UserPolicy {
  public canCreateUser() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { user } = request
      const { company_id } = request.body

      if (!user) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      if (
        !this.basicUserAccess(user, company_id) &&
        !this.basicAdminAccess(user)
      ) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      next()
    }
  }

  public canListUser() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { user } = request
      const company_id: string =
        request.query.company_id || request.body.company_id

      if (!user) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      if (
        !this.basicUserAccess(user, company_id) &&
        !this.basicAdminAccess(user)
      ) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      next()
    }
  }

  public canGetUserData() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { user } = request
      const id: string = request.params.id

      if (!user) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      if (!this.basicAdminAccess(user) && !this.currentUser(user, id)) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      next()
    }
  }

  public canUpdateUser() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { user } = request
      const company_id: string =
        request.query.company_id || request.body.company_id

      if (!user) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      if (
        !this.basicUserAccess(user, company_id) &&
        !this.basicAdminAccess(user)
      ) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      next()
    }
  }

  public canBlockOrUnblockUser() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { user } = request
      const company_id: string =
        request.query.company_id || request.body.company_id

      if (!user) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      if (
        !this.basicUserAccess(user, company_id) &&
        !this.basicAdminAccess(user)
      ) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      next()
    }
  }

  public canCompleteRegistration() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { user } = request
      const company_id: string =
        request.query.company_id || request.body.company_id

      if (!user) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }
      if (
        !this.basicUserAccess(user, company_id) &&
        !this.basicAdminAccess(user)
      ) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      next()
    }
  }

  public canUseTwoFactorAuthentication() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { user } = request
      const company_id: string =
        request.query.company_id || request.body.company_id

      if (!user) {
        return response
          .status(401)
          .send(unauthorized(new ApplicationError(t('error.unauthorized'))))
      }

      if (
        !this.basicUserAccess(user, company_id) &&
        !this.basicAdminAccess(user)
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
      console.log('basicUserAccess')
      const { companyId } = user.props
      console.log('companyId', companyId)
      console.log('company_id', company_id)

      return companyId === company_id
    }

    return false
  }

  private basicAdminAccess(user: ApplicationUser): boolean {
    return user instanceof Admin
    //return true
  }

  private currentUser(user: ApplicationUser, id: string): boolean {
    return user instanceof User && id === user.id
  }
}
