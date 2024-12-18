import { describe, expect, it } from '@jest/globals'
import Company from '../Company'
import companyMock from '../../__mocks__/entities/company-mock'

describe('Company Class', () => {
  it('should create a company instance', () => {
    const company = new Company(companyMock)
    expect(company).toBeInstanceOf(Company)
  })

  it('should return the correct ID', () => {
    const company = new Company(companyMock)
    expect(company.id).toBe(companyMock.id)
  })

  it('should return the correct resource', () => {
    const company = new Company(companyMock)
    expect(company.resource).toBe('company')
  })

  it('should return the correct name', () => {
    const company = new Company(companyMock)
    expect(company.name).toBe('John Smith')
  })

  it('should return the correct CNPJ', () => {
    const company = new Company(companyMock)
    expect(company.cnpj).toBe('58.638.614/0001-83')
  })

  it('should return the correct company name', () => {
    const company = new Company(companyMock)
    expect(company.companyName).toBe('Example Inc.')
  })

  it('should return the correct Zoop account ID', () => {
    const company = new Company(companyMock)
    expect(company.zoopAccountId).toBe(companyMock.zoopAccountId)
  })

  it('should return the correct blocked status', () => {
    const company = new Company(companyMock)
    expect(company.isBlocked).toBe(false)
  })

  it('should return the correct createdAt date', () => {
    const company = new Company(companyMock)
    expect(company.createdAt).toEqual(new Date('2023-01-01'))
  })

  it('should return the correct updatedAt date', () => {
    const company = new Company(companyMock)
    expect(company.updatedAt).toEqual(new Date('2023-01-02'))
  })
})
