import { RG_REGEX } from '../constants'

export const validTaxpayerId = (taxpayerId: string): boolean => {
  taxpayerId = taxpayerId.replace(/[^\d]+/g, '')
  if (taxpayerId === '') return false

  if (
    taxpayerId.length !== 11 ||
    taxpayerId === '00000000000' ||
    taxpayerId === '11111111111' ||
    taxpayerId === '22222222222' ||
    taxpayerId === '33333333333' ||
    taxpayerId === '44444444444' ||
    taxpayerId === '55555555555' ||
    taxpayerId === '66666666666' ||
    taxpayerId === '77777777777' ||
    taxpayerId === '88888888888' ||
    taxpayerId === '99999999999'
  ) {
    return false
  }

  // valid first digit
  let add = 0
  for (let i = 0; i < 9; i++) add += parseInt(taxpayerId.charAt(i)) * (10 - i)
  let rev = 11 - (add % 11)
  if (rev == 10 || rev == 11) rev = 0
  if (rev != parseInt(taxpayerId.charAt(9))) return false

  // Valid second digit
  add = 0
  for (let i = 0; i < 10; i++) add += parseInt(taxpayerId.charAt(i)) * (11 - i)
  rev = 11 - (add % 11)
  if (rev == 10 || rev == 11) rev = 0
  if (rev != parseInt(taxpayerId.charAt(10))) return false

  return true
}

export const validCNPJ = (cnpj: string): boolean => {
  cnpj = cnpj.replace(/[^\d]+/g, '')

  if (cnpj === '') return false

  if (cnpj.length != 14) return false

  // Remove invalid known cnpjs
  if (
    cnpj === '00000000000000' ||
    cnpj === '11111111111111' ||
    cnpj === '22222222222222' ||
    cnpj === '33333333333333' ||
    cnpj === '44444444444444' ||
    cnpj === '55555555555555' ||
    cnpj === '66666666666666' ||
    cnpj === '77777777777777' ||
    cnpj === '88888888888888' ||
    cnpj === '99999999999999'
  )
    return false

  let length = cnpj.length - 2
  let numbers = cnpj.substring(0, length)
  const digits = cnpj.substring(length)
  let sum: number = 0
  let pos = length - 7
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result != parseInt(digits.charAt(0))) return false

  length = length + 1
  numbers = cnpj.substring(0, length)
  sum = 0
  pos = length - 7
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result != parseInt(digits.charAt(1))) return false

  return true
}

export const validRG = (rg: string): boolean => {
  rg = rg.replace(/[^\d]+/g, '')

  if (rg === '') return false
  if (rg.length != 9) return false

  return RG_REGEX.test(rg)
}
