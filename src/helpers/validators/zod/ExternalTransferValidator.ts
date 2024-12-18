import { ZodObject, ZodRawShape, z } from 'zod'
import { ZodValidator } from './ZodValidator'
import { t } from '../../../config/i18next/I18nextLocalization'

export type ExternalTransferParams = {
  user_id: string
  zoop_account_id: string
  company_id: string
  wallet_id: string
  amount: number
  description?: string
  reference_id?: string
  purpose_code?: string
  bank_code: string
  routing_number: string
  routing_check_digit: string
  account_number: number
  account_check_digit: string
}

export default class ExternalTransferValidator extends ZodValidator {
  private externalTransferParams: ExternalTransferParams

  constructor(externalTransferParams: ExternalTransferParams) {
    super(externalTransferParams)
    this.externalTransferParams = externalTransferParams
  }

  public schema(): ZodObject<ZodRawShape> {
    return z
      .object({
        company_id: z.string().uuid({
          message: t('entity.company.error.id.format', {
            id: this.externalTransferParams.company_id
          })
        }),
        wallet_id: z.string().uuid({
          message: t('entity.wallet.error.id.format', {
            id: this.externalTransferParams.wallet_id
          })
        }),
        bank_code: z
          .string({
            required_error: t('entity.operation.error.bankCode.required')
          })
          .nonempty({
            message: t('entity.operation.error.bankCode.required')
          }),
        routing_number: z
          .string({
            required_error: t('entity.operation.error.routingNumber.required')
          })
          .nonempty({
            message: t('entity.operation.error.routingNumber.required')
          }),
        routing_check_digit: z
          .string({
            required_error: t(
              'entity.operation.error.routingCheckDigit.required'
            )
          })
          .nonempty({
            message: t('entity.operation.error.routingCheckDigit.required')
          }),
        description: z
          .string({
            required_error: t('entity.operation.error.description.required', {
              value: this.externalTransferParams.description
            })
          })
          .nonempty({
            message: t('entity.operation.error.description.required')
          }),
        amount: z
          .number({
            invalid_type_error: t('entity.operation.error.amountCents.type')
          })
          .int({ message: t('entity.operation.error.amountCents.type') })
          .gte(1000, {
            message: t('entity.operation.error.amountCents.value')
          }),
        account_number: z
          .number({
            errorMap: () => {
              return {
                message: t('entity.operation.error.accountNumber.invalid')
              }
            }
          })
          .gte(0, {
            message: t('entity.operation.error.accountNumber.invalid')
          })
          .positive({
            message: t('entity.operation.error.accountNumber.invalid')
          }),
        account_check_digit: z
          .string({
            required_error: t(
              'entity.operation.error.accountCheckDigit.required'
            )
          })
          .nonempty({
            message: t('entity.operation.error.accountCheckDigit.required')
          })
      })
      .required({
        company_id: true,
        bank_code: true,
        amount: true,
        routing_number: true,
        routing_check_digit: true,
        account_number: true,
        account_check_digit: true
      })
  }
}
