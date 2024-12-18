import { describe, expect, it } from '@jest/globals'
import PasswordValidator from '../PasswordValidator'
import { t } from '../../../../config/i18next/I18nextLocalization'

describe('PasswordValidator', () => {
  it('should validate valid user parameters', async () => {
    const validPassword = { password: 'p@ssw0rD', confirm: 'p@ssw0rD' }
    const passwordValidator = new PasswordValidator(validPassword)

    expect(() => passwordValidator.schema().parse(validPassword)).not.toThrow()
    expect(await passwordValidator.validate()).toBe(true)
    expect(await passwordValidator.errors()).toEqual([])
  })

  it('should throw validation error for missing password', async () => {
    const invalidPassword = { password: '', confirm: 'inv@L1d' }
    const passwordValidator = new PasswordValidator(invalidPassword)

    expect(await passwordValidator.validate()).toBe(false)
    expect(await passwordValidator.errors()).toContain(
      t('error.password.invalid.pattern')
    )
  })

  it('should throw validation error for missing confirm', async () => {
    const invalidPassword = { password: 'password', confirm: '' }
    const passwordValidator = new PasswordValidator(invalidPassword)

    expect(await passwordValidator.validate()).toBe(false)
    expect(await passwordValidator.errors()).toContain(
      t('error.password.confirm.invalid.pattern')
    )
  })

  it('should throw validation error for passwords mismatch', async () => {
    const invalidPassword = { password: 'pass', confirm: 'word' }
    const passwordValidator = new PasswordValidator(invalidPassword)

    expect(await passwordValidator.validate()).toBe(false)
    expect(await passwordValidator.errors()).toContain(
      t('error.password.match')
    )
  })
})
