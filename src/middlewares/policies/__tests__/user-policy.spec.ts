/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from 'express'
import { UserPolicy } from '../UserPolicy'
import User from '../../../entities/User'
import { ApplicationError } from '../../../helpers/ApplicationError'
import { unauthorized } from '../../../adapters/http/HttpResponseAdapter'
import userMock from '../../../__mocks__/entities/user-mock'
import { t } from '../../../config/i18next/I18nextLocalization'

describe('UserPolicy', () => {
  describe('When the user can access users features', () => {
    it('should return 401 unauthorized if user is not provided', async () => {
      const policy = new UserPolicy()
      const request = {
        body: { company_id: userMock.companyId }
      } as Request
      const response = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      } as any
      const next = jest.fn()

      await policy.canCreateUser()(request, response, next)

      expect(response.status).toHaveBeenCalledWith(401)
      expect(response.send).toHaveBeenCalledWith(
        unauthorized(new ApplicationError(t('error.unauthorized')))
      )
      expect(next).not.toHaveBeenCalled()
    })

    it('should return 401 unauthorized if user is not an instance of User', async () => {
      const policy = new UserPolicy()
      const request = {
        body: { company_id: userMock.companyId },
        user: {}
      } as Request
      const response = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      } as any
      const next = jest.fn()

      await policy.canCreateUser()(request, response, next)

      expect(response.status).toHaveBeenCalledWith(401)
      expect(response.send).toHaveBeenCalledWith(
        unauthorized(new ApplicationError(t('error.unauthorized')))
      )
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next() if user is an instance of User', async () => {
      const policy = new UserPolicy()
      const user = new User(userMock) // Assuming user is properly initialized
      const request = {
        user,
        body: { company_id: userMock.companyId }
      } as any
      const response = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      } as any
      const next = jest.fn()

      await policy.canCreateUser()(request, response, next)

      expect(response.status).not.toHaveBeenCalled()
      expect(response.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })
  })
})
