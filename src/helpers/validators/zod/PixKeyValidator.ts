import { ZodObject, ZodRawShape, z } from 'zod'
import { ZodValidator } from './ZodValidator'
import { t } from '../../../config/i18next/I18nextLocalization'
import {
  EMAIL,
  EMAIL_REGEX,
  MAX_EMAIL_LENGTH,
  PHONE,
  PIX_PHONE_REGEX,
  POSSIBLE_PIX_TYPES
} from '../../constants'

export type PixKeyValidatorParams = {
  user_id: string
  zoop_account_id: string
  company_id: string
  wallet_id: string
  type: string
  value: string
}

export default class PixKeyValidator extends ZodValidator {
  constructor(pixKeyParams: PixKeyValidatorParams) {
    super(pixKeyParams)
  }

  public schema(): ZodObject<ZodRawShape> {
    return z
      .object({
        company_id: z.string().uuid({
          message: t('entity.company.error.id.format', {
            id: this.props.company_id
          })
        }),
        wallet_id: z.string().uuid({
          message: t('entity.wallet.error.id.format', {
            id: this.props.wallet_id
          })
        }),
        type: z
          .string({
            required_error: t('entity.operation.error.pixType.required')
          })
          .refine(
            value => {
              return POSSIBLE_PIX_TYPES.includes(value.toLowerCase())
            },
            value => ({
              message: t('entity.operation.error.pixType.invalid', {
                type: this.props.type,
                value
              })
            })
          ),
        value: z
          .string()
          .max(MAX_EMAIL_LENGTH, {
            message: t('entity.operation.error.pixValue.length', {
              length: MAX_EMAIL_LENGTH
            })
          })
          .transform(value => {
            return this.props.type === PHONE
              ? `+${value.replace(/[^\d]+/g, '')}`
              : value
          })
          .optional()
          .refine(
            value => {
              return this.validatePixValue(value || '')
            },
            value => ({
              message: t('entity.operation.error.pixValue.invalid', {
                type: this.props.type,
                value
              })
            })
          )
      })
      .required({
        company_id: true,
        type: true
      })
  }

  private validatePixValue(value: string): boolean {
    if (this.props.type === PHONE) {
      return PIX_PHONE_REGEX.test(value)
    }

    if (this.props.type === EMAIL) {
      return EMAIL_REGEX.test(value)
    }

    return true
  }
}
