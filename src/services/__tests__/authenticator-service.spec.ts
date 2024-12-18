import AuthenticationService from '../AuthenticationService'
import { ApplicationError } from '../../helpers/ApplicationError'
import UserRepository from '../../repositories/memory/UserRepository'
import userMock from '../../__mocks__/entities/user-mock'
import User from '../../entities/User'
import { t } from '../../config/i18next/I18nextLocalization'

describe('AuthenticationService', () => {
  let authService: AuthenticationService

  describe('when is an user', () => {
    let userRepository: UserRepository

    beforeAll(async () => {
      userRepository = new UserRepository()
      await userRepository.create(userMock)

      authService = new AuthenticationService(userRepository)
    })

    it('should return currentToken and currentUser on successful authentication', async () => {
      const authenticationProps = {
        type: 'user',
        email: userMock.email,
        password: 'hashed_password'
      }

      const result = (await authService.run(authenticationProps)) as User

      expect(result.id).toEqual(userMock.id)
    })

    it('should return an ApplicationError on failed authentication', async () => {
      const authenticationProps = {
        type: 'user',
        email: 'invalid@example.com',
        password: 'invalidPassword'
      }

      const result = (await authService.run(
        authenticationProps
      )) as ApplicationError

      expect(result).toBeInstanceOf(ApplicationError)
      expect(result.message).toBe(
        t('error.authentication.failed', {
          resource: authenticationProps.type
        })
      )
    })
  })
})
