import PasswordHelper from '../PasswordHelper'
import { describe, expect, it } from '@jest/globals'

describe('PasswordHelper', () => {
  it('should encrypt and compare passwords', async () => {
    const plainPassword = 'password123'
    const hashedPassword = await PasswordHelper.encrypt(plainPassword)

    expect(hashedPassword).not.toBe(plainPassword)

    const isMatch = await PasswordHelper.compare(plainPassword, hashedPassword)
    expect(isMatch).toBe(true)
  })

  it('should return false for incorrect password comparison', async () => {
    const correctPassword = 'correctPassword'
    const incorrectPassword = 'incorrectPassword'
    const hashedPassword = await PasswordHelper.encrypt(correctPassword)

    const isMatch = await PasswordHelper.compare(
      incorrectPassword,
      hashedPassword
    )
    expect(isMatch).toBe(false)
  })
})
