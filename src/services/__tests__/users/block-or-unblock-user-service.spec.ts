import { describe, expect, it, afterEach, beforeAll } from '@jest/globals'
import { BlockOrUnblockUserService } from '../../users/BlockOrUnblockUserService'
import { IUserRepository } from '../../../repositories/IUserRepository'
import User from '../../../entities/User'
import { ApplicationError } from '../../../helpers/ApplicationError'
import UserRepository from '../../../repositories/memory/UserRepository'
import userMock from '../../../__mocks__/entities/user-mock'
import { ApplicationService } from '../../ApplicationService'
import { t } from '../../../config/i18next/I18nextLocalization'

let userRepository: IUserRepository
let userService: ApplicationService

describe('BlockOrUnblockUserService', () => {
  beforeAll(async () => {
    userRepository = new UserRepository()
    userService = new BlockOrUnblockUserService(userRepository)
    await userRepository.create(userMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should block a user when is_blocked is "true"', async () => {
    const inputParams = { id: userMock.id, is_blocked: 'true' }

    const result = (await userService.run(inputParams)) as User

    expect(result.isBlocked).toEqual(true)
  })

  it('should unblock a user when is_blocked is "false"', async () => {
    const inputParams = { id: userMock.id, is_blocked: 'false' }

    const result = (await userService.run(inputParams)) as User

    expect(result.isBlocked).toEqual(false)
  })

  it('should return an ApplicationError for invalid is_blocked value', async () => {
    const inputParams = { id: userMock.id!, is_blocked: 'invalid-value' }

    const result = await userService.run(inputParams)

    expect(result).toEqual(new ApplicationError(t('error.values.invalid')))
  })
})
