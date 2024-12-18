import { PaginateAdapter } from '../../adapters/PaginateAdapter'
import { t } from '../../config/i18next/I18nextLocalization'
import Log from '../../entities/Log'
import { ApplicationError } from '../../helpers/ApplicationError'
import { ILogRepository } from '../../repositories/ILogRepository'
import { ApplicationService } from '../ApplicationService'

type ListLogsParams = {
  page: number
  perPage: number
}

export class ListLogsService implements ApplicationService {
  private logRepository: ILogRepository
  private paginator: PaginateAdapter

  constructor(logRepository: ILogRepository) {
    this.logRepository = logRepository
    this.paginator = new PaginateAdapter()
  }

  async run({
    page,
    perPage
  }: ListLogsParams): Promise<object | ApplicationError> {
    try {
      this.paginator.setPerPage(perPage)
      this.paginator.setSkip(page)

      const logsCount = (await this.logRepository.count()) as number
      const logs = (await this.logRepository.list({
        page: this.paginator.getSkip(),
        perPage: this.paginator.getPerPage()
      })) as Log[]

      const logsFormatted = logs.map(log => log.serializable_hash)

      const logsPaginated = this.paginator.itemsPaginated(
        logsFormatted,
        logsCount
      )

      return logsPaginated
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
