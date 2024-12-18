/* eslint-disable @typescript-eslint/no-explicit-any */
import UpdatePasswordController from '../UpdatePasswordController'
import { ApplicationError } from '../../helpers/ApplicationError'
import { fail, ok } from '../../adapters/http/HttpResponseAdapter'
import { ApplicationService } from '../../services/ApplicationService'
import { t } from '../../config/i18next/I18nextLocalization'

const mockApplicationService: ApplicationService = {
  run: jest.fn()
}

const updatePasswordController = new UpdatePasswordController(
  mockApplicationService
)

describe('UpdatePasswordController', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should update the password successfully', async () => {
    const inputProps = {
      token: 'valid-token',
      password: 'Newp@ssw0rd',
      confirmPassword: 'Newp@ssw0rd'
    }

    const expectedResponse = { message: 'Password updated successfully' }

    ;(mockApplicationService.run as jest.Mock).mockResolvedValue(
      expectedResponse
    )

    const result = await updatePasswordController.handle(inputProps)

    expect(result).toEqual(ok(expectedResponse))
    expect(mockApplicationService.run).toHaveBeenCalledWith(inputProps)
  })

  it('should return a fail response if an internal error occurs', async () => {
    const inputProps = {
      token: 'valid-token',
      password: 'Newp@ssw0rd',
      confirmPassword: 'Newp@ssw0rd'
    }

    ;(mockApplicationService.run as jest.Mock).mockImplementation(() => {
      throw fail(new ApplicationError(t('error.internal')))
    })

    const result: any = await updatePasswordController.handle(inputProps)

    expect(result.statusCode).toBe(500)
    expect(result.body.error).toBe(t('error.internal'))
    expect(mockApplicationService.run).toHaveBeenCalledWith(inputProps)
  })
})
