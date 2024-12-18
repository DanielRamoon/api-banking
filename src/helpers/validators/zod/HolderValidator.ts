import {
  HolderProps,
  AccountType,
  EstablishmentFormat
} from '../../../entities/Holder'
import { ZodValidator } from './ZodValidator'
import { validCNPJ, validRG, validTaxpayerId } from '../validations'
import { IHolderRepository } from '../../../repositories/IHolderRepository'
import { t } from '../../../config/i18next/I18nextLocalization'
import { z, ZodEffects, ZodObject, ZodRawShape } from 'zod'
import {
  DATE_REGEX,
  NAME_MIN_LENGTH,
  PHONE_PREFIX_REGEX,
  PHONE_REGEX,
  POSTAL_CODE_REGEX
} from '../../constants'
import { ApplicationProvider } from '../../../adapters/providers/ApplicationProvider'
import { ApplicationError } from '../../ApplicationError'
import { ApplicationHttpRequestProps } from '../../ApplicationHttpRequest'

export default class HolderValidator extends ZodValidator {
  private holderParams: HolderProps
  private holderRepository: IHolderRepository
  private getCNAEProvider: ApplicationProvider
  private getCBOProvider: ApplicationProvider
  private onCreate: boolean

  constructor(
    holderParams: HolderProps,
    holderRepository: IHolderRepository,
    getCNAEProvider: ApplicationProvider,
    getCBOProvider: ApplicationProvider,
    onCreate?: boolean
  ) {
    super(holderParams)
    this.holderParams = holderParams
    this.holderRepository = holderRepository
    this.getCNAEProvider = getCNAEProvider
    this.getCBOProvider = getCBOProvider
    this.onCreate = onCreate ?? false
  }

  #cnpjValidate = z
    .function()
    .args(z.string())
    .returns(z.boolean())
    .implement(validCNPJ)

  #rgValidate = z
    .function()
    .args(z.string())
    .returns(z.boolean())
    .implement(validRG)

  #taxpayerValidate = z
    .function()
    .args(z.string())
    .returns(z.boolean())
    .implement(validTaxpayerId)

  public schema(): ZodEffects<ZodObject<ZodRawShape>> {
    return z
      .object({
        id: z
          .string()
          .uuid({
            message: t('entity.holder.error.id.format', {
              id: this.holderParams.id
            })
          })
          .optional(),
        zoopAccountId: z
          .string()
          .uuid({
            message: t('entity.holder.error.zoopAccountId.format', {
              value: this.holderParams.zoopAccountId
            })
          })
          .optional(),
        zoopHolderId: z
          .string()
          .uuid({
            message: t('entity.holder.error.zoopHolderId.format', {
              value: this.holderParams.zoopHolderId
            })
          })
          .optional(),
        name: z.string().min(NAME_MIN_LENGTH, {
          message: t('entity.holder.error.name.length', {
            name: this.holderParams.name
          })
        }),
        accountType: z.nativeEnum(AccountType, {
          errorMap: () => {
            return {
              message: t('entity.holder.error.accountType.invalid', {
                accountType: this.holderParams.accountType
              })
            }
          }
        }),
        email: z
          .string()
          .min(1, {
            message: t('entity.holder.error.email.required')
          })
          .email({
            message: t('entity.holder.error.email.format', {
              email: this.holderParams.email
            })
          })
          .refine(
            async email => {
              return await this.isEmailValid(email)
            },
            { message: t('entity.holder.error.email.exists') }
          ),
        cnpj: z
          .string()
          .refine(this.#cnpjValidate, value => ({
            message: t('entity.holder.error.cnpj.format', { value })
          }))
          .optional(),
        rg: z
          .string()
          .refine(this.#rgValidate, value => ({
            message: t('entity.holder.error.rg.format', { value })
          }))
          .optional(),
        taxpayerId: z.string().refine(this.#taxpayerValidate, value => ({
          message: t('entity.holder.error.taxpayerId.format', { value })
        })),
        revenueCents: z
          .number({
            errorMap: () => {
              return {
                message: t('entity.holder.error.revenueCents.value', {
                  accountType: this.holderParams.accountType
                })
              }
            }
          })
          .nonnegative({
            message: t('entity.holder.error.revenueCents.value', {
              value: this.holderParams.revenueCents
            })
          })
          .optional(),
        cnae: z
          .string({
            errorMap: () => {
              return {
                message: t('entity.holder.error.cnae.value', {
                  value: this.holderParams.cnae
                })
              }
            }
          })
          .refine(
            async value => {
              return await this.validCNAE(value)
            },
            value => ({
              message: t('entity.holder.error.cnae.value', { value })
            })
          )
          .optional(),
        legalName: z
          .string()
          .min(NAME_MIN_LENGTH, {
            message: t('entity.holder.error.legalName.length', {
              legalName: this.holderParams.legalName
            })
          })
          .optional(),
        establishmentFormat: z
          .nativeEnum(EstablishmentFormat, {
            errorMap: () => {
              return {
                message: t('entity.holder.error.establishmentFormat.invalid', {
                  establishmentFormat: this.holderParams.establishmentFormat
                })
              }
            }
          })
          .optional(),
        establishmentDate: z
          .string()
          .regex(DATE_REGEX, {
            message: t('entity.holder.error.establishmentDate.invalid', {
              value: this.holderParams.establishmentDate
            })
          })
          .optional(),
        phoneAreaCode: z
          .string()
          .length(2, {
            message: t('entity.holder.error.phoneAreaCode.length', {
              value: this.holderParams.phoneAreaCode
            })
          })
          .optional(),
        phonePrefix: z
          .string()
          .regex(PHONE_PREFIX_REGEX, {
            message: t('entity.holder.error.phone_prefix.format', {
              phone_prefix: this.holderParams.phonePrefix
            })
          })
          .optional(),
        phoneNumber: z
          .string()
          .regex(PHONE_REGEX, {
            message: t('entity.holder.error.phoneNumber.format', {
              phone: this.holderParams.phoneNumber
            })
          })
          .optional(),
        addressStreet: z
          .string()
          .min(1, {
            message: t('entity.holder.error.addressStreet.length', {
              value: this.holderParams.addressStreet
            })
          })
          .optional(),
        addressNumber: z
          .string()
          .min(1, {
            message: t('entity.holder.error.addressNumber.length', {
              value: this.holderParams.addressNumber
            })
          })
          .optional(),
        addressCity: z
          .string()
          .min(1, {
            message: t('entity.holder.error.addressCity.length', {
              value: this.holderParams.addressCity
            })
          })
          .optional(),
        addressState: z
          .string()
          .min(1, {
            message: t('entity.holder.error.addressState.length', {
              value: this.holderParams.addressState
            })
          })
          .optional(),
        addressNeighborhood: z
          .string()
          .min(1, {
            message: t('entity.holder.error.addressNeighborhood.length', {
              value: this.holderParams.addressNeighborhood
            })
          })
          .optional(),
        addressCountry: z
          .string()
          .min(1, {
            message: t('entity.holder.error.addressCountry.length', {
              value: this.holderParams.addressCountry
            })
          })
          .optional(),
        addressPostalCode: z
          .string()
          .regex(POSTAL_CODE_REGEX, {
            message: t('entity.holder.error.addressPostalCode.format', {
              value: this.holderParams.addressPostalCode
            })
          })
          .optional(),
        cbo: z
          .string({
            errorMap: () => {
              return {
                message: t('entity.holder.error.cbo.value', {
                  value: this.holderParams.cbo
                })
              }
            }
          })
          .refine(
            async value => {
              return await this.validCBO(value)
            },
            value => ({
              message: t('entity.holder.error.cbo.value', { value })
            })
          )
          .optional(),
        addressComplement: z.string().optional(),
        mothersName: z.string().optional(),
        pep: z.boolean().optional(),
        birthday: z
          .string()
          .regex(DATE_REGEX, {
            message: t('entity.holder.error.birthday.invalid', {
              value: this.holderParams.birthday
            })
          })
          .optional(),
        createdAt: z.date().optional(),
        updatedAt: z.date().optional()
      })
      .required({
        name: true,
        accountType: true,
        email: true,
        taxpayerId: true
      })
      .refine(
        async ({ taxpayerId, cnpj }) => {
          return await this.holderExists(taxpayerId, cnpj)
        },
        {
          message: t('entity.holder.error.taxpayerIdCNPJUniqueness.invalid')
        }
      )
  }

  private async holderExists(
    taxpayerId: string,
    cnpj: string | undefined
  ): Promise<boolean> {
    if (this.onCreate) {
      return !(await this.holderRepository.ensureTaxpayerIdCNPJUniqueness(
        taxpayerId,
        cnpj
      ))
    } else {
      return !(await this.holderRepository.ensureTaxpayerIdCNPJUniqueness(
        taxpayerId,
        cnpj,
        this.holderParams.id
      ))
    }
  }

  private async validCNAE(cnae: string): Promise<boolean> {
    const _cnae = await this.getCNAEProvider.execute({ cnae })
    if (_cnae instanceof ApplicationError) return false
    const { withError } = _cnae as ApplicationHttpRequestProps

    return !withError
  }

  private async validCBO(cbo: string): Promise<boolean> {
    const _cbo = await this.getCBOProvider.execute({ cbo })
    if (_cbo instanceof ApplicationError) return false
    const { withError } = _cbo as ApplicationHttpRequestProps

    return !withError
  }

  private async isEmailValid(email: string): Promise<boolean> {
    if (this.onCreate) {
      return !(await this.holderRepository.emailExists(email))
    } else {
      return !(await this.holderRepository.emailExists(
        email,
        this.holderParams.id
      ))
    }
  }
}
