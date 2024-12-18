/* eslint-disable @typescript-eslint/no-explicit-any */
import UserRepository from '../../repositories/memory/UserRepository'
import AdminRepository from '../../repositories/memory/AdminRepository'
import AuthenticationService from '../../services/AuthenticationService'
import AuthenticationController from '../AuthenticationController'
import userMock from '../../__mocks__/entities/user-mock'
import adminMock from '../../__mocks__/entities/admin-mock'
import companyUserMock from '../../__mocks__/entities/company-user-mock'
import { ApplicationError } from '../../helpers/ApplicationError'
import { t } from '../../config/i18next/I18nextLocalization'
import VerifyTokenService from '../../services/VerifyTokenService'
import User from '../../entities/User'
import Admin from '../../entities/Admin'
import CompanyUserRepository from '../../repositories/memory/CompanyUserRepository'
import CompanyUser from '../../entities/CompanyUser'

let authenticationService: AuthenticationService

describe('AuthenticationController', () => {
  describe('When authenticating user', () => {
    let userRepository: UserRepository

    beforeAll(async () => {
      userRepository = new UserRepository()
      await userRepository.create(userMock)

      authenticationService = new AuthenticationService(userRepository)
    })

    it('should return clientError if type, email, or password is missing', async () => {
      const controller = new AuthenticationController(authenticationService)

      const missingType = await controller.handle({
        type: '',
        email: 'test@example.com',
        password: 'password'
      })

      const missingEmail = await controller.handle({
        type: 'user',
        email: '',
        password: 'password'
      })

      const missingPassword = await controller.handle({
        type: 'user',
        email: 'test@example.com',
        password: ''
      })

      expect(missingType.statusCode).toBe(400)
      expect(missingEmail.statusCode).toBe(400)
      expect(missingPassword.statusCode).toBe(400)
    })

    it('should return unauthorized if the authentication service returns an error', async () => {
      const controller = new AuthenticationController(authenticationService)
      const error = new ApplicationError(
        t('error.authentication.failed', {
          resource: 'user'
        })
      )

      const response = await controller.handle({
        type: 'user',
        email: 'test@example.com',
        password: 'password'
      })

      expect(response.statusCode).toBe(401)
      expect(response.body).toEqual({ error: error.message })
    })

    it('should return ok if the authentication service succeeds', async () => {
      const controller = new AuthenticationController(authenticationService)
      const successUser = ((await userRepository.find(userMock.id!)) as User)
        .serializable_hash
      const verifyTokenService = new VerifyTokenService()

      const response = await controller.handle({
        type: 'user',
        email: userMock.email,
        password: userMock.encryptedPassword!
      })

      const { token, user } = response.body
      const decryptedToken: any = await verifyTokenService.run({ token })

      expect(response.statusCode).toBe(200)

      expect(user).toEqual(successUser)

      expect(decryptedToken.email).toEqual(successUser.email)
      expect(decryptedToken.type).toEqual(successUser.resource)
    })
  })

  describe('When authenticating admin', () => {
    let adminRepository: AdminRepository

    beforeAll(async () => {
      adminRepository = new AdminRepository()
      await adminRepository.create(adminMock)

      authenticationService = new AuthenticationService(adminRepository)
    })

    it('should return clientError if type, email, or password is missing', async () => {
      const controller = new AuthenticationController(authenticationService)

      const missingType = await controller.handle({
        type: '',
        email: 'test@example.com',
        password: 'password'
      })

      const missingEmail = await controller.handle({
        type: 'admin',
        email: '',
        password: 'password'
      })

      const missingPassword = await controller.handle({
        type: 'admin',
        email: 'test@example.com',
        password: ''
      })

      expect(missingType.statusCode).toBe(400)
      expect(missingEmail.statusCode).toBe(400)
      expect(missingPassword.statusCode).toBe(400)
    })

    it('should return unauthorized if the authentication service returns an error', async () => {
      const controller = new AuthenticationController(authenticationService)
      const error = new ApplicationError(
        t('error.authentication.failed', {
          resource: 'admin'
        })
      )

      const response = await controller.handle({
        type: 'admin',
        email: 'test@example.com',
        password: 'password'
      })

      expect(response.statusCode).toBe(401)
      expect(response.body).toEqual({ error: error.message })
    })

    it('should return ok if the authentication service succeeds', async () => {
      const controller = new AuthenticationController(authenticationService)
      const successAdmin = (
        (await adminRepository.find(adminMock.id!)) as Admin
      ).serializable_hash
      const verifyTokenService = new VerifyTokenService()

      const response = await controller.handle({
        type: 'admin',
        email: adminMock.email,
        password: adminMock.encryptedPassword!
      })

      const { token, user } = response.body
      const decryptedToken: any = await verifyTokenService.run({ token })

      expect(response.statusCode).toBe(200)
      expect(user).toEqual(successAdmin)

      expect(decryptedToken.email).toEqual(successAdmin.email)
      expect(decryptedToken.type).toEqual(successAdmin.resource)
    })
  })

  describe('When authenticating company user', () => {
    let companyUserRepository: CompanyUserRepository

    beforeAll(async () => {
      companyUserRepository = new CompanyUserRepository()
      await companyUserRepository.create(companyUserMock)

      authenticationService = new AuthenticationService(companyUserRepository)
    })

    it('should return clientError if type, email, or password is missing', async () => {
      const controller = new AuthenticationController(authenticationService)

      const missingType = await controller.handle({
        type: '',
        email: 'test@example.com',
        password: 'password'
      })

      const missingEmail = await controller.handle({
        type: 'company_user',
        email: '',
        password: 'password'
      })

      const missingPassword = await controller.handle({
        type: 'company_user',
        email: 'test@example.com',
        password: ''
      })

      expect(missingType.statusCode).toBe(400)
      expect(missingEmail.statusCode).toBe(400)
      expect(missingPassword.statusCode).toBe(400)
    })

    it('should return unauthorized if the authentication service returns an error', async () => {
      const controller = new AuthenticationController(authenticationService)
      const error = new ApplicationError(
        t('error.authentication.failed', {
          resource: 'company_user'
        })
      )

      const response = await controller.handle({
        type: 'company_user',
        email: 'test@example.com',
        password: 'password'
      })

      expect(response.statusCode).toBe(401)
      expect(response.body).toEqual({ error: error.message })
    })

    it('should return ok if the authentication service succeeds', async () => {
      const controller = new AuthenticationController(authenticationService)
      const successAdmin = (
        (await companyUserRepository.find(companyUserMock.id!)) as CompanyUser
      ).serializable_hash
      const verifyTokenService = new VerifyTokenService()

      const response = await controller.handle({
        type: 'company_user',
        email: companyUserMock.email!,
        password: companyUserMock.encryptedPassword!
      })

      const { token, user } = response.body
      const decryptedToken: any = await verifyTokenService.run({ token })

      expect(response.statusCode).toBe(200)
      expect(user).toEqual(successAdmin)

      expect(decryptedToken.email).toEqual(successAdmin.email)
      expect(decryptedToken.type).toEqual(successAdmin.resource)
    })
  })
})
