import { t } from '../../../../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../../../../helpers/ApplicationError'
import ApplicationHttpRequest, {
  ApplicationHttpRequestProps,
  AuthorizationType,
  Method
} from '../../../../../helpers/ApplicationHttpRequest'
import { ApplicationProvider } from '../../../ApplicationProvider'

type CreatePaymentProps = {
  barCode: string
  amount: number
  accountId: string
  statementDescriptor?: number
  referenceId?: string
  interest?: number
  discount?: number
}

export class CreatePaymentProvider implements ApplicationProvider {
  private applicationHttpRequest: ApplicationHttpRequest

  private ZOOP_BANKING_BASE_URL = process.env.ZOOP_BANKING_BASE_URL!
  private ZOOP_API_KEY = process.env.ZOOP_API_KEY

  constructor(applicationHttpRequest: ApplicationHttpRequest) {
    this.applicationHttpRequest = applicationHttpRequest
  }

  async execute({
    accountId,
    interest,
    discount,
    barCode,
    amount,
    statementDescriptor,
    referenceId
  }: CreatePaymentProps): Promise<
    ApplicationHttpRequestProps | ApplicationError
  > {
    this.applicationHttpRequest.initialize(
      AuthorizationType.basic,
      this.ZOOP_BANKING_BASE_URL,
      this.ZOOP_API_KEY,
      ''
    )

    const _verb = Method.POST
    const _partialUrl = `accounts/${accountId}/payments`
    const _endpoint = `${this.applicationHttpRequest.getBaseURL()}/${_partialUrl}`

    const _body = {
      interest,
      discount,
      amount,
      bar_code: barCode,
      statement_descriptor: statementDescriptor,
      reference_id: referenceId
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
