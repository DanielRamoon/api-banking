import VerifyTokenService, { VerifyTokenProps } from '../VerifyTokenService'
import { ApplicationError } from '../../helpers/ApplicationError'
import CreateTokenService from '../CreateTokenService'
import { t } from '../../config/i18next/I18nextLocalization'
import jwt from 'jsonwebtoken'

type ResultProps = {
  id: number
  email: string
  type: string
  exp: string
}

describe('VerifyTokenService', () => {
  let verifyTokenService: VerifyTokenService
  let createTokenService: CreateTokenService

  const invalidTokenSecret = 'invalid-token-secret'

  beforeAll(() => {
    verifyTokenService = new VerifyTokenService()
    createTokenService = new CreateTokenService()
  })

  it('should verify a valid token', async () => {
    const payload = { id: 123 }
    const validToken = await createTokenService.run({ payload })

    const result = (await verifyTokenService.run({
      token: validToken
    } as VerifyTokenProps)) as ResultProps

    expect(result.id).toBe(123)
    expect(typeof result.exp).toBe('number')
  })

  it('should return an ApplicationError for an invalid token', async () => {
    const invalidToken = 'invalid-token'

    const result = (await verifyTokenService.run({
      token: invalidToken
    })) as ApplicationError

    expect(result).toBeInstanceOf(ApplicationError)
    expect(result.message).toBe(t('error.jwtToken.verify'))
  })

  it('should return an ApplicationError for a token signed with an invalid secret', async () => {
    const payload = { userId: 456 }
    const tokenWithInvalidSecret = jwt.sign(payload, invalidTokenSecret)

    const result = (await verifyTokenService.run({
      token: tokenWithInvalidSecret
    })) as ApplicationError

    expect(result).toBeInstanceOf(ApplicationError)
    expect(result.message).toBe(t('error.jwtToken.verify'))
  })

  it('should return an ApplicationError for an expired token', async () => {
    // Create a token with a short expiration time (1 second)
    const payload = { userId: 123 }
    const expiredToken = await createTokenService.run({
      payload,
      expiresIn: '1s'
    })

    // Wait for the token to expire
    await new Promise(resolve => setTimeout(resolve, 1000))

    const result = (await verifyTokenService.run({
      token: expiredToken
    } as VerifyTokenProps)) as ApplicationError

    expect(result).toBeInstanceOf(ApplicationError)
    expect(result.message).toBe(t('error.jwtToken.verify'))
  })
})
