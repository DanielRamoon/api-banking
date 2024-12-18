import { describe, expect, it, beforeAll } from '@jest/globals'
import companyUserMock from '../../../../__mocks__/entities/company-user-mock'
import CompanyUserValidator from '../CompanyUserValidator'
import { t } from '../../../../config/i18next/I18nextLocalization'
import { CompanyUserProps, Role } from '../../../../entities/CompanyUser'
import { z } from 'zod'
import { ICompanyUserRepository } from '../../../../repositories/ICompanyUserRepository'
import CompanyUserRepository from '../../../../repositories/memory/CompanyUserRepository'

let companyUserRepository: ICompanyUserRepository

beforeAll(() => {
  companyUserRepository = new CompanyUserRepository()
})

describe('CompanyUserValidator', () => {
  it('should validate valid user parameters', async () => {
    const companyUserValidator = new CompanyUserValidator(
      companyUserMock,
      companyUserRepository
    )

    expect(() =>
      companyUserValidator.schema().parse(companyUserMock)
    ).not.toThrow()
    expect(await companyUserValidator.validate()).toBe(true)
    expect(await companyUserValidator.errors()).toEqual([])
  })

  it('should throw validation error for missing email', async () => {
    const invalidCompanyUserParams: CompanyUserProps = {
      ...companyUserMock,
      email: ''
    }
    const companyUserValidator = new CompanyUserValidator(
      invalidCompanyUserParams,
      companyUserRepository
    )

    expect(() =>
      companyUserValidator.schema().parse(companyUserMock)
    ).not.toThrow()
    expect(await companyUserValidator.validate()).toBe(false)
    expect(await companyUserValidator.errors()).toContain(
      t('entity.companyUser.error.email.format', { email: '' })
    )
  })

  it('should throw validation error for invalid email format', async () => {
    const invalidCompanyUserParams: CompanyUserProps = {
      ...companyUserMock,
      email: 'invalidemail'
    }
    const companyUserValidator = new CompanyUserValidator(
      invalidCompanyUserParams,
      companyUserRepository
    )

    expect(() =>
      companyUserValidator.schema().parse(invalidCompanyUserParams)
    ).toThrowError(z.ZodError)
    expect(await companyUserValidator.validate()).toBe(false)
    expect(await companyUserValidator.errors()).toContain(
      t('entity.companyUser.error.email.format', { email: 'invalidemail' })
    )
  })

  it('should validate valid name', async () => {
    const companyUserValidator = new CompanyUserValidator(
      companyUserMock,
      companyUserRepository
    )

    expect(() =>
      companyUserValidator.schema().parse(companyUserMock)
    ).not.toThrow()
    expect(await companyUserValidator.validate()).toBe(true)
    expect(await companyUserValidator.errors()).toEqual([])
  })

  it('should throw validation error for missing name', async () => {
    const invalidCompanyUserParams: CompanyUserProps = {
      ...companyUserMock,
      name: ''
    }
    const companyUserValidator = new CompanyUserValidator(
      invalidCompanyUserParams,
      companyUserRepository
    )

    expect(() =>
      companyUserValidator.schema().parse(invalidCompanyUserParams)
    ).toThrowError(z.ZodError)
    expect(await companyUserValidator.validate()).toBe(false)
    expect(await companyUserValidator.errors()).toContain(
      t('entity.companyUser.error.name.length', {
        name: invalidCompanyUserParams.name
      })
    )
  })

  it('should throw validation error for invalid name format', async () => {
    const invalidCompanyUserParams: CompanyUserProps = {
      ...companyUserMock,
      name: '123'
    }
    const companyUserValidator = new CompanyUserValidator(
      invalidCompanyUserParams,
      companyUserRepository
    )

    expect(() =>
      companyUserValidator.schema().parse(invalidCompanyUserParams)
    ).toThrowError(z.ZodError)
    expect(await companyUserValidator.validate()).toBe(false)
    expect(await companyUserValidator.errors()).toContain(
      t('entity.companyUser.error.name.length', {
        name: invalidCompanyUserParams.name
      })
    )
  })

  it('should validate valid role', async () => {
    const companyUserValidator = new CompanyUserValidator(
      companyUserMock,
      companyUserRepository
    )

    expect(() =>
      companyUserValidator.schema().parse(companyUserMock)
    ).not.toThrow()
    expect(await companyUserValidator.validate()).toBe(true)
    expect(await companyUserValidator.errors()).toEqual([])
  })

  it('should throw validation error for missing role', async () => {
    const invalidCompanyUserParams: CompanyUserProps = {
      ...companyUserMock,
      role: '' as Role
    }
    const companyUserValidator = new CompanyUserValidator(
      invalidCompanyUserParams,
      companyUserRepository
    )

    expect(() =>
      companyUserValidator.schema().parse(invalidCompanyUserParams)
    ).toThrowError(z.ZodError)
    expect(await companyUserValidator.validate()).toBe(false)
    expect(await companyUserValidator.errors()).toContain(
      t('entity.companyUser.error.role.invalid', {
        role: invalidCompanyUserParams.role
      })
    )
  })

  it('should throw validation error for invalid role', async () => {
    const invalidCompanyUserParams: CompanyUserProps = {
      ...companyUserMock,
      role: 'invalid' as Role
    }
    const companyUserValidator = new CompanyUserValidator(
      invalidCompanyUserParams,
      companyUserRepository
    )

    expect(() =>
      companyUserValidator.schema().parse(invalidCompanyUserParams)
    ).toThrowError(z.ZodError)
    expect(await companyUserValidator.validate()).toBe(false)
    expect(await companyUserValidator.errors()).toContain(
      t('entity.companyUser.error.role.invalid', {
        role: invalidCompanyUserParams.role
      })
    )
  })

  it('should throw validation error for invalid company id', async () => {
    const invalidCompanyUserParams: CompanyUserProps = {
      ...companyUserMock,
      companyId: '123-456'
    }
    const companyUserValidator = new CompanyUserValidator(
      invalidCompanyUserParams,
      companyUserRepository
    )

    expect(() =>
      companyUserValidator.schema().parse(invalidCompanyUserParams)
    ).toThrowError(z.ZodError)
    expect(await companyUserValidator.validate()).toBe(false)
    expect(await companyUserValidator.errors()).toContain(
      t('entity.companyUser.error.companyId.format', {
        id: invalidCompanyUserParams.companyId
      })
    )
  })
})
