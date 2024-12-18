import { t } from '../../../../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../../../../helpers/ApplicationError'
import ApplicationHttpRequest, {
  ApplicationHttpRequestProps,
  AuthorizationType,
  Method
} from '../../../../../helpers/ApplicationHttpRequest'
import { ApplicationProvider } from '../../../ApplicationProvider'

type CreatePixKeyProps = {
  xAuthTokenReading: string
  xSessionToken: string
  holderId: string
  accountId: string
  type: string
  value?: string
}

export class CreatePixKeyProvider implements ApplicationProvider {
  private applicationHttpRequest: ApplicationHttpRequest

  private ZOOP_BANKING_DICT_URL = process.env.ZOOP_BANKING_DICT_URL!
  private ZOOP_API_KEY = process.env.ZOOP_API_KEY

  constructor(applicationHttpRequest: ApplicationHttpRequest) {
    this.applicationHttpRequest = applicationHttpRequest
  }

  async execute({
    xAuthTokenReading,
    xSessionToken,
    holderId,
    accountId,
    type,
    value
  }: CreatePixKeyProps): Promise<
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

    const _verb = Method.POST
    const _partialUrl = `holders/${holderId}/accounts/${accountId}/entries`
    const _endpoint = `${this.applicationHttpRequest.getBaseURL()}/${_partialUrl}`

    const _body = {
      type,
      value
    }

    try {
      const result = (await this.applicationHttpRequest.fetch(
        _verb,
        _endpoint,
        _body
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
