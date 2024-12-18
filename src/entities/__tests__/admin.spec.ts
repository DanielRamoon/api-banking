import { describe, expect, it } from '@jest/globals'
import Admin, { Role, AdminProps } from '../Admin'
import adminMock from '../../__mocks__/entities/admin-mock'

describe('Admin Class', () => {
  it('should create an admin instance', () => {
    const admin = new Admin(adminMock)
    expect(admin).toBeInstanceOf(Admin)
  })

  it('should return the correct ID', () => {
    const admin = new Admin(adminMock)
    expect(admin.id).toBe(adminMock.id)
  })

  it('should return the correct resource', () => {
    const admin = new Admin(adminMock)
    expect(admin.resource).toBe('admin')
  })

  it('should return the correct name', () => {
    const admin = new Admin(adminMock)
    expect(admin.name).toBe('John Doe')
  })

  it('should return the correct email', () => {
    const admin = new Admin(adminMock)
    expect(admin.email).toBe('doe@example.com')
  })

  it('should return the correct encrypted password', () => {
    const admin = new Admin(adminMock)
    expect(admin.encryptedPassword).toBe('hashed_password')
  })

  it('should return the correct role', () => {
    const admin = new Admin(adminMock)
    expect(admin.role).toBe(Role.admin)
  })

  it('should return true for admin role', () => {
    const admin = new Admin(adminMock)
    expect(admin.isAdmin).toBe(true)
  })

  it('should return false for super admin role', () => {
    const adminMockWithSuperAdminRole: AdminProps = {
      ...adminMock,
      role: Role.super_admin
    }
    const admin = new Admin(adminMockWithSuperAdminRole)
    expect(admin.isAdmin).toBe(false)
  })

  it('should return true for super admin role', () => {
    const adminMockWithSuperAdminRole: AdminProps = {
      ...adminMock,
      role: Role.super_admin
    }
    const admin = new Admin(adminMockWithSuperAdminRole)
    expect(admin.isSuperAdmin).toBe(true)
  })

  it('should return false for admin role', () => {
    const admin = new Admin(adminMock)
    expect(admin.isSuperAdmin).toBe(false)
  })

  it('should return the correct createdAt date', () => {
    const admin = new Admin(adminMock)
    expect(admin.createdAt).toEqual(new Date('2023-01-01'))
  })

  it('should return the correct updatedAt date', () => {
    const admin = new Admin(adminMock)
    expect(admin.updatedAt).toEqual(new Date('2023-01-02'))
  })
})
