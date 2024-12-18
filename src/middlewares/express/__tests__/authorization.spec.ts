/* eslint-disable @typescript-eslint/no-explicit-any */
import { Authorization } from '../Authorization'
import { ApplicationError } from '../../../helpers/ApplicationError'
import * as HttpResponseAdapter from '../../../adapters/http/HttpResponseAdapter'
import CreateTokenService from '../../../services/CreateTokenService'
import { t } from '../../../config/i18next/I18nextLocalization'
import UserRepository from '../../../repositories/memory/UserRepository'
import userMock from '../../../__mocks__/entities/user-mock'
import User from '../../../entities/User'
import { MemoryRepositoryHelper } from '../../../repositories/memory/MemoryRepositoryHelper'

// Create a spy for the unauthorized function
const unauthorizedSpy = jest.spyOn(HttpResponseAdapter, 'unauthorized')

describe('Authorization', () => {
  const userRepository = new UserRepository()
  const applicationRepository = new MemoryRepositoryHelper()
  const authorization: Authorization = new Authorization(applicationRepository)

  beforeAll(async () => {
    await userRepository.create(userMock)
    unauthorizedSpy.mockClear()
  })

  it('should call next when token verification succeeds and is the correct user', async () => {
    const createTokenService = new CreateTokenService()
    const validToken = await createTokenService.run({
      payload: {
        id: userMock.id,
        email: userMock.email,
        type: userMock.resource
      }
    })

    const request = {
      headers: { authorization: `Bearer ${validToken}` }
    } as any
    const response = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    } as any
    const next = jest.fn()

    await authorization.authorize()(request, response, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(request.user).toBeInstanceOf(User)
    expect(request.user.id).toBe(userMock.id)
  })

  it('should return 401 not found when no authorized user is present', async () => {
    const createTokenService = new CreateTokenService()
    const validToken = await createTokenService.run({
      payload: {
        id: '123',
        email: '123@email.com',
        type: 'user'
      }
    })

    const request = {
      headers: { authorization: `Bearer ${validToken}` }
    } as any
    const response = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    } as any
    const next = jest.fn()

    await authorization.authorize()(request, response, next)

    expect(next).not.toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(401)
    expect(response.send).toHaveBeenCalledWith(
      HttpResponseAdapter.unauthorized(
        new ApplicationError(
          t('error.unauthorized', {
            resource: 'user'
          })
        )
      )
    )
  })

  it('should return 401 unauthorized when no authorization header is present', async () => {
    const request = { headers: {} } as any
    const response = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    } as any
    const next = jest.fn()

    await authorization.authorize()(request, response, next)

    expect(next).not.toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(401)
    expect(response.send).toHaveBeenCalledWith(
      HttpResponseAdapter.unauthorized(
        new ApplicationError(t('error.unauthorized'))
      )
    )
  })

  it('should return 401 unauthorized when token verification fails', async () => {
    const request = {
      headers: { authorization: 'Bearer invalid-token' }
    } as any
    const response = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    } as any
    const next = jest.fn()

    await authorization.authorize()(request, response, next)

    expect(next).not.toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(401)
    expect(response.send).toHaveBeenCalledWith(
      HttpResponseAdapter.unauthorized(
        new ApplicationError(t('error.unauthorized'))
      )
    )
  })
})
