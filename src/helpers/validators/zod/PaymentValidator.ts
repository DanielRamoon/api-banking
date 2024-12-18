import { ZodObject, ZodRawShape, z } from 'zod'
import { ZodValidator } from './ZodValidator'
import { t } from '../../../config/i18next/I18nextLocalization'
import { ApplicationProvider } from '../../../adapters/providers/ApplicationProvider'
import { ApplicationError } from '../../ApplicationError'
import { ApplicationHttpRequestProps } from '../../ApplicationHttpRequest'

export type PaymentValidatorParams = {
  user_id: string
  zoop_account_id: string
  company_id: string
  wallet_id: string
  bar_code: string
  amount: number
  interest?: number
  discount?: number
}

export default class PaymentValidator extends ZodValidator {
  private paymentParams: PaymentValidatorParams
  private validateBarCodeProvider: ApplicationProvider

  constructor(
    paymentParams: PaymentValidatorParams,
    validateBarCodeProvider: ApplicationProvider
  ) {
    super(paymentParams)
    this.paymentParams = paymentParams
    this.validateBarCodeProvider = validateBarCodeProvider
  }

  public schema(): ZodObject<ZodRawShape> {
    return z
      .object({
        company_id: z.string().uuid({
          message: t('entity.company.error.id.format', {
            id: this.paymentParams.company_id
          })
        }),
        wallet_id: z.string().uuid({
          message: t('entity.wallet.error.id.format', {
            id: this.paymentParams.wallet_id
          })
        }),
        bar_code: z
          .string({
            required_error: t('entity.operation.error.barCode.required', {
              value: this.paymentParams.bar_code
            })
          })
          .refine(
            async value => {
              return await this.validBarCode(value)
            },
            value => ({
              message: t('entity.operation.error.barCode.invalid', { value })
            })
          ),
        amount: z
          .number({
            invalid_type_error: t('entity.operation.error.amountCents.type')
          })
          .int({ message: t('entity.operation.error.amountCents.type') })
          .gte(1000, {
            message: t('entity.operation.error.amountCents.value')
          }),
        interest: z
          .number()
          .gte(0, { message: t('entity.operation.error.interest.invalid') })
          .optional(),
        discount: z
          .number()
          .gte(0, { message: t('entity.operation.error.discount.invalid') })
          .optional()
      })
      .required({
        company_id: true,
        bar_code: true,
        amount: true
      })
  }

  private async validBarCode(barCode: string): Promise<boolean> {
    const _barCode = await this.validateBarCodeProvider.execute({
      barCode,
      accountId: this.paymentParams.zoop_account_id
    })
    if (_barCode instanceof ApplicationError) return false
    const { withError } = _barCode as ApplicationHttpRequestProps

    return !withError
  }
}
