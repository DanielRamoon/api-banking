/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { prisma } from '../../config/database/prisma'
import { t } from '../../config/i18next/I18nextLocalization'
import Log, { LogProps } from '../../entities/Log'
import { ApplicationError } from '../../helpers/ApplicationError'
import ApplicationHelper from '../../helpers/ApplicationHelper'
import { ILogRepository } from '../ILogRepository'

type ListLogsParams = {
  page: number
  perPage: number
}

export class LogRepository implements ILogRepository {
  async create({ error }: LogProps): Promise<Log | ApplicationError> {
    const logPrisma = await prisma.log.create({
      data: {
        error
      }
    })

    if (!logPrisma)
      return new ApplicationError(t('error.creating', { resource: 'log' }))

    const log = ApplicationHelper.snakeToCamel(logPrisma) as LogProps

    return new Log(log)
  }

  async list({
    page,
    perPage
  }: ListLogsParams): Promise<ApplicationError | Log[]> {
    const logs = await prisma.log.findMany({
      skip: page,
      take: perPage,
      orderBy: {
        created_at: 'desc'
      }
    })

    const formattedLogs = logs.map(log => {
      return new Log(ApplicationHelper.snakeToCamel(log) as LogProps)
    })

    return formattedLogs
  }

  async count(): Promise<number | ApplicationError> {
    const holdersAggregate = await prisma.log.aggregate({
      _count: {
        id: true
      }
    })

    return holdersAggregate?._count?.id
  }

  async find(id: string): Promise<Log | ApplicationError> {
    throw new Error('Method not implemented.')
  }

  update(id: string, params: object): Promise<object | ApplicationError> {
    throw new Error('Method not implemented.')
  }

  delete(id: string): Promise<void | ApplicationError> {
    throw new Error('Method not implemented.')
  }

  findUser(type: string, email: string): Promise<object | ApplicationError> {
    throw new Error('Method not implemented.')
  }

  updatePassword(
    email: string,
    password: string
  ): Promise<object | ApplicationError> {
    throw new Error('Method not implemented.')
  }

  emailExists(email: string, id?: string | undefined): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
