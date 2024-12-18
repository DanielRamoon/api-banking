import { CompanyUserProps, Role } from '../../../entities/CompanyUser'
import { ZodValidator } from './ZodValidator'
import { t } from '../../../config/i18next/I18nextLocalization'
import { z, ZodObject, ZodRawShape } from 'zod'
import { NAME_MIN_LENGTH } from '../../constants'
import { ICompanyUserRepository } from '../../../repositories/ICompanyUserRepository'

export default class CompanyUserValidator extends ZodValidator {
  companyUserParams: CompanyUserProps
  private companyUserRepository: ICompanyUserRepository
  private onCreate: boolean

  constructor(
    companyUserParams: CompanyUserProps,
    companyUserRepository: ICompanyUserRepository,
    onCreate?: boolean
  ) {
    super(companyUserParams)
    this.companyUserRepository = companyUserRepository
    this.companyUserParams = companyUserParams
    this.onCreate = onCreate ?? false
  }

  isValidId = (id: string): id is `${string}/${string}` =>
    id.split('/').length === 2

  public schema(): ZodObject<ZodRawShape> {
    let companyUserZodObject = z.object({
      id: z
        .string()
        .uuid({
          message: t('entity.companyUser.error.id', {
            id: this.companyUserParams.id
          })
        })
        .optional(),
      name: z.string().min(NAME_MIN_LENGTH, {
        message: t('entity.companyUser.error.name.length', {
          name: this.companyUserParams.name
        })
      }),
      role: z
        .nativeEnum(Role, {
          errorMap: () => {
            return {
              message: t('entity.companyUser.error.role.invalid', {
                role: this.companyUserParams.role
              })
            }
          }
        })
        .optional(),
      companyId: z
        .string()
        .uuid({
          message: t('entity.companyUser.error.companyId.format', {
            id: this.companyUserParams.companyId
          })
        })
        .optional()
    })

    const withEmailRequired = z.object({
      email: z
        .string()
        .email({
          message: t('entity.companyUser.error.email.format', {
            email: this.companyUserParams.email
          })
        })
        .refine(
          async email => {
            return await this.isEmailValid(email)
          },
          { message: t('entity.companyUser.error.email.exists') }
        )
    })

    const withoutEmailRequired = z.object({
      email: z
        .string()
        .email({
          message: t('entity.companyUser.error.email.format', {
            email: this.companyUserParams.email
          })
        })
        .optional()
    })

    if (this.onCreate) {
      companyUserZodObject = companyUserZodObject
        .merge(withEmailRequired)
        .required({
          name: true,
          email: true
        })
    } else {
      companyUserZodObject = companyUserZodObject
        .merge(withoutEmailRequired)
        .required({
          name: true
        })
    }

    return companyUserZodObject
  }

  private async isEmailValid(email: string): Promise<boolean> {
    if (this.onCreate) {
      return !(await this.companyUserRepository.emailExists(email))
    } else {
      return !(await this.companyUserRepository.emailExists(
        email,
        this.companyUserParams.id
      ))
    }
  }
}
