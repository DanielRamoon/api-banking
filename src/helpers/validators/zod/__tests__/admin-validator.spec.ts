import { describe, expect, it, beforeAll } from '@jest/globals'
import adminMock from '../../../../__mocks__/entities/admin-mock'
import AdminValidator from '../AdminValidator'
import { t } from '../../../../config/i18next/I18nextLocalization'
import { AdminProps, Role } from '../../../../entities/Admin'
import { IAdminRepository } from '../../../../repositories/IAdminRepository'
import AdminRepository from '../../../../repositories/memory/AdminRepository'

let adminRepository: IAdminRepository

beforeAll(() => {
  adminRepository = new AdminRepository()
})

describe('AdminValidator', () => {
  it('should validate valid user parameters', async () => {
    const adminValidator = new AdminValidator(adminMock, adminRepository)

    expect(() => adminValidator.schema().parseAsync(adminMock)).not.toThrow()
    expect(await adminValidator.validate()).toBe(true)
    expect(await adminValidator.errors()).toEqual([])
  })

  it('should throw validation error for missing email', async () => {
    const invalidAdminParams: AdminProps = { ...adminMock, email: '' }
    const adminValidator = new AdminValidator(
      invalidAdminParams,
      adminRepository
    )

    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.admin.error.email.format', { email: '' })
    )
  })

  it('should throw validation error for invalid email format', async () => {
    const invalidAdminParams: AdminProps = {
      ...adminMock,
      email: 'invalidemail'
    }
    const adminValidator = new AdminValidator(
      invalidAdminParams,
      adminRepository
    )

    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.admin.error.email.format', { email: 'invalidemail' })
    )
  })

  it('should validate valid name', async () => {
    const adminValidator = new AdminValidator(adminMock, adminRepository)

    expect(await adminValidator.validate()).toBe(true)
    expect(await adminValidator.errors()).toEqual([])
  })

  it('should throw validation error for missing name', async () => {
    const invalidAdminParams: AdminProps = { ...adminMock, name: '' }
    const adminValidator = new AdminValidator(
      invalidAdminParams,
      adminRepository
    )

    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.admin.error.name.length', { name: invalidAdminParams.name })
    )
  })

  it('should throw validation error for invalid name format', async () => {
    const invalidAdminParams: AdminProps = { ...adminMock, name: '123' }
    const adminValidator = new AdminValidator(
      invalidAdminParams,
      adminRepository
    )

    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.admin.error.name.length', { name: invalidAdminParams.name })
    )
  })

  it('should validate valid role', async () => {
    const adminValidator = new AdminValidator(adminMock, adminRepository)

    expect(await adminValidator.validate()).toBe(true)
    expect(await adminValidator.errors()).toEqual([])
  })

  it('should throw validation error for missing role', async () => {
    const invalidAdminParams: AdminProps = { ...adminMock, role: '' as Role }
    const adminValidator = new AdminValidator(
      invalidAdminParams,
      adminRepository
    )

    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.admin.error.role.invalid', { role: invalidAdminParams.role })
    )
  })

  it('should throw validation error for invalid role', async () => {
    const invalidAdminParams: AdminProps = {
      ...adminMock,
      role: 'invalid' as Role
    }
    const adminValidator = new AdminValidator(
      invalidAdminParams,
      adminRepository
    )

    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.admin.error.role.invalid', { role: invalidAdminParams.role })
    )
  })
})
