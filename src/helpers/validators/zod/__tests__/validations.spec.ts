import { describe, expect, it } from '@jest/globals'
import { validCNPJ, validTaxpayerId } from '../../validations'

describe('validTaxpayerId', () => {
  it('should return true for valid taxpayer IDs', () => {
    expect(validTaxpayerId('442.144.850-84')).toBe(true)
    expect(validTaxpayerId('15825041052')).toBe(true)
  })

  it('should return false for invalid taxpayer IDs', () => {
    expect(validTaxpayerId('1234567890')).toBe(false) // Invalid length
    expect(validTaxpayerId('00000000000')).toBe(false) // Known invalid ID
    expect(validTaxpayerId('12345678901')).toBe(false) // Invalid check digits
  })
})

describe('validCNPJ', () => {
  it('should return true for valid CNPJs', () => {
    expect(validCNPJ('38.652.088/0001-07')).toBe(true)
    expect(validCNPJ('11118146000152')).toBe(true)
  })

  it('should return false for invalid CNPJs', () => {
    expect(validCNPJ('123456789')).toBe(false) // Invalid length
    expect(validCNPJ('00000000000000')).toBe(false) // Known invalid CNPJ
    expect(validCNPJ('12345678000111')).toBe(false) // Invalid check digits
  })
})
