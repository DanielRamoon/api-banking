import { t } from '../../../../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../../../../helpers/ApplicationError'
import ApplicationHttpRequest, {
  ApplicationHttpRequestProps,
  AuthorizationType,
  Method
} from '../../../../../helpers/ApplicationHttpRequest'
import { ApplicationProvider } from '../../../ApplicationProvider'

type ValidateBarCodeProps = {
  barCode: string
  accountId: string
}

export class ValidateBarCodeProvider implements ApplicationProvider {
  private applicationHttpRequest: ApplicationHttpRequest

  private ZOOP_BANKING_BASE_URL = process.env.ZOOP_BANKING_BASE_URL!
  private ZOOP_API_KEY = process.env.ZOOP_API_KEY

  constructor(applicationHttpRequest: ApplicationHttpRequest) {
    this.applicationHttpRequest = applicationHttpRequest
  }

  async execute({
    accountId,
    barCode
  }: ValidateBarCodeProps): Promise<
    ApplicationHttpRequestProps | ApplicationError
  > {
    this.applicationHttpRequest.initialize(
      AuthorizationType.basic,
      this.ZOOP_BANKING_BASE_URL,
      this.ZOOP_API_KEY,
      ''
    )

    const _verb = Method.GET
    const _partialUrl = `accounts/${accountId}/payments/validation/${barCode}`
    const _endpoint = `${this.applicationHttpRequest.getBaseURL()}/${_partialUrl}`

    try {
      const result = (await this.applicationHttpRequest.fetch(
        _verb,
        _endpoint
      )) as ApplicationHttpRequestProps

      return result
    } catch (e) {
      const { data } = e as ApplicationHttpRequestProps

      const _message = data?.error?.error?.status

      return new ApplicationError(
        _message || t('error.provider.operation', { provider: 'zoop' })
      )
    }
  }
}
