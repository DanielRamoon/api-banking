import { ApplicationError } from '../../../../../helpers/ApplicationError'
import ApplicationHttpRequest, {
  ApplicationHttpRequestProps,
  AuthorizationType,
  Method
} from '../../../../../helpers/ApplicationHttpRequest'
import { ApplicationProvider } from '../../../ApplicationProvider'

type DeletePixKeyProps = {
  xAuthTokenReading: string
  xSessionToken: string
  holderId: string
  accountId: string
  value: string
}

export class DeletePixKeyProvider implements ApplicationProvider {
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
    value
  }: DeletePixKeyProps): Promise<
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

    const _verb = Method.DELETE
    const _partialUrl = `holders/${holderId}/accounts/${accountId}/entries/${value}`
    const _endpoint = `${this.applicationHttpRequest.getBaseURL()}/${_partialUrl}`

    try {
      const result = (await this.applicationHttpRequest.fetch(
        _verb,
        _endpoint
      )) as ApplicationHttpRequestProps

      return result
    } catch (e) {
      const { data } = e as ApplicationHttpRequestProps

      const _fields = data?.error?.fields
      const _message = data?.error?.message

      const error = {
        message: _message,
        fields: _fields
      }

      return new ApplicationError(JSON.stringify(error))
    }
  }
}
