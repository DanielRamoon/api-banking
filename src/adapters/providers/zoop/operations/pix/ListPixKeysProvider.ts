import { t } from '../../../../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../../../../helpers/ApplicationError'
import ApplicationHttpRequest, {
  ApplicationHttpRequestProps,
  AuthorizationType,
  Method
} from '../../../../../helpers/ApplicationHttpRequest'
import { ApplicationProvider } from '../../../ApplicationProvider'

type ListPixKeysProps = {
  xAuthTokenReading: string
  xSessionToken: string
  holderId: string
  accountId: string
}

export class ListPixKeysProvider implements ApplicationProvider {
  private applicationHttpRequest: ApplicationHttpRequest

  private ZOOP_BANKING_DICT_URL = process.env.ZOOP_BANKING_DICT_URL!
  private ZOOP_API_KEY = process.env.ZOOP_API_KEY

  constructor(applicationHttpRequest: ApplicationHttpRequest) {
    this.applicationHttpRequest = applicationHttpRequest
  }

  async execute({
    holderId,
    accountId,
    xAuthTokenReading,
    xSessionToken
  }: ListPixKeysProps): Promise<
    ApplicationHttpRequestProps | ApplicationError
  > {
    this.applicationHttpRequest.initialize(
      AuthorizationType.basic,
      this.ZOOP_BANKING_DICT_URL,
      this.ZOOP_API_KEY,
      ''
    )

    this.applicationHttpRequest.addHeader(
      'X-Auth-Token-Reading',
      xAuthTokenReading
    )
    this.applicationHttpRequest.addHeader('X-Session-Token', xSessionToken)

    const _verb = Method.GET
    const _partialUrl = `holders/${holderId}/accounts/${accountId}/entries`
    const _endpoint = `${this.applicationHttpRequest.getBaseURL()}/${_partialUrl}`

    try {
      const result = (await this.applicationHttpRequest.fetch(
        _verb,
        _endpoint
      )) as ApplicationHttpRequestProps

      return result
    } catch (e) {
      const { data } = e as ApplicationHttpRequestProps
      const _message = data?.error?.error?.message

      return new ApplicationError(
        _message || t('error.provider.operation', { provider: 'zoop' })
      )
    }
  }
}
