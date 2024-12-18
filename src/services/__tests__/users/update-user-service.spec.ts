import { describe, expect, it, afterEach, beforeAll } from '@jest/globals'
import { UpdateUserService } from '../../users/UpdateUserService'
import { IUserRepository } from '../../../repositories/IUserRepository'
import User from '../../../entities/User'
import { ApplicationError } from '../../../helpers/ApplicationError'
import UserRepository from '../../../repositories/memory/UserRepository'
import { ApplicationService } from '../../ApplicationService'
import userMock from '../../../__mocks__/entities/user-mock'
import { t } from '../../../config/i18next/I18nextLocalization'

let userRepository: IUserRepository
let userService: ApplicationService

describe('UpdateUserService', () => {
  beforeAll(async () => {
    userRepository = new UserRepository()
    userService = new UpdateUserService(userRepository)
    await userRepository.create(userMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should update a user with valid parameters', async () => {
    const inputParams = {
      id: userMock.id,
      name: 'Updated Name',
      email: 'updated@example.com',
      phone: '923456789',
      phonePrefix: '99'
    }

    const result = (await userService.run(inputParams)) as User

    expect(result.name).toBe('Updated Name')
    expect(result.email).toBe('updated@example.com')
    expect(result.phone).toBe('(99) 9 2345-6789')
  })

  it('should return an ApplicationError if user update fails', async () => {
    const inputParams = {
      id: null,
      name: 'Updated Name',
      email: 'updated@example.com',
      phone: '1234567890',
      phonePrefix: '1'
    }

    const result = await userService.run(inputParams)

    expect(result).toEqual(
      new ApplicationError(t('error.updating', { resource: 'user' }))
    )
  })
})
