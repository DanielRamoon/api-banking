import { CompanyProps } from '../../../entities/Company'
import { ZodValidator } from './ZodValidator'
import { t } from '../../../config/i18next/I18nextLocalization'
import { NAME_MIN_LENGTH } from '../../constants'
import { validCNPJ } from '../validations'
import { z, ZodEffects, ZodObject, ZodRawShape } from 'zod'
import { ICompanyRepository } from '../../../repositories/ICompanyRepository'

export default class CompanyValidator extends ZodValidator {
  private companyRepository: ICompanyRepository
  private companyParams: CompanyProps
  private onCreate: boolean

  constructor(
    companyParams: CompanyProps,
    companyRepository: ICompanyRepository,
    onCreate?: boolean
  ) {
    super(companyParams)
    this.companyRepository = companyRepository
    this.companyParams = companyParams
    this.onCreate = onCreate ?? false
  }

  #cnpjValidate = z
    .function()
    .args(z.string())
    .returns(z.boolean())
    .implement(validCNPJ)

  public schema(): ZodEffects<ZodObject<ZodRawShape>> {
    return z
      .object({
        id: z
          .string()
          .uuid({
            message: t('entity.company.error.id.format', {
              id: this.companyParams.id
            })
          })
          .optional(),
        name: z.string().min(NAME_MIN_LENGTH, {
          message: t('entity.company.error.name.length', {
            name: this.companyParams.name
          })
        }),
        cnpj: z.string().refine(this.#cnpjValidate, value => ({
          message: t('entity.company.error.cnpj.format', { cnpj: value })
        })),
        companyName: z.string().min(NAME_MIN_LENGTH, {
          message: t('entity.company.error.name.length', {
            name: this.companyParams.companyName
          })
        }),
        zoopAccountId: z
          .string()
          .uuid({
            message: t('entity.company.error.zoopAccountId.format', {
              accountId: this.companyParams.zoopAccountId
            })
          })
          .optional(),
        isBlocked: z.boolean().optional(),
        encryptedPassword: z.string().optional()
      })
      .required({
        name: true,
        cnpj: true,
        companyName: true
      })
      .refine(
        async ({ cnpj }) => {
          return await this.isCNPJValid(cnpj)
        },
        {
          message: t('entity.company.error.cnpj.exists')
        }
      )
  }

  private async isCNPJValid(cnpj: string): Promise<boolean> {
    if (!this.onCreate) return true
    return !(await this.companyRepository.cnpjExists(cnpj))
  }
}
