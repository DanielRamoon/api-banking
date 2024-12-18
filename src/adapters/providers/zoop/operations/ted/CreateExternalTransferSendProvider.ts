import { t } from '../../../../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../../../../helpers/ApplicationError'
import ApplicationHttpRequest, {
  ApplicationHttpRequestProps,
  AuthorizationType,
  Method
} from '../../../../../helpers/ApplicationHttpRequest'
import { ApplicationProvider } from '../../../ApplicationProvider'

type RecipientProps = {
  bankCode: string
  routingNumber: number
  routingCheckDigit: number
  accountNumber: number
  accountCheckDigit: string
  document: string
  name: {
    firstName: string
    lastName: string
  }
}

type CreateExternalTransferSendProps = {
  holderId: string
  accountId: string
  amount: number
  recipient: RecipientProps
  description?: number
  referenceId?: string
  purposeCode?: string
}

export class CreateExternalTransferSendProvider implements ApplicationProvider {
  private applicationHttpRequest: ApplicationHttpRequest

  private ZOOP_BANKING_BASE_URL = process.env.ZOOP_BANKING_BASE_URL!
  private ZOOP_API_KEY = process.env.ZOOP_API_KEY

  constructor(applicationHttpRequest: ApplicationHttpRequest) {
    this.applicationHttpRequest = applicationHttpRequest
  }

  async execute({
    holderId,
    accountId,
    amount,
    description,
    referenceId,
    purposeCode,
    recipient
  }: CreateExternalTransferSendProps): Promise<
    ApplicationHttpRequestProps | ApplicationError
  > {
    this.applicationHttpRequest.initialize(
      AuthorizationType.basic,
      this.ZOOP_BANKING_BASE_URL,
      this.ZOOP_API_KEY,
      ''
    )

    const _verb = Method.POST
    const _partialUrl = `holders/${holderId}/accounts/${accountId}/external-transfer-send`
    const _endpoint = `${this.applicationHttpRequest.getBaseURL()}/${_partialUrl}`

    const {
      bankCode,
      routingNumber,
      routingCheckDigit,
      accountNumber,
      accountCheckDigit,
      document
    } = recipient

    const { firstName, lastName } = recipient.name

    const _body = {
      amount,
      description,
      reference_id: referenceId,
      purpose_code: purposeCode || 10,
      recipient: {
        bank_code: bankCode,
        routing_number: routingNumber,
        routing_check_digit: routingCheckDigit,
        account_number: accountNumber,
        account_check_digit: accountCheckDigit,
        document,
        name: {
          first_name: firstName,
          last_name: lastName
        }
      }
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
