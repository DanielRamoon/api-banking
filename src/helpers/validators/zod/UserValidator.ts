import { UserProps } from '../../../entities/User'
import { ZodValidator } from './ZodValidator'
import { t } from '../../../config/i18next/I18nextLocalization'
import { z, ZodEffects, ZodObject, ZodRawShape } from 'zod'
import {
  NAME_MIN_LENGTH,
  PHONE_PREFIX_REGEX,
  PHONE_REGEX
} from '../../constants'
import { validTaxpayerId, validCNPJ } from '../validations'
import { IUserRepository } from '../../../repositories/IUserRepository'

export default class UserValidator extends ZodValidator {
  private userRepository: IUserRepository
  private onCreate: boolean

  constructor(
    readonly userParams: UserProps,
    userRepository: IUserRepository,
    onCreate?: boolean
  ) {
    super(userParams)
    this.userRepository = userRepository
    this.userParams = userParams
    this.onCreate = onCreate ?? false
  }

  #taxpayerValidate = z
    .function()
    .args(z.string())
    .returns(z.boolean())
    .implement(validTaxpayerId)

  #CNPJValidate = z
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
            message: t('entity.user.error.id', { id: this.userParams.id })
          })
          .optional(),
        companyId: z
          .string({
            required_error: t('entity.user.error.companyId.required')
          })
          .uuid({
            message: t('entity.user.error.companyId.format', {
              value: this.userParams.companyId
            })
          })
          .refine(
            async value => {
              return await this.userRepository.companyExists(value)
            },
            {
              message: t('entity.user.error.companyId.noExists')
            }
          ),
        name: z
          .string({
            required_error: t('entity.user.error.name.required')
          })
          .min(NAME_MIN_LENGTH, {
            message: t('entity.user.error.name.length', {
              name: this.userParams.name
            })
          }),
        email: z
          .string({
            required_error: t('entity.user.error.email.required')
          })
          .email({
            message: t('entity.user.error.email.format', {
              email: this.userParams.email
            })
          })
          .refine(
            async value => {
              return await this.isEmailValid!(value)
            },
            {
              message: t('entity.user.error.email.exists')
            }
          ),
        taxpayerId: z
          .string({
            required_error: t('entity.user.error.taxpayerId.required')
          })
          .refine(
            value => {
              if (!this.onCreate) return true
              return this.#taxpayerValidate(value)
            },
            value => ({
              message: t('entity.user.error.taxpayerId.format', { value })
            })
          ),
        cnpj: z
          .string()
          .refine(
            value => {
              if (!this.onCreate) return true
              return this.#CNPJValidate(value)
            },
            value => ({
              message: t('entity.user.error.cnpj.format', { value })
            })
          )
          .optional(),
        phonePrefix: z
          .string({
            required_error: t('entity.user.error.phone_prefix.required')
          })
          .regex(PHONE_PREFIX_REGEX, {
            message: t('entity.user.error.phone_prefix.format', {
              phone_prefix: this.props.phonePrefix
            })
          }),
        phone: z
          .string({
            required_error: t('entity.user.error.phone.required')
          })
          .regex(PHONE_REGEX, {
            message: t('entity.user.error.phone.format', {
              phone: this.props.phone
            })
          }),
        isBlocked: z
          .boolean({
            errorMap: () => {
              return { message: t('entity.user.error.isBlocked') }
            }
          })
          .optional()
      })
      .required({
        email: true,
        taxpayerId: true,
        phone: true,
        phonePrefix: true
      })
      .refine(
        async ({ cnpj, taxpayerId, companyId }) => {
          return await this.isUserUnique(companyId, taxpayerId, cnpj)
        },
        {
          message: t('entity.user.error.exists')
        }
      )
  }

  private async isUserUnique(
    companyId: string,
    taxpayerId: string,
    cnpj?: string
  ): Promise<boolean> {
    if (!this.onCreate) return true
    return !(await this.userRepository.userExists(companyId, taxpayerId, cnpj))
  }

  private async isEmailValid(email: string): Promise<boolean> {
    if (this.onCreate) {
      return !(await this.userRepository.emailExists(email))
    } else {
      return !(await this.userRepository.emailExists(email, this.userParams.id))
    }
  }
}
