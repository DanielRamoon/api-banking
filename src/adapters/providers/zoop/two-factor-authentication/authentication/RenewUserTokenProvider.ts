import { ApplicationError } from '../../../../../helpers/ApplicationError'
import ApplicationHttpRequest, {
  ApplicationHttpRequestProps,
  AuthorizationType,
  Method
} from '../../../../../helpers/ApplicationHttpRequest'
import { ApplicationProvider } from '../../../ApplicationProvider'

type RenewUserTokenProps = {
  xAuthToken: string
}

export class RenewUserTokenProvider implements ApplicationProvider {
  private applicationHttpRequest: ApplicationHttpRequest

  private ZOOP_2FA_BASE_URL = process.env.ZOOP_2FA_BASE_URL!
  private ZOOP_API_KEY = process.env.ZOOP_API_KEY!

  constructor(applicationHttpRequest: ApplicationHttpRequest) {
    this.applicationHttpRequest = applicationHttpRequest
  }

  async execute({
    xAuthToken
  }: RenewUserTokenProps): Promise<
    ApplicationHttpRequestProps | ApplicationError
  > {
    this.applicationHttpRequest.initialize(
      AuthorizationType.basic,
      this.ZOOP_2FA_BASE_URL,
      this.ZOOP_API_KEY,
      ''
    )

    this.applicationHttpRequest.addHeader('x-api-key', this.ZOOP_API_KEY)
    this.applicationHttpRequest.addHeader('X-Auth-Token', xAuthToken)

    const _verb = Method.GET
    const _endpoint = `${this.applicationHttpRequest.getBaseURL()}/company/renew`

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
