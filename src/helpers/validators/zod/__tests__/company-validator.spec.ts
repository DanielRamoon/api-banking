import { describe, expect, it, beforeAll } from '@jest/globals'
import companyMock from '../../../../__mocks__/entities/company-mock'
import CompanyValidator from '../CompanyValidator'
import { t } from '../../../../config/i18next/I18nextLocalization'
import { CompanyProps } from '../../../../entities/Company'
import CompanyRepository from '../../../../repositories/memory/CompanyRepository'

let companyRepository: CompanyRepository

describe('AdminValidator', () => {
  beforeAll(async () => {
    companyRepository = new CompanyRepository()
    await companyRepository.create(companyMock)
  })

  it('should validate valid user parameters', async () => {
    const adminValidator = new CompanyValidator(companyMock, companyRepository)

    expect(() => adminValidator.schema().parseAsync(companyMock)).not.toThrow()
    expect(await adminValidator.validate()).toBe(true)
    expect(await adminValidator.errors()).toEqual([])
  })

  it('should throw validation error for invalid company id', async () => {
    const invalidCompanyParams: CompanyProps = { ...companyMock, id: '123-456' }
    const adminValidator = new CompanyValidator(
      invalidCompanyParams,
      companyRepository
    )

    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.company.error.id.format', { id: invalidCompanyParams.id })
    )
  })

  it('should throw validation error for missing name', async () => {
    const invalidCompanyParams: CompanyProps = { ...companyMock, name: '' }
    const adminValidator = new CompanyValidator(
      invalidCompanyParams,
      companyRepository
    )

    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.company.error.name.length', { name: '' })
    )
  })

  it('should throw validation error for invalid name format', async () => {
    const invalidCompanyParams: CompanyProps = { ...companyMock, name: '123' }
    const adminValidator = new CompanyValidator(
      invalidCompanyParams,
      companyRepository
    )

    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.company.error.name.length', { name: invalidCompanyParams.name })
    )
  })

  it('should validate valid name', async () => {
    const adminValidator = new CompanyValidator(companyMock, companyRepository)

    expect(await adminValidator.validate()).toBe(true)
    expect(await adminValidator.errors()).toEqual([])
  })

  it('should throw validation error for missing cnpj', async () => {
    const invalidCompanyParams: CompanyProps = { ...companyMock, cnpj: '' }
    const adminValidator = new CompanyValidator(
      invalidCompanyParams,
      companyRepository
    )

    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.company.error.cnpj.format', { cnpj: invalidCompanyParams.cnpj })
    )
  })

  it('should throw validation error for invalid cnpj format', async () => {
    const invalidCompanyParams: CompanyProps = {
      ...companyMock,
      cnpj: '12345678000111'
    }
    const adminValidator = new CompanyValidator(
      invalidCompanyParams,
      companyRepository
    )

    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.company.error.cnpj.format', { cnpj: invalidCompanyParams.cnpj })
    )
  })

  it('should throw validation error for missing company name', async () => {
    const invalidCompanyParams: CompanyProps = {
      ...companyMock,
      companyName: ''
    }
    const adminValidator = new CompanyValidator(
      invalidCompanyParams,
      companyRepository
    )

    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.company.error.name.length', {
        name: invalidCompanyParams.companyName
      })
    )
  })

  it('should throw validation error for invalid company name', async () => {
    const invalidCompanyParams: CompanyProps = {
      ...companyMock,
      companyName: '123'
    }
    const adminValidator = new CompanyValidator(
      invalidCompanyParams,
      companyRepository
    )

    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.company.error.name.length', {
        name: invalidCompanyParams.companyName
      })
    )
  })

  it('should throw validation error for invalid zoop account id', async () => {
    const invalidCompanyParams: CompanyProps = {
      ...companyMock,
      zoopAccountId: '123-456'
    }
    const adminValidator = new CompanyValidator(
      invalidCompanyParams,
      companyRepository
    )

    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.company.error.zoopAccountId.format', {
        accountId: invalidCompanyParams.zoopAccountId
      })
    )
  })
})
