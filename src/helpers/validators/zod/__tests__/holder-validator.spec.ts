import { describe, expect, it, beforeEach } from '@jest/globals'
import holderMock, {
  GetCBOProviderMock,
  GetCNAEProviderMock
} from '../../../../__mocks__/entities/holder-mock'
import HolderValidator from '../HolderValidator'
import { t } from '../../../../config/i18next/I18nextLocalization'
import {
  HolderProps,
  AccountType,
  EstablishmentFormat
} from '../../../../entities/Holder'
import HolderRepository from '../../../../repositories/memory/HolderRepository'

const holderRepository = new HolderRepository()
const getCBOProviderMock = new GetCBOProviderMock()
const getCNAEProviderMock = new GetCNAEProviderMock()

beforeEach(() => holderRepository.holders.clear())

describe('AdminValidator', () => {
  it('should validate valid user parameters', async () => {
    const holderValidator = new HolderValidator(
      holderMock,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock,
      true
    )

    expect(await holderValidator.validate()).toBe(true)
    expect(await holderValidator.errors()).toEqual([])
  })

  it('should throw validation error for invalid zoop holder id', async () => {
    const invalidHolderParams: HolderProps = {
      ...holderMock,
      zoopHolderId: '123-456'
    }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.zoopHolderId.format', {
        value: invalidHolderParams.zoopHolderId
      })
    )
  })

  it('should throw validation error for invalid zoop account id', async () => {
    const invalidHolderParams: HolderProps = {
      ...holderMock,
      zoopAccountId: '123-456'
    }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.zoopAccountId.format', {
        value: invalidHolderParams.zoopAccountId
      })
    )
  })

  it('should throw validation error for invalid taxpayer id', async () => {
    const invalidHolderParams: HolderProps = {
      ...holderMock,
      taxpayerId: '123-456'
    }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.taxpayerId.format', {
        value: invalidHolderParams.taxpayerId
      })
    )
  })

  it('should throw validation error for missing name', async () => {
    const invalidHolderParams: HolderProps = { ...holderMock, name: '' }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.name.length', { name: invalidHolderParams.name })
    )
  })

  it('should throw validation error for invalid name format', async () => {
    const invalidHolderParams: HolderProps = { ...holderMock, name: '123' }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.name.length', { name: invalidHolderParams.name })
    )
  })

  it('should throw validation error for invalid accountType', async () => {
    const invalidHolderParams: HolderProps = {
      ...holderMock,
      accountType: 'invalid' as AccountType
    }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.accountType.invalid', {
        accountType: invalidHolderParams.accountType
      })
    )
  })

  it('should throw validation error for missing accountType', async () => {
    const invalidHolderParams: HolderProps = {
      ...holderMock,
      accountType: '' as AccountType
    }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.accountType.invalid', {
        accountType: invalidHolderParams.accountType
      })
    )
  })

  it('should throw validation error for missing email', async () => {
    const invalidHolderParams: HolderProps = { ...holderMock, email: '' }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.email.required')
    )
  })

  it('should throw validation error for invalid email format', async () => {
    const invalidHolderParams: HolderProps = {
      ...holderMock,
      email: 'invalidemail'
    }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.email.format', { email: 'invalidemail' })
    )
  })

  it('should throw validation error for missing cnpj', async () => {
    const invalidHolderParams: HolderProps = { ...holderMock, cnpj: '' }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.cnpj.format', { value: invalidHolderParams.cnpj })
    )
  })

  it('should throw validation error for invalid cnpj format', async () => {
    const invalidHolderParams: HolderProps = {
      ...holderMock,
      cnpj: '12345678000111'
    }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.cnpj.format', { value: invalidHolderParams.cnpj })
    )
  })

  it('should throw validation error for invalid revenue cents', async () => {
    const invalidHolderParams: HolderProps = {
      ...holderMock,
      revenueCents: -10
    }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.revenueCents.value', {
        value: invalidHolderParams.revenueCents
      })
    )
  })

  it('should throw validation error for missing rg', async () => {
    const invalidHolderParams: HolderProps = { ...holderMock, rg: '' }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.rg.format', { value: invalidHolderParams.rg })
    )
  })

  it('should throw validation error for invalid rg', async () => {
    const invalidHolderParams: HolderProps = { ...holderMock, rg: '123' }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.rg.format', { value: invalidHolderParams.rg })
    )
  })

  it('should throw validation error for missing legalName', async () => {
    const invalidHolderParams: HolderProps = { ...holderMock, legalName: '' }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.legalName.length', {
        legalName: invalidHolderParams.legalName
      })
    )
  })

  it('should throw validation error for invalid legalName format', async () => {
    const invalidHolderParams: HolderProps = { ...holderMock, legalName: '123' }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.legalName.length', {
        legalName: invalidHolderParams.legalName
      })
    )
  })

  it('should throw validation error for invalid establishmentFormat', async () => {
    const invalidHolderParams: HolderProps = {
      ...holderMock,
      establishmentFormat: 'invalid' as EstablishmentFormat
    }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.establishmentFormat.invalid', {
        establishmentFormat: invalidHolderParams.establishmentFormat
      })
    )
  })

  it('should throw validation error for missing establishmentFormat', async () => {
    const invalidHolderParams: HolderProps = {
      ...holderMock,
      establishmentFormat: '' as EstablishmentFormat
    }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.establishmentFormat.invalid', {
        establishmentFormat: invalidHolderParams.establishmentFormat
      })
    )
  })

  it('should throw validation error for missing establishmentDate', async () => {
    const invalidHolderParams: HolderProps = {
      ...holderMock,
      establishmentDate: '32/13/2023'
    }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.establishmentDate.invalid', {
        value: invalidHolderParams.establishmentDate
      })
    )
  })

  it('should throw validation error for missing phone', async () => {
    const invalidHolderParams: HolderProps = {
      ...holderMock,
      phoneAreaCode: ''
    }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.phoneAreaCode.length', {
        value: invalidHolderParams.phoneAreaCode
      })
    )
  })

  it('should throw validation error for invalid phone format', async () => {
    const invalidHolderParams: HolderProps = {
      ...holderMock,
      phoneAreaCode: '123'
    }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.phoneAreaCode.length', {
        value: invalidHolderParams.phoneAreaCode
      })
    )
  })

  it('should throw validation error for missing phone prefix', async () => {
    const invalidHolderParams: HolderProps = { ...holderMock, phonePrefix: '' }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.phone_prefix.format', {
        phone_prefix: invalidHolderParams.phonePrefix
      })
    )
  })

  it('should throw validation error for invalid phone prefix format', async () => {
    const invalidHolderParams: HolderProps = { ...holderMock, phonePrefix: '1' }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.phone_prefix.format', {
        phone_prefix: invalidHolderParams.phonePrefix
      })
    )
  })

  it('should throw validation error for missing phone number', async () => {
    const invalidHolderParams: HolderProps = { ...holderMock, phoneNumber: '' }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.phoneNumber.format', {
        phone: invalidHolderParams.phoneNumber
      })
    )
  })

  it('should throw validation error for invalid phone format', async () => {
    const invalidHolderParams: HolderProps = {
      ...holderMock,
      phoneNumber: '123'
    }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.phoneNumber.format', {
        phone: invalidHolderParams.phoneNumber
      })
    )
  })

  it('should throw validation error for invalid address street', async () => {
    const invalidHolderParams: HolderProps = {
      ...holderMock,
      addressStreet: ''
    }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.addressStreet.length', {
        value: invalidHolderParams.addressStreet
      })
    )
  })

  it('should throw validation error for invalid address number', async () => {
    const invalidHolderParams: HolderProps = {
      ...holderMock,
      addressNumber: ''
    }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.addressNumber.length', {
        value: invalidHolderParams.addressNumber
      })
    )
  })

  it('should throw validation error for invalid address city', async () => {
    const invalidHolderParams: HolderProps = { ...holderMock, addressCity: '' }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.addressCity.length', {
        value: invalidHolderParams.addressCity
      })
    )
  })

  it('should throw validation error for invalid address state', async () => {
    const invalidHolderParams: HolderProps = { ...holderMock, addressState: '' }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.addressState.length', {
        value: invalidHolderParams.addressState
      })
    )
  })

  it('should throw validation error for invalid address neighborhood', async () => {
    const invalidHolderParams: HolderProps = {
      ...holderMock,
      addressNeighborhood: ''
    }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.addressNeighborhood.length', {
        value: invalidHolderParams.addressNeighborhood
      })
    )
  })

  it('should throw validation error for invalid address country', async () => {
    const invalidHolderParams: HolderProps = {
      ...holderMock,
      addressCountry: ''
    }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.addressCountry.length', {
        value: invalidHolderParams.addressCountry
      })
    )
  })

  it('should throw validation error for invalid address postalcode', async () => {
    const invalidHolderParams: HolderProps = {
      ...holderMock,
      addressPostalCode: '123'
    }
    const holderValidator = new HolderValidator(
      invalidHolderParams,
      holderRepository,
      getCBOProviderMock,
      getCNAEProviderMock
    )

    expect(await holderValidator.validate()).toBe(false)
    expect(await holderValidator.errors()).toContain(
      t('entity.holder.error.addressPostalCode.format', {
        value: invalidHolderParams.addressPostalCode
      })
    )
  })
})
