import { CompanyDocumentProps } from '../../../entities/CompanyDocument'
import { ZodValidator } from './ZodValidator'
import { t } from '../../../config/i18next/I18nextLocalization'
import { z, ZodObject, ZodRawShape } from 'zod'

export default class CompanyDocumentValidator extends ZodValidator {
  companyDocumentParams: CompanyDocumentProps

  constructor(companyDocumentParams: CompanyDocumentProps) {
    super(companyDocumentParams)
    this.companyDocumentParams = companyDocumentParams
  }

  public schema(): ZodObject<ZodRawShape> {
    return z
      .object({
        id: z
          .string()
          .uuid({
            message: t('entity.companyDocument.error.id.format', {
              id: this.companyDocumentParams.id
            })
          })
          .optional(),
        type: z.string().min(1, {
          message: t('entity.companyDocument.error.type.format', {
            type: this.companyDocumentParams.type
          })
        }),
        file: z.string().min(1, {
          message: t('entity.companyDocument.error.file.format', {
            file: this.companyDocumentParams.file
          })
        }),
        companyId: z.string().uuid({
          message: t('entity.companyDocument.error.companyId.format', {
            id: this.companyDocumentParams.companyId
          })
        })
      })
      .required({
        type: true,
        file: true
      })
  }
}
