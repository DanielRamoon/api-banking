import { PaymentTypes } from '../../@types/zoop/PaymentTypes'
import { t } from '../../config/i18next/I18nextLocalization'
import Operation, { OperationProps } from '../../entities/Operation'
import User from '../../entities/User'
import Wallet from '../../entities/Wallet'
import { ApplicationError } from '../../helpers/ApplicationError'
import { IOperationRepository } from '../../repositories/IOperationRepository'
import { ApplicationService } from '../ApplicationService'

type CreateOperationParams = {
  user: User
  wallet: Wallet
  operationParams: PaymentTypes
  referenceId: string
  type?: string
}

export class CreateOperationService implements ApplicationService {
  private operationRepository: IOperationRepository

  constructor(operationRepository: IOperationRepository) {
    this.operationRepository = operationRepository
  }

  async run({
    user,
    wallet,
    operationParams,
    referenceId,
    type
  }: CreateOperationParams): Promise<Operation | ApplicationError> {
    try {
      const { data } = operationParams as PaymentTypes

      const createOrError = await this.operationRepository.create({
        holderId: user.holderId,
        walletId: wallet.id,
        zoopOperationId: data.id || data.external_transfer_id,
        type: data.operation?.type || type,
        amountCents: data.amount,
        status: data.status,
        barCode: data.bar_code || '',
        discount: data.discount || 0,
        interest: data.interest || 0,
        fine: data.fine || 0,
        fee: data.operation?.fee || 0,
        description: data.description || '',
        referenceId
      })

      if (createOrError instanceof ApplicationError) return createOrError

      return new Operation(createOrError as OperationProps).serializable_hash
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
