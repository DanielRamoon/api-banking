import { ApplicationError } from '../../../../../helpers/ApplicationError'
import ApplicationHttpRequest, {
  ApplicationHttpRequestProps,
  AuthorizationType,
  Method
} from '../../../../../helpers/ApplicationHttpRequest'
import { ApplicationProvider } from '../../../ApplicationProvider'

export class LoginProvider implements ApplicationProvider {
  private applicationHttpRequest: ApplicationHttpRequest

  private ZOOP_2FA_BASE_URL = process.env.ZOOP_2FA_BASE_URL!
  private ZOOP_API_KEY = process.env.ZOOP_API_KEY!
  private ZOOP_COMPANY_TOKEN = process.env.ZOOP_COMPANY_TOKEN!
  private ZOOP_COMPANY_SECRET_KEY = process.env.ZOOP_COMPANY_SECRET_KEY!

  constructor(applicationHttpRequest: ApplicationHttpRequest) {
    this.applicationHttpRequest = applicationHttpRequest
  }

  // eslint-disable-next-line no-empty-pattern
  async execute({}): Promise<ApplicationHttpRequestProps | ApplicationError> {
    this.applicationHttpRequest.initialize(
      AuthorizationType.basic,
      this.ZOOP_2FA_BASE_URL,
      this.ZOOP_API_KEY,
      ''
    )

    this.applicationHttpRequest.addHeader('x-api-key', this.ZOOP_API_KEY)

    const _verb = Method.POST
    const _endpoint = `${this.applicationHttpRequest.getBaseURL()}/company/login`

    const _body = {
      CompanyToken: this.ZOOP_COMPANY_TOKEN,
      SecretKey: this.ZOOP_COMPANY_SECRET_KEY
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
