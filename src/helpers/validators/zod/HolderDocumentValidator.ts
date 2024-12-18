import {
  DocumentType,
  HolderDocumentProps
} from '../../../entities/HolderDocument'
import { ZodValidator } from './ZodValidator'
import { t } from '../../../config/i18next/I18nextLocalization'
import { z, ZodObject, ZodRawShape } from 'zod'
import { IHolderRepository } from '../../../repositories/IHolderRepository'
import Holder from '../../../entities/Holder'
import { ApplicationError } from '../../ApplicationError'

export default class HolderDocumentValidator extends ZodValidator {
  private holderDocumentParams: HolderDocumentProps
  private holderRepository: IHolderRepository

  constructor(
    holderDocumentParams: HolderDocumentProps,
    holderRepository: IHolderRepository
  ) {
    super(holderDocumentParams)
    this.holderDocumentParams = holderDocumentParams
    this.holderRepository = holderRepository
  }

  public schema(): ZodObject<ZodRawShape> {
    return z
      .object({
        id: z
          .string()
          .uuid({
            message: t('entity.holderDocument.error.id.format', {
              id: this.holderDocumentParams.id
            })
          })
          .optional(),
        type: z.nativeEnum(DocumentType, {
          errorMap: () => {
            return {
              message: t('entity.holderDocument.error.type.format', {
                type: this.holderDocumentParams.type
              })
            }
          }
        }),
        file: z.string().min(1, {
          message: t('entity.holderDocument.error.file.format', {
            file: this.holderDocumentParams.file
          })
        }),
        holderId: z
          .string({
            required_error: t('entity.holderDocument.error.holderId.required')
          })
          .uuid({
            message: t('entity.holderDocument.error.holderId.format', {
              id: this.holderDocumentParams.holderId
            })
          })
          .refine(
            async value => {
              return await this.holderExists(value)
            },
            {
              message: t('entity.holderDocument.error.holderId.exists')
            }
          )
      })
      .required({
        type: true,
        file: true,
        holderId: true
      })
  }

  private async holderExists(holder_id: string): Promise<boolean> {
    const holder = (await this.holderRepository.find(holder_id)) as Holder
    return !(holder instanceof ApplicationError)
  }
}
