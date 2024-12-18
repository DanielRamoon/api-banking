import { describe, expect, it } from '@jest/globals'
import Operation from '../Operation'
import operationMock from '../../__mocks__/entities/operation-mock'

describe('Operation Class', () => {
  it('should create an Operation instance', () => {
    const operation = new Operation(operationMock)
    expect(operation).toBeInstanceOf(Operation)
  })

  it('should return the correct ID', () => {
    const operation = new Operation(operationMock)
    expect(operation.id).toBe(operationMock.id)
  })

  it('should return the correct resource', () => {
    const operation = new Operation(operationMock)
    expect(operation.resource).toBe('operation')
  })

  it('should return the correct zoopOperationId', () => {
    const operation = new Operation(operationMock)
    expect(operation.zoopOperationId).toBe(operation.zoopOperationId)
  })

  it('should return the correct type', () => {
    const operation = new Operation(operationMock)
    expect(operation.type).toBe('payment')
  })

  it('should return the correct amountCents', () => {
    const operation = new Operation(operationMock)
    expect(operation.amountCents).toBe(10000)
  })

  it('should return the correct currency', () => {
    const operation = new Operation(operationMock)
    expect(operation.currency).toBe('BRL')
  })

  it('should return the correct holderId', () => {
    const operation = new Operation(operationMock)
    expect(operation.holderId).toBe(operationMock.holderId)
  })

  it('should return the correct walletId', () => {
    const operation = new Operation(operationMock)
    expect(operation.walletId).toBe(operationMock.walletId)
  })

  it('should return the correct createdAt date', () => {
    const operation = new Operation(operationMock)
    expect(operation.createdAt).toEqual(new Date('2023-01-01'))
  })

  it('should return the correct updatedAt date', () => {
    const operation = new Operation(operationMock)
    expect(operation.updatedAt).toEqual(new Date('2023-01-02'))
  })
})
