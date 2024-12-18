/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from 'express'
import { CompanyPolicy } from '../CompanyPolicy'
import Admin from '../../../entities/Admin'
import { ApplicationError } from '../../../helpers/ApplicationError'
import { unauthorized } from '../../../adapters/http/HttpResponseAdapter'
import adminMock from '../../../__mocks__/entities/admin-mock'
import { t } from '../../../config/i18next/I18nextLocalization'

describe('CompanyPolicy', () => {
  describe('When the user can access company features', () => {
    it('should return 401 unauthorized if user is not provided', async () => {
      const policy = new CompanyPolicy()
      const request = {} as Request
      const response = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      } as any
      const next = jest.fn()

      await policy.canListCompany()(request, response, next)

      expect(response.status).toHaveBeenCalledWith(401)
      expect(response.send).toHaveBeenCalledWith(
        unauthorized(new ApplicationError(t('error.unauthorized')))
      )
      expect(next).not.toHaveBeenCalled()
    })

    it('should return 401 unauthorized if user is not an instance of Admin', async () => {
      const policy = new CompanyPolicy()
      const request = { user: {} } as Request
      const response = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      } as any
      const next = jest.fn()

      await policy.canListCompany()(request, response, next)

      expect(response.status).toHaveBeenCalledWith(401)
      expect(response.send).toHaveBeenCalledWith(
        unauthorized(new ApplicationError(t('error.unauthorized')))
      )
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next() if user is an instance of Admin', async () => {
      const policy = new CompanyPolicy()
      const adminUser = new Admin(adminMock) // Assuming Admin is properly initialized
      const request = { user: adminUser } as any
      const response = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      } as any
      const next = jest.fn()

      await policy.canListCompany()(request, response, next)

      expect(response.status).not.toHaveBeenCalled()
      expect(response.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })
  })
})
