import { describe, expect, it } from '@jest/globals'
import Holder, { AccountType, EstablishmentFormat } from '../Holder'
import holderMock from '../../__mocks__/entities/holder-mock'

describe('Holder Class', () => {
  it('should create a Holder instance', () => {
    const holder = new Holder(holderMock)
    expect(holder).toBeInstanceOf(Holder)
  })

  it('should return the correct ID', () => {
    const holder = new Holder(holderMock)
    expect(holder.id).toBe(holderMock.id)
  })

  it('should return the correct resource', () => {
    const holder = new Holder(holderMock)
    expect(holder.resource).toBe('holder')
  })

  it('should return the correct zoopHolderId', () => {
    const holder = new Holder(holderMock)
    expect(holder.zoopHolderId).toBe(holderMock.zoopHolderId)
  })

  it('should return the correct zoopAccountId', () => {
    const holder = new Holder(holderMock)
    expect(holder.zoopAccountId).toBe(holderMock.zoopAccountId)
  })

  it('should return the correct taxpayerId', () => {
    const holder = new Holder(holderMock)
    expect(holder.taxpayerId).toBe(holderMock.taxpayerId)
  })

  it('should return the correct name', () => {
    const holder = new Holder(holderMock)
    expect(holder.name).toBe('John Doe')
  })

  it('should return the correct accountType', () => {
    const holder = new Holder(holderMock)
    expect(holder.accountType).toBe(AccountType.individual)
  })

  it('should return the correct email', () => {
    const holder = new Holder(holderMock)
    expect(holder.email).toBe('doe@example.com')
  })

  it('should return the correct cnpj', () => {
    const holder = new Holder(holderMock)
    expect(holder.cnpj).toBe(holderMock.cnpj)
  })

  it('should return the correct revenueCents', () => {
    const holder = new Holder(holderMock)
    expect(holder.revenueCents).toBe(100000)
  })

  it('should return the correct cbo', () => {
    const holder = new Holder(holderMock)
    expect(holder.cbo).toBe('766305')
  })

  it('should return the correct rg', () => {
    const holder = new Holder(holderMock)
    expect(holder.rg).toBe(holderMock.rg)
  })

  it('should return the correct pep', () => {
    const holder = new Holder(holderMock)
    expect(holder.pep).toBe(false)
  })

  it('should return the correct mothersName', () => {
    const holder = new Holder(holderMock)
    expect(holder.mothersName).toBe('Mary Mother')
  })

  it('should return the correct birthday', () => {
    const holder = new Holder(holderMock)
    expect(holder.birthday).toEqual(holderMock.birthday)
  })

  it('should return the correct cnae', () => {
    const holder = new Holder(holderMock)
    expect(holder.cnae).toBe('0112101')
  })

  it('should return the correct legalName', () => {
    const holder = new Holder(holderMock)
    expect(holder.legalName).toBe('John Doe')
  })

  it('should return the correct establishmentFormat', () => {
    const holder = new Holder(holderMock)
    expect(holder.establishmentFormat).toBe(EstablishmentFormat.MEI)
  })

  it('should return the correct establishmentDate', () => {
    const holder = new Holder(holderMock)
    expect(holder.establishmentDate).toEqual(holderMock.establishmentDate)
  })

  it('should return the correct phoneAreaCode', () => {
    const holder = new Holder(holderMock)
    expect(holder.phoneAreaCode).toBe('55')
  })

  it('should return the correct phonePrefix', () => {
    const holder = new Holder(holderMock)
    expect(holder.phonePrefix).toBe('91')
  })

  it('should return the correct phoneNumber', () => {
    const holder = new Holder(holderMock)
    expect(holder.phoneNumber).toBe('99999-9999')
  })

  it('should return the correct phone', () => {
    const holder = new Holder(holderMock)
    expect(holder.phone).toBe('+55 (91) 99999-9999')
  })

  it('should return the correct addressStreet', () => {
    const holder = new Holder(holderMock)
    expect(holder.addressStreet).toBe('123 Main St')
  })

  it('should return the correct addressNumber', () => {
    const holder = new Holder(holderMock)
    expect(holder.addressNumber).toBe('456')
  })

  it('should return the correct addressCity', () => {
    const holder = new Holder(holderMock)
    expect(holder.addressCity).toBe('City')
  })

  it('should return the correct addressComplement', () => {
    const holder = new Holder(holderMock)
    expect(holder.addressComplement).toBe('Apt 789')
  })

  it('should return the correct addressState', () => {
    const holder = new Holder(holderMock)
    expect(holder.addressState).toBe('State')
  })

  it('should return the correct addressNeighborhood', () => {
    const holder = new Holder(holderMock)
    expect(holder.addressNeighborhood).toBe('Neighborhood')
  })

  it('should return the correct addressPostalCode', () => {
    const holder = new Holder(holderMock)
    expect(holder.addressPostalCode).toBe('12345-678')
  })

  it('should return the correct addressCountry', () => {
    const holder = new Holder(holderMock)
    expect(holder.addressCountry).toBe('Country')
  })

  it('should return the correct createdAt date', () => {
    const holder = new Holder(holderMock)
    expect(holder.createdAt).toEqual(new Date('2023-01-01'))
  })

  it('should return the correct updatedAt date', () => {
    const holder = new Holder(holderMock)
    expect(holder.updatedAt).toEqual(new Date('2023-01-02'))
  })
})
