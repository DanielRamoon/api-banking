import { OperationProps } from '../../../entities/Operation'
import { ZodValidator } from './ZodValidator'
import { t } from '../../../config/i18next/I18nextLocalization'
import { z, ZodObject, ZodRawShape } from 'zod'
import { CURRENCY_LENGTH } from '../../constants'

export default class OperationValidator extends ZodValidator {
  operationParams: OperationProps

  constructor(operationParams: OperationProps) {
    super(operationParams)
    this.operationParams = operationParams
  }

  public schema(): ZodObject<ZodRawShape> {
    return z
      .object({
        id: z
          .string()
          .uuid({
            message: t('entity.operation.error.id.format', {
              id: this.operationParams.id
            })
          })
          .optional(),
        zoopOperationId: z.string().uuid({
          message: t('entity.operation.error.zoopOperationId.format', {
            operationId: this.operationParams.zoopOperationId
          })
        }),
        type: z.string().min(1, {
          message: t('entity.operation.error.type.format', {
            type: this.operationParams.type
          })
        }),
        amountCents: z.number().nonnegative({
          message: t('entity.operation.error.amountCents.value', {
            value: this.operationParams.amountCents
          })
        }),
        currency: z.string().length(CURRENCY_LENGTH, {
          message: t('entity.operation.error.currency.length', {
            currency: this.operationParams.currency
          })
        }),
        holderId: z
          .string()
          .uuid({
            message: t('entity.operation.error.holderId.format', {
              id: this.operationParams.holderId
            })
          })
          .nullable(),
        walletId: z
          .string()
          .uuid({
            message: t('entity.operation.error.walletId.format', {
              id: this.operationParams.walletId
            })
          })
          .nullable(),
        createdAt: z.date().optional(),
        updatedAt: z.date().optional()
      })
      .required({
        zoopOperationId: true,
        type: true,
        amountCents: true,
        currency: true
      })
  }
}
