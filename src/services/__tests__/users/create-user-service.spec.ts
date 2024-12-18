import { describe, expect, it, afterEach, beforeAll } from '@jest/globals'
import { CreateUserService } from '../../users/CreateUserService'
import { IUserRepository } from '../../../repositories/IUserRepository'
import { IHolderRepository } from '../../../repositories/IHolderRepository'
import User from '../../../entities/User'
import { ApplicationError } from '../../../helpers/ApplicationError'
import UserRepository from '../../../repositories/memory/UserRepository'
import { ApplicationService } from '../../ApplicationService'
import holderMock from '../../../__mocks__/entities/holder-mock'
import userMock from '../../../__mocks__/entities/user-mock'
import HolderRepository from '../../../repositories/memory/HolderRepository'
import { t } from '../../../config/i18next/I18nextLocalization'

let userRepository: IUserRepository
let holderRepository: IHolderRepository
let userService: ApplicationService

describe('CreateUserService', () => {
  beforeAll(async () => {
    userRepository = new UserRepository()
    holderRepository = new HolderRepository()
    userService = new CreateUserService(userRepository, holderRepository)
    await holderRepository.create(holderMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a user with valid parameters', async () => {
    const result = (await userService.run(userMock)) as User

    expect(result.name).toBe(userMock.name)
    expect(result.email).toBe(userMock.email)
  })

  it('should return an ApplicationError if holder retrieval fails', async () => {
    const inputParams = {
      name: 'John Doe',
      companyId: 'company123',
      phone: '1234567890',
      phonePrefix: '+1',
      encryptedPassword: 'hashed_password'
    }

    const result = await userService.run(inputParams)

    expect(result).toEqual(
      new ApplicationError(t('error.creating', { resource: 'user' }))
    )
  })
})
