import CreateTokenService, { CreatreTokenProps } from '../CreateTokenService'
import { ApplicationError } from '../../helpers/ApplicationError'
import { JWT_TOKEN_REGEX } from '../../helpers/constants'
import { t } from '../../config/i18next/I18nextLocalization'

describe('CreateTokenService', () => {
  let createTokenService: CreateTokenService

  beforeEach(() => {
    createTokenService = new CreateTokenService()
  })

  it('should create a valid token', async () => {
    const payload = { userId: 123 }

    const result = await createTokenService.run({ payload })

    // Ensure the result is a string (JWT token)
    expect(result).toEqual(expect.stringMatching(JWT_TOKEN_REGEX))
  })

  it('should return an ApplicationError if payload is missing', async () => {
    const result = (await createTokenService.run(
      {} as CreatreTokenProps
    )) as ApplicationError

    expect(result).toBeInstanceOf(ApplicationError)
    expect(result.message).toBe(t('error.jwtToken.required'))
  })
})
