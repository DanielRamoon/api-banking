import { t } from '../../../../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../../../../helpers/ApplicationError'
import ApplicationHttpRequest, {
  ApplicationHttpRequestProps,
  AuthorizationType,
  Method
} from '../../../../../helpers/ApplicationHttpRequest'
import { ApplicationProvider } from '../../../ApplicationProvider'

type CreateP2PTransferProps = {
  accountFrom: string
  accountTo: string
  amount: number
  description: string
  statementDescriptor: string
  referenceId: string
}

export class CreateP2PTransferProvider implements ApplicationProvider {
  private applicationHttpRequest: ApplicationHttpRequest

  private ZOOP_V2_BASE_URL = process.env.ZOOP_V2_BASE_URL!
  private ZOOP_API_KEY = process.env.ZOOP_API_KEY

  constructor(applicationHttpRequest: ApplicationHttpRequest) {
    this.applicationHttpRequest = applicationHttpRequest
  }

  async execute({
    accountFrom,
    accountTo,
    amount,
    description,
    statementDescriptor,
    referenceId
  }: CreateP2PTransferProps): Promise<
    ApplicationHttpRequestProps | ApplicationError
  > {
    this.applicationHttpRequest.setContentType('application/json')
    this.applicationHttpRequest.initialize(
      AuthorizationType.basic,
      this.ZOOP_V2_BASE_URL,
      this.ZOOP_API_KEY,
      ''
    )

    const _verb = Method.POST
    const _urlPartial = `accounts/${accountFrom}/p2p_transfers`
    const _endpoint = `${this.applicationHttpRequest.getBaseURL()}/${_urlPartial}`

    try {
      const _body = {
        to: accountTo,
        statement_descriptor: statementDescriptor,
        reference_id: referenceId,
        description,
        amount
      }

      const result = (await this.applicationHttpRequest.fetch(
        _verb,
        _endpoint,
        _body
      )) as ApplicationHttpRequestProps

      return result
    } catch (e) {
      const { data } = e as ApplicationHttpRequestProps

      const _message = `${t('error.provider.p2p', {
        provider: 'zoop'
      })} - ${data?.error?.message}`

      return new ApplicationError(_message)
    }
  }
}
