import { describe, expect, it, beforeAll } from '@jest/globals'
import userMock from '../../../../__mocks__/entities/user-mock'
import UserValidator from '../UserValidator'
import { t } from '../../../../config/i18next/I18nextLocalization'
import { UserProps } from '../../../../entities/User'
import { IUserRepository } from '../../../../repositories/IUserRepository'
import UserRepository from '../../../../repositories/memory/UserRepository'

let userRepository: IUserRepository

beforeAll(() => {
  userRepository = new UserRepository()
})

describe('UserValidator', () => {
  it('should validate valid user parameters', async () => {
    const userValidator = new UserValidator(userMock, userRepository)

    expect(() => userValidator.schema().parseAsync(userMock)).not.toThrow()
    expect(await userValidator.validate()).toBe(true)
    expect(await userValidator.errors()).toEqual([])
  })

  it('should throw validation error for missing email', async () => {
    const invalidUserParams: UserProps = { ...userMock, email: '' }
    const userValidator = new UserValidator(invalidUserParams, userRepository)

    expect(() => userValidator.schema().parseAsync(userMock)).not.toThrow()
    expect(await userValidator.validate()).toBe(false)
    expect(await userValidator.errors()).toContain(
      t('entity.user.error.email.format', { email: '' })
    )
  })

  it('should throw validation error for invalid email format', async () => {
    const invalidUserParams: UserProps = { ...userMock, email: 'invalidemail' }
    const userValidator = new UserValidator(invalidUserParams, userRepository)

    expect(await userValidator.validate()).toBe(false)
    expect(await userValidator.errors()).toContain(
      t('entity.user.error.email.format', { email: 'invalidemail' })
    )
  })

  it('should throw validation error for missing phone', async () => {
    const invalidUserParams: UserProps = { ...userMock, phone: '' }
    const userValidator = new UserValidator(invalidUserParams, userRepository)

    expect(await userValidator.validate()).toBe(false)
    expect(await userValidator.errors()).toContain(
      t('entity.user.error.phone.format', { phone: invalidUserParams.phone })
    )
  })

  it('should throw validation error for invalid phone format', async () => {
    const invalidUserParams: UserProps = { ...userMock, phone: '123' }
    const userValidator = new UserValidator(invalidUserParams, userRepository)

    expect(await userValidator.validate()).toBe(false)
    expect(await userValidator.errors()).toContain(
      t('entity.user.error.phone.format', { phone: invalidUserParams.phone })
    )
  })

  it('should throw validation error for missing phone prefix', async () => {
    const invalidUserParams: UserProps = { ...userMock, phonePrefix: '' }
    const userValidator = new UserValidator(invalidUserParams, userRepository)

    expect(await userValidator.validate()).toBe(false)
    expect(await userValidator.errors()).toContain(
      t('entity.user.error.phone_prefix.format', {
        phone_prefix: invalidUserParams.phonePrefix
      })
    )
  })

  it('should throw validation error for invalid phone prefix format', async () => {
    const invalidUserParams: UserProps = { ...userMock, phonePrefix: '1' }
    const userValidator = new UserValidator(invalidUserParams, userRepository)

    expect(await userValidator.validate()).toBe(false)
    expect(await userValidator.errors()).toContain(
      t('entity.user.error.phone_prefix.format', {
        phone_prefix: invalidUserParams.phonePrefix
      })
    )
  })
})
