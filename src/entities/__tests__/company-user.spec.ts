import { describe, expect, it } from '@jest/globals'
import CompanyUser, { CompanyUserProps, Role } from '../CompanyUser'
import companyUserMock from '../../__mocks__/entities/company-user-mock'

describe('CompanyUser Class', () => {
  it('should create a CompanyUser instance', () => {
    const user = new CompanyUser(companyUserMock)
    expect(user).toBeInstanceOf(CompanyUser)
  })

  it('should return the correct ID', () => {
    const user = new CompanyUser(companyUserMock)
    expect(user.id).toBe(companyUserMock.id)
  })

  it('should return the correct owner status', () => {
    const user = new CompanyUser(companyUserMock)
    expect(user.isOwner).toBe(true)
  })

  it('should return the correct manager status', () => {
    const companyUserMockWithManagerRole: CompanyUserProps = {
      ...companyUserMock,
      role: Role.manager
    }
    const user = new CompanyUser(companyUserMockWithManagerRole)
    expect(user.isManager).toBe(true)
  })

  it('should return the correct resource', () => {
    const user = new CompanyUser(companyUserMock)
    expect(user.resource).toBe('company_user')
  })

  it('should return the correct name', () => {
    const user = new CompanyUser(companyUserMock)
    expect(user.name).toBe('John Doe')
  })

  it('should return the correct email', () => {
    const user = new CompanyUser(companyUserMock)
    expect(user.email).toBe('doe@example.com')
  })

  it('should return the correct encrypted password', () => {
    const user = new CompanyUser(companyUserMock)
    expect(user.encryptedPassword).toBe('hashed_password')
  })

  it('should return the correct role', () => {
    const user = new CompanyUser(companyUserMock)
    expect(user.role).toBe(Role.owner)
  })

  it('should return the correct companyId', () => {
    const user = new CompanyUser(companyUserMock)
    expect(user.companyId).toBe(companyUserMock.companyId)
  })

  it('should return the correct createdAt date', () => {
    const user = new CompanyUser(companyUserMock)
    expect(user.createdAt).toEqual(new Date('2023-01-01'))
  })

  it('should return the correct updatedAt date', () => {
    const user = new CompanyUser(companyUserMock)
    expect(user.updatedAt).toEqual(new Date('2023-01-02'))
  })
})
