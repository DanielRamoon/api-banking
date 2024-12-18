import { describe, expect, it } from '@jest/globals'
import CompanyDocument from '../CompanyDocument'
import companyDocumentMock from '../../__mocks__/entities/company-document-mock'

describe('CompanyDocument Class', () => {
  it('should create a document instance', () => {
    const document = new CompanyDocument(companyDocumentMock)
    expect(document).toBeInstanceOf(CompanyDocument)
  })

  it('should return the correct ID', () => {
    const document = new CompanyDocument(companyDocumentMock)
    expect(document.id).toBe(companyDocumentMock.id)
  })

  it('should return the correct resource', () => {
    const document = new CompanyDocument(companyDocumentMock)
    expect(document.resource).toBe('company_document')
  })

  it('should return the correct type', () => {
    const document = new CompanyDocument(companyDocumentMock)
    expect(document.type).toBe('invoice')
  })

  it('should return the correct file name', () => {
    const document = new CompanyDocument(companyDocumentMock)
    expect(document.file).toBe('invoice.pdf')
  })

  it('should return the correct companyId', () => {
    const document = new CompanyDocument(companyDocumentMock)
    expect(document.companyId).toBe(companyDocumentMock.companyId)
  })

  it('should return the correct createdAt date', () => {
    const document = new CompanyDocument(companyDocumentMock)
    expect(document.createdAt).toEqual(new Date('2023-01-01'))
  })

  it('should return the correct updatedAt date', () => {
    const document = new CompanyDocument(companyDocumentMock)
    expect(document.updatedAt).toEqual(new Date('2023-01-02'))
  })
})
