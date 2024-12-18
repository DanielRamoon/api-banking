import { ApplicationError } from '../../../../helpers/ApplicationError'
import ApplicationHttpRequest, {
  ApplicationHttpRequestProps,
  AuthorizationType,
  Method
} from '../../../../helpers/ApplicationHttpRequest'
import { base64Encode } from '../../../../helpers/FileHelper'
import { ApplicationProvider } from '../../ApplicationProvider'

type SendHolderDocumentProps = {
  zoopHolderId: string
  type: string
  filepath: string
  filename: string
  contentType: string
}

export class SendHolderDocumentProvider implements ApplicationProvider {
  private applicationHttpRequest: ApplicationHttpRequest

  private ZOOP_BANKING_BASE_URL = process.env.ZOOP_BANKING_BASE_URL!
  private ZOOP_API_KEY = process.env.ZOOP_API_KEY

  constructor(applicationHttpRequest: ApplicationHttpRequest) {
    this.applicationHttpRequest = applicationHttpRequest
  }

  async execute({
    zoopHolderId,
    type,
    filepath,
    filename,
    contentType
  }: SendHolderDocumentProps): Promise<object | ApplicationError> {
    this.applicationHttpRequest.setContentType(contentType)

    this.applicationHttpRequest.initialize(
      AuthorizationType.basic,
      this.ZOOP_BANKING_BASE_URL,
      this.ZOOP_API_KEY,
      ''
    )

    const _baseUrl = this.applicationHttpRequest.getBaseURL()

    const _verb = Method.POST
    const _endpoint = `${_baseUrl}/holders/${zoopHolderId}/documents?type_id=${type}`

    try {
      const _file = `data:${contentType};name=${filename};base64,${base64Encode(
        filepath
      )}`

      const _body = {
        data: _file
      }

      const result = (await this.applicationHttpRequest.fetch(
        _verb,
        _endpoint,
        _body
      )) as ApplicationHttpRequestProps

      return result
    } catch (e) {
      const { data, error } = e as ApplicationHttpRequestProps

      const errorMessage = data?.error?.error?.message
        ? data?.error?.error?.message
        : ''

      const _message = errorMessage ? errorMessage : error ? error : ''

      return new ApplicationError(JSON.stringify(_message))
    }
  }
}
