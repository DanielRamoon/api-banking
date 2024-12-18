import { OperationTypes } from '../../@types/zoop/OperationTypes'
import { HTTPRequest } from '../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  accepted,
  fail,
  notFound,
  ok,
  unprocessable
} from '../../adapters/http/HttpResponseAdapter'
import { t } from '../../config/i18next/I18nextLocalization'
import Holder from '../../entities/Holder'
import Operation from '../../entities/Operation'
import Wallet from '../../entities/Wallet'
import { ApplicationError } from '../../helpers/ApplicationError'
import { OPERATION_CONFIRMED_EVENTS, PING } from '../../helpers/constants'
import { IHolderRepository } from '../../repositories/IHolderRepository'
import { ApplicationService } from '../../services/ApplicationService'

type OperationParams = {
  payload: {
    type: string
    holder_id: string
    account_id: string
    object: OperationTypes
  }
}

export default class OperationsController implements HTTPRequest {
  private getHolderService: ApplicationService
  private getWalletService: ApplicationService
  private holderRepository: IHolderRepository
  private getOperationService: ApplicationService
  private createP2PTransferService: ApplicationService

  constructor(
    getHolderService: ApplicationService,
    getWalletService: ApplicationService,
    holderRepository: IHolderRepository,
    getOperationService: ApplicationService,
    createP2PTransferService: ApplicationService
  ) {
    this.getHolderService = getHolderService
    this.getWalletService = getWalletService
    this.holderRepository = holderRepository
    this.getOperationService = getOperationService
    this.createP2PTransferService = createP2PTransferService
  }

  async handle({ payload }: OperationParams): Promise<HttpResponse> {
    try {
      if (payload.type === PING) return ok({ message: 'Ok' })

      if (OPERATION_CONFIRMED_EVENTS.includes(payload.type)) {
        const holderId = payload.holder_id || payload.object.creditor.holder_id

        const holderOrError = await this.getHolderService.run({
          id: holderId
        })

        if (holderOrError instanceof ApplicationError)
          return notFound(holderOrError)

        const holder = holderOrError as Holder
        const userCount = await this.holderRepository.userCount(holder.id)
        if (userCount === 1) {
          const operationOrError = await this.getOperationService.run({
            id: payload.object.id
          })

          if (operationOrError instanceof ApplicationError)
            return notFound(operationOrError)

          const accountId =
            payload.object?.account_id ||
            payload.object?.creditor?.account?.digital_account_id
          const walletOrError = await this.getWalletService.run({
            id: accountId
          })

          if (walletOrError instanceof ApplicationError)
            return notFound(walletOrError)

          const wallet = walletOrError as Wallet
          const operation = operationOrError as Operation

          const accountFrom = holder.zoopAccountId
          const accountTo = wallet.zoopAccountId
          const amount = payload.object.amount || payload.object.amount_in_cents
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

          return ok()
        }
      }

      return accepted()
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
