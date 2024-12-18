import { t } from '../../config/i18next/I18nextLocalization'
import Log, { LogProps } from '../../entities/Log'
import { ApplicationError } from '../../helpers/ApplicationError'
import { ILogRepository } from '../../repositories/ILogRepository'
import { ApplicationService } from '../ApplicationService'

type CreateLogParams = {
  error: string
}

export class CreateLogService implements ApplicationService {
  private logRepository: ILogRepository

  constructor(logRepository: ILogRepository) {
    this.logRepository = logRepository
  }

  async run({ error }: CreateLogParams): Promise<Log | ApplicationError> {
    try {
      const log = await this.logRepository.create({
        error
      })

      if (log instanceof ApplicationError) return log

      return new Log(log as LogProps).serializable_hash
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
