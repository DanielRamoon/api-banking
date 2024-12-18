import { CellPhoneTypes } from '../../../../@types/zoop/CellPhoneTypes'
import { ApplicationProvider } from '../../../../adapters/providers/ApplicationProvider'
import { t } from '../../../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../../../helpers/ApplicationError'
import { ApplicationService } from '../../../ApplicationService'

type RegisterUserCellPhoneParams = {
  cellPhone: string
  uniqueIdentifier: string
  applicationToken: string
  xAuthToken: string
}

export class RegisterUserCellPhoneService implements ApplicationService {
  private registerUserCellPhoneProvider: ApplicationProvider

  constructor(registerUserCellPhoneProvider: ApplicationProvider) {
    this.registerUserCellPhoneProvider = registerUserCellPhoneProvider
  }

  async run({
    cellPhone,
    uniqueIdentifier,
    applicationToken,
    xAuthToken
  }: RegisterUserCellPhoneParams): Promise<CellPhoneTypes | ApplicationError> {
    try {
      const registeredCelPhone =
        await this.registerUserCellPhoneProvider.execute({
          cellPhone,
          uniqueIdentifier,
          applicationToken,
          xAuthToken
        })

      if (registeredCelPhone instanceof ApplicationError)
        return registeredCelPhone

      return registeredCelPhone as CellPhoneTypes
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
