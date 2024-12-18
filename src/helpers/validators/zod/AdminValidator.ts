import { AdminProps, Role } from '../../../entities/Admin'
import { ZodValidator } from './ZodValidator'
import { t } from '../../../config/i18next/I18nextLocalization'
import { z, ZodObject, ZodRawShape } from 'zod'
import { NAME_MIN_LENGTH } from '../../constants'
import { IAdminRepository } from '../../../repositories/IAdminRepository'

export default class AdminValidator extends ZodValidator {
  private adminRepository: IAdminRepository
  adminParams: AdminProps
  onCreate: boolean

  constructor(
    adminParams: AdminProps,
    adminRepository: IAdminRepository,
    onCreate?: boolean
  ) {
    super(adminParams)
    this.adminRepository = adminRepository
    this.adminParams = adminParams
    this.onCreate = onCreate ?? false
  }

  public schema(): ZodObject<ZodRawShape> {
    return z
      .object({
        id: z
          .string()
          .uuid({
            message: t('entity.admin.error.id', { id: this.adminParams.id })
          })
          .optional(),
        name: z.string().min(NAME_MIN_LENGTH, {
          message: t('entity.admin.error.name.length', {
            name: this.adminParams.name
          })
        }),
        email: z
          .string({
            required_error: t('entity.admin.error.email.required')
          })
          .email({
            message: t('entity.admin.error.email.format', {
              email: this.adminParams.email
            })
          })
          .refine(
            async value => {
              return await this.isEmailValid!(value)
            },
            {
              message: t('entity.admin.error.email.exists')
            }
          ),
        role: z.nativeEnum(Role, {
          errorMap: () => {
            return {
              message: t('entity.admin.error.role.invalid', {
                role: this.adminParams.role
              })
            }
          }
        })
      })
      .required({
        name: true,
        email: true,
        role: true
      })
  }

  private async isEmailValid(email: string): Promise<boolean> {
    if (this.onCreate) {
      return !(await this.adminRepository.emailExists(email))
    } else {
      return !(await this.adminRepository.emailExists(
        email,
        this.adminParams.id
      ))
    }
  }
}
