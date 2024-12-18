import { CompanyOperationProps } from '../../../entities/CompanyOperation'
import { ZodValidator } from './ZodValidator'
import { t } from '../../../config/i18next/I18nextLocalization'
import { z, ZodObject, ZodRawShape } from 'zod'
import { CURRENCY_LENGTH } from '../../constants'

export default class CompanyOperationValidator extends ZodValidator {
  companyOperationParams: CompanyOperationProps

  constructor(companyOperationParams: CompanyOperationProps) {
    super(companyOperationParams)
    this.companyOperationParams = companyOperationParams
  }

  public schema(): ZodObject<ZodRawShape> {
    return z
      .object({
        id: z
          .string()
          .uuid({
            message: t('entity.companyOperation.error.id.format', {
              id: this.companyOperationParams.id
            })
          })
          .optional(),
        zoopOperationId: z.string().uuid({
          message: t('entity.companyOperation.error.zoopOperationId.format', {
            operationId: this.companyOperationParams.zoopOperationId
          })
        }),
        type: z.string().min(1, {
          message: t('entity.companyOperation.error.type.format', {
            type: this.companyOperationParams.type
          })
        }),
        amount: z.number().nonnegative({
          message: t('entity.companyOperation.error.amount.value', {
            amount: this.companyOperationParams.amount
          })
        }),
        currency: z.string().length(CURRENCY_LENGTH, {
          message: t('entity.companyOperation.error.currency.length', {
            currency: this.companyOperationParams.currency
          })
        }),
        companyId: z
          .string()
          .uuid({
            message: t('entity.companyOperation.error.companyId.format', {
              id: this.companyOperationParams.companyId
            })
          })
          .optional()
      })
      .required({
        zoopOperationId: true,
        type: true,
        amount: true,
        currency: true
      })
  }
}
