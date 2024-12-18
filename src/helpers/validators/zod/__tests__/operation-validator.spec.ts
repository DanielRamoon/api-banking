import { describe, expect, it } from '@jest/globals'
import operationMock from '../../../../__mocks__/entities/operation-mock'
import OperationValidator from '../OperationValidator'
import { t } from '../../../../config/i18next/I18nextLocalization'
import { OperationProps } from '../../../../entities/Operation'
import { z } from 'zod'

describe('OperationValidator', () => {
  it('should validate valid operation parameters', async () => {
    const operationValidator = new OperationValidator(operationMock)

    expect(() => operationValidator.schema().parse(operationMock)).not.toThrow()
    expect(await operationValidator.validate()).toBe(true)
    expect(await operationValidator.errors()).toEqual([])
  })

  it('should throw validation error for invalid operation id', async () => {
    const invalidOperationParams: OperationProps = {
      ...operationMock,
      id: '123-456'
    }
    const operationValidator = new OperationValidator(invalidOperationParams)

    expect(() =>
      operationValidator.schema().parse(invalidOperationParams)
    ).toThrowError(z.ZodError)
    expect(await operationValidator.validate()).toBe(false)
    expect(await operationValidator.errors()).toContain(
      t('entity.operation.error.id.format', { id: invalidOperationParams.id })
    )
  })

  it('should throw validation error for missing type', async () => {
    const invalidOperationParams: OperationProps = {
      ...operationMock,
      type: ''
    }
    const operationValidator = new OperationValidator(invalidOperationParams)

    expect(() =>
      operationValidator.schema().parse(invalidOperationParams)
    ).toThrowError(z.ZodError)
    expect(await operationValidator.validate()).toBe(false)
    expect(await operationValidator.errors()).toContain(
      t('entity.operation.error.type.format', { type: '' })
    )
  })

  it('should throw validation error for invalid amountCents', async () => {
    const invalidOperationParams: OperationProps = {
      ...operationMock,
      amountCents: -10
    }
    const operationValidator = new OperationValidator(invalidOperationParams)

    expect(() =>
      operationValidator.schema().parse(invalidOperationParams)
    ).toThrowError(z.ZodError)
    expect(await operationValidator.validate()).toBe(false)
    expect(await operationValidator.errors()).toContain(
      t('entity.operation.error.amountCents.value', {
        value: invalidOperationParams.amountCents
      })
    )
  })

  it('should throw validation error for invalid currency', async () => {
    const invalidOperationParams: OperationProps = {
      ...operationMock,
      currency: 'US'
    }
    const operationValidator = new OperationValidator(invalidOperationParams)

    expect(() =>
      operationValidator.schema().parse(invalidOperationParams)
    ).toThrowError(z.ZodError)
    expect(await operationValidator.validate()).toBe(false)
    expect(await operationValidator.errors()).toContain(
      t('entity.operation.error.currency.length', {
        currency: invalidOperationParams.currency
      })
    )
  })

  it('should throw validation error for invalid holder id', async () => {
    const invalidOperationParams: OperationProps = {
      ...operationMock,
      holderId: '123-456'
    }
    const operationValidator = new OperationValidator(invalidOperationParams)

    expect(() =>
      operationValidator.schema().parse(invalidOperationParams)
    ).toThrowError(z.ZodError)
    expect(await operationValidator.validate()).toBe(false)
    expect(await operationValidator.errors()).toContain(
      t('entity.operation.error.holderId.format', {
        id: invalidOperationParams.holderId
      })
    )
  })

  it('should throw validation error for invalid wallet id', async () => {
    const invalidOperationParams: OperationProps = {
      ...operationMock,
      walletId: '123-456'
    }
    const operationValidator = new OperationValidator(invalidOperationParams)

    expect(() =>
      operationValidator.schema().parse(invalidOperationParams)
    ).toThrowError(z.ZodError)
    expect(await operationValidator.validate()).toBe(false)
    expect(await operationValidator.errors()).toContain(
      t('entity.operation.error.walletId.format', {
        id: invalidOperationParams.walletId
      })
    )
  })

  it('should throw validation error for invalid zoop operation id', async () => {
    const invalidOperationParams: OperationProps = {
      ...operationMock,
      zoopOperationId: '123-456'
    }
    const operationValidator = new OperationValidator(invalidOperationParams)

    expect(() =>
      operationValidator.schema().parse(invalidOperationParams)
    ).toThrowError(z.ZodError)
    expect(await operationValidator.validate()).toBe(false)
    expect(await operationValidator.errors()).toContain(
      t('entity.operation.error.zoopOperationId.format', {
        operationId: invalidOperationParams.zoopOperationId
      })
    )
  })
})
