import { LoginTypes } from '../../../../@types/zoop/2FACompanyTypes'
import { ApplicationProvider } from '../../../../adapters/providers/ApplicationProvider'
import { t } from '../../../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../../../helpers/ApplicationError'
import { ApplicationService } from '../../../ApplicationService'

export class LoginService implements ApplicationService {
  private loginProvider: ApplicationProvider

  constructor(loginProvider: ApplicationProvider) {
    this.loginProvider = loginProvider
  }

  // eslint-disable-next-line no-empty-pattern
  async run({}): Promise<LoginTypes | ApplicationError> {
    try {
      const loggedCompany = await this.loginProvider.execute({})

      if (loggedCompany instanceof ApplicationError) return loggedCompany

      return loggedCompany as LoginTypes
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
