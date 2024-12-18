import { t } from '../../../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../../../helpers/ApplicationError'
import ApplicationHttpRequest, {
  ApplicationHttpRequestProps,
  AuthorizationType,
  Method
} from '../../../../helpers/ApplicationHttpRequest'
import { ApplicationProvider } from '../../ApplicationProvider'

type FindWalletProps = {
  holderId: string
  accountId: number
}

export class FindWalletProvider implements ApplicationProvider {
  private applicationHttpRequest: ApplicationHttpRequest

  private ZOOP_V2_BASE_URL = process.env.ZOOP_V2_BASE_URL!
  private ZOOP_API_KEY = process.env.ZOOP_API_KEY

  constructor(applicationHttpRequest: ApplicationHttpRequest) {
    this.applicationHttpRequest = applicationHttpRequest
  }

  async execute({
    holderId,
    accountId
  }: FindWalletProps): Promise<ApplicationHttpRequestProps | ApplicationError> {
    this.applicationHttpRequest.setContentType('application/json')
    this.applicationHttpRequest.initialize(
      AuthorizationType.basic,
      this.ZOOP_V2_BASE_URL,
      this.ZOOP_API_KEY,
      ''
    )

    const _verb = Method.GET
    const _partial = `holders/${holderId}/accounts/${accountId}`
    const _endpoint = `${this.applicationHttpRequest.getBaseURL()}/${_partial}`

    try {
      const result = (await this.applicationHttpRequest.fetch(
        _verb,
        _endpoint
      )) as ApplicationHttpRequestProps

      return result
    } catch (e) {
      const { data } = e as ApplicationHttpRequestProps

      const _message = `${t('error.provider.wallet', {
        provider: 'zoop'
      })} - ${data?.error?.message}`

      return new ApplicationError(_message)
    }
  }
}
