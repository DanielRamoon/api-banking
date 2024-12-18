import { ApplicationProvider } from '../../../../adapters/providers/ApplicationProvider'
import { t } from '../../../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../../../helpers/ApplicationError'
import { ApplicationService } from '../../../ApplicationService'

type ValidateCodeSentByBySMSParams = {
  userToken: string
  userPassword: string
  xAuthToken: string
}

export class ValidateCodeSentByBySMSService implements ApplicationService {
  private requestUserSessionBySMSProvider: ApplicationProvider

  constructor(requestUserSessionBySMSProvider: ApplicationProvider) {
    this.requestUserSessionBySMSProvider = requestUserSessionBySMSProvider
  }

  async run({
    userToken,
    userPassword,
    xAuthToken
  }: ValidateCodeSentByBySMSParams): Promise<object | ApplicationError> {
    try {
      const loggedUser = await this.requestUserSessionBySMSProvider.execute({
        userToken,
        userPassword,
        xAuthToken
      })

      if (loggedUser instanceof ApplicationError) return loggedUser

      return loggedUser
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
