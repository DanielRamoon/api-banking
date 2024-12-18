import { describe, expect, it } from '@jest/globals'
import companyOperationMock from '../../../../__mocks__/entities/company-operation-mock'
import CompanyOperationValidator from '../CompanyOperationValidator'
import { t } from '../../../../config/i18next/I18nextLocalization'
import { CompanyOperationProps } from '../../../../entities/CompanyOperation'
import { z } from 'zod'

describe('AdminValidator', () => {
  it('should validate valid user parameters', async () => {
    const adminValidator = new CompanyOperationValidator(companyOperationMock)

    expect(() =>
      adminValidator.schema().parse(companyOperationMock)
    ).not.toThrow()
    expect(await adminValidator.validate()).toBe(true)
    expect(await adminValidator.errors()).toEqual([])
  })

  it('should throw validation error for invalid company operation id', async () => {
    const invalidCompanyOperationParams: CompanyOperationProps = {
      ...companyOperationMock,
      id: '123-456'
    }
    const adminValidator = new CompanyOperationValidator(
      invalidCompanyOperationParams
    )

    expect(() =>
      adminValidator.schema().parse(invalidCompanyOperationParams)
    ).toThrowError(z.ZodError)
    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.companyOperation.error.id.format', {
        id: invalidCompanyOperationParams.id
      })
    )
  })

  it('should throw validation error for missing type', async () => {
    const invalidCompanyOperationParams: CompanyOperationProps = {
      ...companyOperationMock,
      type: ''
    }
    const adminValidator = new CompanyOperationValidator(
      invalidCompanyOperationParams
    )

    expect(() =>
      adminValidator.schema().parse(invalidCompanyOperationParams)
    ).toThrowError(z.ZodError)
    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.companyOperation.error.type.format', { type: '' })
    )
  })

  it('should throw validation error for invalid amount', async () => {
    const invalidCompanyOperationParams: CompanyOperationProps = {
      ...companyOperationMock,
      amount: -10
    }
    const adminValidator = new CompanyOperationValidator(
      invalidCompanyOperationParams
    )

    expect(() =>
      adminValidator.schema().parse(invalidCompanyOperationParams)
    ).toThrowError(z.ZodError)
    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.companyOperation.error.amount.value', {
        amount: invalidCompanyOperationParams.amount
      })
    )
  })

  it('should throw validation error for invalid currency', async () => {
    const invalidCompanyOperationParams: CompanyOperationProps = {
      ...companyOperationMock,
      currency: 'US'
    }
    const adminValidator = new CompanyOperationValidator(
      invalidCompanyOperationParams
    )

    expect(() =>
      adminValidator.schema().parse(invalidCompanyOperationParams)
    ).toThrowError(z.ZodError)
    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.companyOperation.error.currency.length', {
        currency: invalidCompanyOperationParams.currency
      })
    )
  })

  it('should throw validation error for invalid company id', async () => {
    const invalidCompanyOperationParams: CompanyOperationProps = {
      ...companyOperationMock,
      companyId: '123-456'
    }
    const adminValidator = new CompanyOperationValidator(
      invalidCompanyOperationParams
    )

    expect(() =>
      adminValidator.schema().parse(invalidCompanyOperationParams)
    ).toThrowError(z.ZodError)
    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.companyOperation.error.companyId.format', {
        id: invalidCompanyOperationParams.companyId
      })
    )
  })

  it('should throw validation error for invalid zoop operation id', async () => {
    const invalidCompanyOperationParams: CompanyOperationProps = {
      ...companyOperationMock,
      zoopOperationId: '123-456'
    }
    const adminValidator = new CompanyOperationValidator(
      invalidCompanyOperationParams
    )

    expect(() =>
      adminValidator.schema().parse(invalidCompanyOperationParams)
    ).toThrowError(z.ZodError)
    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.companyOperation.error.zoopOperationId.format', {
        operationId: invalidCompanyOperationParams.zoopOperationId
      })
    )
  })
})
