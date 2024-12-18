import { HTTPRequest } from '../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  notFound,
  ok,
  unprocessable
} from '../../adapters/http/HttpResponseAdapter'
import { t } from '../../config/i18next/I18nextLocalization'
import Holder from '../../entities/Holder'
import Operation from '../../entities/Operation'
import User from '../../entities/User'
import Wallet from '../../entities/Wallet'
import { ApplicationError } from '../../helpers/ApplicationError'
import { ApplicationService } from '../../services/ApplicationService'

type ConfirmationOfReceiptParams = {
  id: string
  operation_id: string
}

export default class ConfirmationOfReceiptController implements HTTPRequest {
  private getUserService: ApplicationService
  private getOperationService: ApplicationService
  private createP2PTransferService: ApplicationService

  constructor(
    getUserService: ApplicationService,
    getOperationService: ApplicationService,
    createP2PTransferService: ApplicationService
  ) {
    this.getUserService = getUserService
    this.getOperationService = getOperationService
    this.createP2PTransferService = createP2PTransferService
  }

  async handle({
    id,
    operation_id
  }: ConfirmationOfReceiptParams): Promise<HttpResponse> {
    try {
      const userOrError = await this.getUserService.run({ id })
      if (userOrError instanceof ApplicationError) return notFound(userOrError)

      const operationOrError = await this.getOperationService.run({
        id: operation_id
      })

      if (operationOrError instanceof ApplicationError)
        return notFound(operationOrError)

      const user = userOrError as User
      const operation = operationOrError as Operation
      const holder = user.holder as Holder
      const wallet = operation.wallet as Wallet

      const accountFrom = holder.zoopAccountId
      const accountTo = wallet.zoopAccountId
      const amount = operation.amountCents
      const referenceId = operation.id

      const p2pOperation = await this.createP2PTransferService.run({
        accountFrom,
        accountTo,
        amount,
        description: '',
        statementDescriptor: '',
        referenceId
      })

      if (p2pOperation instanceof ApplicationError)
        return unprocessable(p2pOperation)

      return ok({ message: t('entity.operation.p2p.confirmed') })
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
