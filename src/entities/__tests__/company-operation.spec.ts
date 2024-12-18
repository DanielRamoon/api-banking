import { describe, expect, it } from '@jest/globals'
import CompanyOperation from '../CompanyOperation'
import companyOperationMock from '../../__mocks__/entities/company-operation-mock'

describe('CompanyOperation Class', () => {
  it('should create an operation instance', () => {
    const operation = new CompanyOperation(companyOperationMock)
    expect(operation).toBeInstanceOf(CompanyOperation)
  })

  it('should return the correct ID', () => {
    const operation = new CompanyOperation(companyOperationMock)
    expect(operation.id).toBe(companyOperationMock.id)
  })

  it('should return the correct resource', () => {
    const operation = new CompanyOperation(companyOperationMock)
    expect(operation.resource).toBe('company_operation')
  })

  it('should return the correct Zoop operation ID', () => {
    const operation = new CompanyOperation(companyOperationMock)
    expect(operation.zoopOperationId).toBe(companyOperationMock.zoopOperationId)
  })

  it('should return the correct type', () => {
    const operation = new CompanyOperation(companyOperationMock)
    expect(operation.type).toBe('payment')
  })

  it('should return the correct amount', () => {
    const operation = new CompanyOperation(companyOperationMock)
    expect(operation.amount).toBe(100.0)
  })

  it('should return the correct currency', () => {
    const operation = new CompanyOperation(companyOperationMock)
    expect(operation.currency).toBe('BRL')
  })

  it('should return the correct companyId', () => {
    const operation = new CompanyOperation(companyOperationMock)
    expect(operation.companyId).toBe(companyOperationMock.companyId)
  })

  it('should return the correct createdAt date', () => {
    const operation = new CompanyOperation(companyOperationMock)
    expect(operation.createdAt).toEqual(new Date('2023-01-01'))
  })

  it('should return the correct updatedAt date', () => {
    const operation = new CompanyOperation(companyOperationMock)
    expect(operation.updatedAt).toEqual(new Date('2023-01-02'))
  })
})
