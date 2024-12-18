import SendRecoveryPasswordEmailService from '../../mailers/SendRecoveryPasswordEmailService'
import { ApplicationError } from '../../../helpers/ApplicationError'
import { ApplicationMailer } from '../../../mailers/ApplicationMailer'
import { ApplicationRepositoryHelper } from '../../../helpers/ApplicationRepositoryHelper'
import { t } from '../../../config/i18next/I18nextLocalization'

const mockApplicationMailer: ApplicationMailer = {
  sendRecoveryPassword: jest.fn(),
  send: jest.fn()
}

const mockApplicationRepository: ApplicationRepositoryHelper = {
  getRepositoryInstance: jest.fn()
}

const sendRecoveryPasswordEmailService = new SendRecoveryPasswordEmailService(
  mockApplicationMailer,
  mockApplicationRepository
)

const mockRepository = {
  emailExists: jest.fn().mockResolvedValue(true)
}

describe('SendRecoveryPasswordEmailService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should send a recovery password email successfully', async () => {
    const inputProps = {
      type: 'user',
      email: 'example@example.com',
      name: 'John Doe'
    }

    const expectedResponse = { message: 'Email sent successfully' }

    ;(
      mockApplicationRepository.getRepositoryInstance as jest.Mock
    ).mockReturnValue(mockRepository)
    ;(
      mockApplicationMailer.sendRecoveryPassword as jest.Mock
    ).mockResolvedValue(expectedResponse)

    const result = await sendRecoveryPasswordEmailService.run(inputProps)

    expect(result).toEqual(expectedResponse)
    expect(
      mockApplicationRepository.getRepositoryInstance
    ).toHaveBeenCalledWith(inputProps.type)
    expect(mockRepository.emailExists).toHaveBeenCalledWith(inputProps.email)
  })

  it('should return an error when the email is missing', async () => {
    const inputProps = {
      type: 'user',
      email: '',
      name: 'John Doe'
    }

    const expectedError = new ApplicationError(t('email.error.required'))

    const result = await sendRecoveryPasswordEmailService.run(inputProps)

    expect(result).toEqual(expectedError)
    expect(
      mockApplicationRepository.getRepositoryInstance
    ).not.toHaveBeenCalled()
    expect(mockRepository.emailExists).not.toHaveBeenCalled()
    expect(mockApplicationMailer.sendRecoveryPassword).not.toHaveBeenCalled()
  })
})
