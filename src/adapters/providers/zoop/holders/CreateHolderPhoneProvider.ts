import { ApplicationError } from '../../../../helpers/ApplicationError'
import ApplicationHttpRequest, {
  ApplicationHttpRequestProps,
  AuthorizationType,
  Method
} from '../../../../helpers/ApplicationHttpRequest'
import { ApplicationProvider } from '../../ApplicationProvider'

type CreateHolderPhoneProps = {
  holderId: string
  phoneAreaCode: string
  phonePrefix: string
  phoneNumber: string
}

export class CreateHolderPhondeProvider implements ApplicationProvider {
  private applicationHttpRequest: ApplicationHttpRequest

  private ZOOP_BANKING_BASE_URL = process.env.ZOOP_BANKING_BASE_URL!
  private ZOOP_API_KEY = process.env.ZOOP_API_KEY

  constructor(applicationHttpRequest: ApplicationHttpRequest) {
    this.applicationHttpRequest = applicationHttpRequest
  }

  async execute({
    holderId,
    phoneAreaCode,
    phonePrefix,
    phoneNumber
  }: CreateHolderPhoneProps): Promise<object | ApplicationError> {
    this.applicationHttpRequest.initialize(
      AuthorizationType.basic,
      this.ZOOP_BANKING_BASE_URL,
      this.ZOOP_API_KEY,
      ''
    )

    const _verb = Method.POST
    const _endpoint = `${this.applicationHttpRequest.getBaseURL()}/holders/${holderId}/phones`

    try {
      const _body = {
        area_code: phonePrefix,
        country_code: phoneAreaCode,
        number: phoneNumber
      }

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
