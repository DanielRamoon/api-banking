import { t } from '../../../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../../../helpers/ApplicationError'
import ApplicationHttpRequest, {
  ApplicationHttpRequestProps,
  AuthorizationType,
  Method
} from '../../../../helpers/ApplicationHttpRequest'
import { ApplicationProvider } from '../../ApplicationProvider'
type FindSellerProps = {
  sellerId?: string
  taxpayerId?: string
  cnpj?: string
}

export class FindSellerProvider implements ApplicationProvider {
  private applicationHttpRequest: ApplicationHttpRequest

  private ZOOP_V1_BASE_URL = process.env.ZOOP_V1_BASE_URL!
  private ZOOP_API_KEY = process.env.ZOOP_API_KEY

  constructor(applicationHttpRequest: ApplicationHttpRequest) {
    this.applicationHttpRequest = applicationHttpRequest
  }

  async execute({
    sellerId,
    taxpayerId,
    cnpj
  }: FindSellerProps): Promise<ApplicationHttpRequestProps | ApplicationError> {
    this.applicationHttpRequest.initialize(
      AuthorizationType.basic,
      this.ZOOP_V1_BASE_URL,
      this.ZOOP_API_KEY,
      ''
    )

    const queryString = this.getQueryString({ sellerId, cnpj, taxpayerId })

    const _verb = Method.GET
    const _endpoint = `${this.applicationHttpRequest.getBaseURL()}/sellers/${queryString}`

    try {
      const result = (await this.applicationHttpRequest.fetch(
        _verb,
        _endpoint
      )) as ApplicationHttpRequestProps

      return result
    } catch (e) {
      const { data } = e as ApplicationHttpRequestProps
      const { status } = e as ApplicationHttpRequestProps

      if (status == 404)
        return new ApplicationError(
          t('error.notFound', { resource: 'zoop_seller' }),
          status
        )

      const _fields = data?.error?.fields
      const _message = data?.error?.message

      const error = {
        message: _message,
        fields: _fields
      }

      return new ApplicationError(JSON.stringify(error))
    }
  }

  private getQueryString({
    sellerId,
    cnpj,
    taxpayerId
  }: FindSellerProps): string {
    if (sellerId) return sellerId
    if (cnpj) return `search?ein=${cnpj}`

    return `search?taxpayer_id=${taxpayerId}`
  }
}
