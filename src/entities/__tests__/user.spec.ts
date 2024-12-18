import { describe, expect, it } from '@jest/globals'
import User from '../User'
import userMock from '../../__mocks__/entities/user-mock'

describe('User Class', () => {
  it('should create a user instance', () => {
    const user = new User(userMock)
    expect(user).toBeInstanceOf(User)
  })

  it('should return the correct ID', () => {
    const user = new User(userMock)
    expect(user.id).toBe(userMock.id)
  })

  it('should return the correct resource', () => {
    const user = new User(userMock)
    expect(user.resource).toBe('user')
  })

  it('should return the correct email', () => {
    const user = new User(userMock)
    expect(user.email).toBe('doe@example.com')
  })

  it('should return the correct phone prefix', () => {
    const user = new User(userMock)
    expect(user.phonePrefix).toBe('91')
  })

  it('should return the correct phone', () => {
    const user = new User(userMock)
    expect(user.phone).toBe('98385-1504')
  })

  it('should return the correct formatted phone', () => {
    const user = new User(userMock)
    expect(user.phoneFormatted).toBe('(91) 9 8385-1504')
  })

  it('should return the correct encrypted password', () => {
    const user = new User(userMock)
    expect(user.props.encryptedPassword).toBe('hashed_password')
  })

  it('should return the correct blocked status', () => {
    const user = new User(userMock)
    expect(user.isBlocked).toBe(false)
  })

  it('should return the correct createdAt date', () => {
    const user = new User(userMock)
    expect(user.createdAt).toEqual(new Date('2023-01-01'))
  })

  it('should return the correct updatedAt date', () => {
    const user = new User(userMock)
    expect(user.updatedAt).toEqual(new Date('2023-01-02'))
  })
})
