import { describe, expect, it } from '@jest/globals'
import Wallet, { TransactionLevel } from '../Wallet'
import walletMock from '../../__mocks__/entities/wallet-mock'

describe('Wallet Class', () => {
  it('should create a Wallet instance', () => {
    const wallet = new Wallet(walletMock)
    expect(wallet).toBeInstanceOf(Wallet)
  })

  it('should return the correct ID', () => {
    const wallet = new Wallet(walletMock)
    expect(wallet.id).toBe(walletMock.id)
  })

  it('should return the correct resource', () => {
    const wallet = new Wallet(walletMock)
    expect(wallet.resource).toBe('wallet')
  })

  it('should return the correct zoopAccountId', () => {
    const wallet = new Wallet(walletMock)
    expect(wallet.zoopAccountId).toBe(wallet.zoopAccountId)
  })

  it('should return the correct isPrimary value', () => {
    const wallet = new Wallet(walletMock)
    expect(wallet.isPrimary).toBe(true)
  })

  it('should return the correct transactionLevel', () => {
    const wallet = new Wallet(walletMock)
    expect(wallet.transactionLevel).toBe(TransactionLevel.internal)
  })

  it('should return the correct userId', () => {
    const wallet = new Wallet(walletMock)
    expect(wallet.userId).toBe(walletMock.userId)
  })

  it('should return the correct createdAt date', () => {
    const wallet = new Wallet(walletMock)
    expect(wallet.createdAt).toEqual(new Date('2023-01-01'))
  })

  it('should return the correct updatedAt date', () => {
    const wallet = new Wallet(walletMock)
    expect(wallet.updatedAt).toEqual(new Date('2023-01-02'))
  })
})
