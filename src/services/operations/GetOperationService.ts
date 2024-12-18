import { t } from '../../config/i18next/I18nextLocalization'
import Operation, { OperationProps } from '../../entities/Operation'
import { ApplicationError } from '../../helpers/ApplicationError'
import { IOperationRepository } from '../../repositories/IOperationRepository'
import { ApplicationService } from '../ApplicationService'

type GeOperationParams = {
  id: string
  userId?: string
}

export class GetOperationService implements ApplicationService {
  private operationRepository: IOperationRepository

  constructor(operationRepository: IOperationRepository) {
    this.operationRepository = operationRepository
  }

  async run({
    id,
    userId
  }: GeOperationParams): Promise<Operation | ApplicationError> {
    try {
      const findOrError = await this.operationRepository.find(id, userId)

      if (findOrError instanceof ApplicationError) return findOrError

      return new Operation(findOrError as OperationProps).serializable_hash
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
