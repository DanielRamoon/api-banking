import { PaginateAdapter } from '../../adapters/PaginateAdapter'
import { t } from '../../config/i18next/I18nextLocalization'
import Operation from '../../entities/Operation'
import { ApplicationError } from '../../helpers/ApplicationError'
import { IOperationRepository } from '../../repositories/IOperationRepository'
import { ApplicationService } from '../ApplicationService'

type ListOperationsParams = {
  walletId?: string
  userId?: string
  companyId?: string
  page: number
  perPage: number
}

export class ListOperationsService implements ApplicationService {
  private operationRepository: IOperationRepository
  private paginator: PaginateAdapter

  constructor(operationRepository: IOperationRepository) {
    this.operationRepository = operationRepository
    this.paginator = new PaginateAdapter()
  }

  async run({
    walletId,
    userId,
    companyId,
    page,
    perPage
  }: ListOperationsParams): Promise<object | ApplicationError> {
    try {
      this.paginator.setPerPage(perPage)
      this.paginator.setSkip(page)

      const operationsCount = (await this.operationRepository.count()) as number
      const operations = (await this.operationRepository.list({
        walletId,
        userId,
        companyId,
        page: this.paginator.getSkip(),
        perPage: this.paginator.getPerPage()
      })) as Operation[]

      const operationsFormatted = operations.map(
        operation => operation.serializable_hash
      )

      const operationsPaginated = this.paginator.itemsPaginated(
        operationsFormatted,
        operationsCount
      )

      return operationsPaginated
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
