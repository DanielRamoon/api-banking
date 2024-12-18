import { describe, expect, it, afterEach, beforeAll } from '@jest/globals'
import { ListUsersService } from '../../users/ListUsersService'
import { IUserRepository } from '../../../repositories/IUserRepository'
import User from '../../../entities/User'
import UserRepository from '../../../repositories/memory/UserRepository'
import { ApplicationService } from '../../ApplicationService'
import userMock from '../../../__mocks__/entities/user-mock'

let userRepository: IUserRepository
let userService: ApplicationService

type ResultProps = {
  total_items: number
  per_page: number
  current_page: number
  has_more_items: boolean
  next_page: number
  items: []
}

describe('ListUsersService', () => {
  beforeAll(async () => {
    userRepository = new UserRepository()
    userService = new ListUsersService(userRepository)
    await userRepository.create(userMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should list users with valid parameters', async () => {
    const inputParams = {
      companyId: 'company123',
      search: 'John',
      page: 1,
      perPage: 10
    }

    const users = [new User(userMock)]
    const result = (await userService.run(inputParams)) as ResultProps

    expect(result.total_items).toBe(users.length)
    expect(result.per_page).toBe(inputParams.perPage)
    expect(result.current_page).toBe(inputParams.page)
    expect(result.next_page).toBe(null)
    expect(result.has_more_items).toBe(false)
  })
})
