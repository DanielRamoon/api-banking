import { ZodEffects, ZodObject, ZodRawShape, z } from 'zod'
import { ZodValidator } from './ZodValidator'
import { t } from '../../../config/i18next/I18nextLocalization'
import { PASSWORD_REGEX } from '../../constants'

export type PasswordValidatorParams = {
  password: string
  confirm: string
}

export default class PasswordValidator extends ZodValidator {
  constructor({ password, confirm }: PasswordValidatorParams) {
    super({ password, confirm })
  }

  public schema(): ZodEffects<ZodObject<ZodRawShape>> {
    return z
      .object({
        password: z
          .string({
            required_error: t('error.password.required')
          })
          .regex(PASSWORD_REGEX, {
            message: t('error.password.invalid.pattern')
          }),
        confirm: z
          .string({
            required_error: t('error.password.confirm.required')
          })
          .regex(PASSWORD_REGEX, {
            message: t('error.password.confirm.invalid.pattern')
          })
      })
      .required({
        password: true,
        confirm: true
      })
      .refine(({ password, confirm }) => password === confirm, {
        message: t('error.password.match'),
        path: ['confirm']
      })
  }
}
