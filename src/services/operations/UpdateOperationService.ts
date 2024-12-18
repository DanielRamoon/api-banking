import { t } from '../../config/i18next/I18nextLocalization'
import Operation, { OperationProps } from '../../entities/Operation'
import { ApplicationError } from '../../helpers/ApplicationError'
import { IOperationRepository } from '../../repositories/IOperationRepository'
import { ApplicationService } from '../ApplicationService'

type UpdateOperationParams = {
  id: string
  holderId: string
  walletId: string
  zoopOperationId: string
  type: string
  amountCents: number
  status: string
  barCode: string
  discount: number
  interest: number
  fine: number
  fee: number
  description: string
  referenceId: string
}

export class UpdateOperationService implements ApplicationService {
  private operationRepository: IOperationRepository

  constructor(operationRepository: IOperationRepository) {
    this.operationRepository = operationRepository
  }

  async run({
    id,
    holderId,
    walletId,
    zoopOperationId,
    type,
    amountCents,
    status,
    barCode,
    discount,
    interest,
    fine,
    fee,
    description,
    referenceId
  }: UpdateOperationParams): Promise<Operation | ApplicationError> {
    try {
      const operation = await this.operationRepository.update(id, {
        holderId,
        walletId,
        zoopOperationId,
        type,
        amountCents,
        status,
        barCode,
        discount,
        interest,
        fine,
        fee,
        description,
        referenceId
      })

      if (operation instanceof ApplicationError) return operation

      return new Operation(operation as OperationProps).serializable_hash
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
