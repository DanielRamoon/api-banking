import { describe, expect, it } from '@jest/globals'
import walletMock from '../../../../__mocks__/entities/wallet-mock'
import WalletValidator from '../WalletValidator'
import { t } from '../../../../config/i18next/I18nextLocalization'
import { WalletProps, TransactionLevel } from '../../../../entities/Wallet'
import { z } from 'zod'

describe('WalletValidator', () => {
  it('should validate valid wallet parameters', async () => {
    const walletValidator = new WalletValidator(walletMock)

    expect(() => walletValidator.schema().parse(walletMock)).not.toThrow()
    expect(await walletValidator.validate()).toBe(true)
    expect(await walletValidator.errors()).toEqual([])
  })

  it('should validate valid name', async () => {
    const walletValidator = new WalletValidator(walletMock)

    expect(() => walletValidator.schema().parse(walletMock)).not.toThrow()
    expect(await walletValidator.validate()).toBe(true)
    expect(await walletValidator.errors()).toEqual([])
  })

  it('should throw validation error for invalid zoop account id', async () => {
    const invalidWalletParams: WalletProps = {
      ...walletMock,
      zoopAccountId: '123-456'
    }
    const walletValidator = new WalletValidator(invalidWalletParams)

    expect(() =>
      walletValidator.schema().parse(invalidWalletParams)
    ).toThrowError(z.ZodError)
    expect(await walletValidator.validate()).toBe(false)
    expect(await walletValidator.errors()).toContain(
      t('entity.wallet.error.zoopAccountId.format', {
        accountId: invalidWalletParams.zoopAccountId
      })
    )
  })

  it('should throw validation error for invalid zoop account id', async () => {
    const invalidWalletParams: WalletProps = {
      ...walletMock,
      userId: '123-456'
    }
    const walletValidator = new WalletValidator(invalidWalletParams)

    expect(() =>
      walletValidator.schema().parse(invalidWalletParams)
    ).toThrowError(z.ZodError)
    expect(await walletValidator.validate()).toBe(false)
    expect(await walletValidator.errors()).toContain(
      t('entity.wallet.error.userId.format', { id: invalidWalletParams.userId })
    )
  })

  it('should throw validation error for missing transactionLevel', async () => {
    const invalidWalletParams: WalletProps = {
      ...walletMock,
      transactionLevel: '' as TransactionLevel
    }
    const walletValidator = new WalletValidator(invalidWalletParams)

    expect(() =>
      walletValidator.schema().parse(invalidWalletParams)
    ).toThrowError(z.ZodError)
    expect(await walletValidator.validate()).toBe(false)
    expect(await walletValidator.errors()).toContain(
      t('entity.wallet.error.transactionLevel.invalid', {
        transactionLevel: invalidWalletParams.transactionLevel
      })
    )
  })

  it('should throw validation error for invalid transactionLevel', async () => {
    const invalidWalletParams: WalletProps = {
      ...walletMock,
      transactionLevel: '' as TransactionLevel
    }
    const walletValidator = new WalletValidator(invalidWalletParams)

    expect(() =>
      walletValidator.schema().parse(invalidWalletParams)
    ).toThrowError(z.ZodError)
    expect(await walletValidator.validate()).toBe(false)
    expect(await walletValidator.errors()).toContain(
      t('entity.wallet.error.transactionLevel.invalid', {
        transactionLevel: invalidWalletParams.transactionLevel
      })
    )
  })
})
