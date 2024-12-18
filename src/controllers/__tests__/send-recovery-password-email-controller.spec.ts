/* eslint-disable @typescript-eslint/no-explicit-any */
import SendRecoveryPasswordEmailController from '../SendRecoveryPasswordEmailController'
import SendMailService from '../../services/SendMailService'
import { ApplicationError } from '../../helpers/ApplicationError'
import { ok } from '../../adapters/http/HttpResponseAdapter'
import { t } from '../../config/i18next/I18nextLocalization'

const mockSendMailService: SendMailService = {
  run: jest.fn()
}

const sendRecoveryPasswordEmailController =
  new SendRecoveryPasswordEmailController(mockSendMailService)

describe('SendRecoveryPasswordEmailController', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should send a recovery password email successfully', async () => {
    const inputProps = {
      type: 'passwordRecovery',
      email: 'user@example.com',
      name: 'John Doe'
    }

    const expectedResponse = { message: 'Email sent successfully' }

    ;(mockSendMailService.run as jest.Mock).mockResolvedValue(expectedResponse)

    const result = await sendRecoveryPasswordEmailController.handle(inputProps)

    expect(result).toEqual(ok(expectedResponse))
    expect(mockSendMailService.run).toHaveBeenCalledWith(inputProps)
  })

  it('should return a fail response if an internal error occurs', async () => {
    const inputProps = {
      type: 'passwordRecovery',
      email: 'user@example.com',
      name: 'John Doe'
    }

    ;(mockSendMailService.run as jest.Mock).mockImplementation(() => {
      throw fail(new ApplicationError(t('error.internal')))
    })

    const result: any =
      await sendRecoveryPasswordEmailController.handle(inputProps)

    expect(result.statusCode).toBe(500)
    expect(result.body.error).toBe(t('error.internal'))
    expect(mockSendMailService.run).toHaveBeenCalledWith(inputProps)
  })
})
