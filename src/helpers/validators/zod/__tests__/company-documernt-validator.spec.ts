import { describe, expect, it } from '@jest/globals'
import companyDocumentMock from '../../../../__mocks__/entities/company-document-mock'
import CompanyDocumentValidator from '../CompanyDocumentValidator'
import { t } from '../../../../config/i18next/I18nextLocalization'
import { CompanyDocumentProps } from '../../../../entities/CompanyDocument'
import { z } from 'zod'

describe('AdminValidator', () => {
  it('should validate valid user parameters', async () => {
    const adminValidator = new CompanyDocumentValidator(companyDocumentMock)

    expect(() =>
      adminValidator.schema().parse(companyDocumentMock)
    ).not.toThrow()
    expect(await adminValidator.validate()).toBe(true)
    expect(await adminValidator.errors()).toEqual([])
  })

  it('should throw validation error for invalid company document id', async () => {
    const invalidCompanyDocumentParams: CompanyDocumentProps = {
      ...companyDocumentMock,
      id: '123-456'
    }
    const adminValidator = new CompanyDocumentValidator(
      invalidCompanyDocumentParams
    )

    expect(() =>
      adminValidator.schema().parse(invalidCompanyDocumentParams)
    ).toThrowError(z.ZodError)
    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.companyDocument.error.id.format', {
        id: invalidCompanyDocumentParams.id
      })
    )
  })

  it('should throw validation error for missing type', async () => {
    const invalidCompanyDocumentParams: CompanyDocumentProps = {
      ...companyDocumentMock,
      type: ''
    }
    const adminValidator = new CompanyDocumentValidator(
      invalidCompanyDocumentParams
    )

    expect(() =>
      adminValidator.schema().parse(invalidCompanyDocumentParams)
    ).toThrowError(z.ZodError)
    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.companyDocument.error.type.format', { type: '' })
    )
  })

  it('should throw validation error for missing type', async () => {
    const invalidCompanyDocumentParams: CompanyDocumentProps = {
      ...companyDocumentMock,
      file: ''
    }
    const adminValidator = new CompanyDocumentValidator(
      invalidCompanyDocumentParams
    )

    expect(() =>
      adminValidator.schema().parse(invalidCompanyDocumentParams)
    ).toThrowError(z.ZodError)
    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.companyDocument.error.file.format', { file: '' })
    )
  })

  it('should throw validation error for invalid zoop account id', async () => {
    const invalidCompanyDocumentParams: CompanyDocumentProps = {
      ...companyDocumentMock,
      companyId: '123-456'
    }
    const adminValidator = new CompanyDocumentValidator(
      invalidCompanyDocumentParams
    )

    expect(() =>
      adminValidator.schema().parse(invalidCompanyDocumentParams)
    ).toThrowError(z.ZodError)
    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.companyDocument.error.companyId.format', {
        id: invalidCompanyDocumentParams.companyId
      })
    )
  })
})
