import { HTTPRequest } from '../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  fail,
  ok,
  unprocessable
} from '../../adapters/http/HttpResponseAdapter'
import { t } from '../../config/i18next/I18nextLocalization'
import Log from '../../entities/Log'
import { ApplicationError } from '../../helpers/ApplicationError'
import { ApplicationService } from '../../services/ApplicationService'

type ListLogsParams = {
  page?: string
  per_page?: string
}

type PaginatedList = {
  total_items: number
  per_page: number
  current_page: number
  next_page: number
  has_more_items: boolean
  items: Array<Log>
}

export default class ListLogsController implements HTTPRequest {
  private listLogsService: ApplicationService

  constructor(listLogsService: ApplicationService) {
    this.listLogsService = listLogsService
  }

  async handle({ page, per_page }: ListLogsParams): Promise<HttpResponse> {
    try {
      const skip = parseInt(page ?? '0')
      const take = parseInt(per_page ?? '10')

      const result = await this.listLogsService.run({
        page: skip,
        perPage: take
      })

      if (result instanceof ApplicationError) return unprocessable(result)

      const paginated = result as PaginatedList

      const meta = {
        total_items: paginated.total_items,
        per_page: paginated.per_page,
        current_page: paginated.current_page,
        next_page: paginated.next_page,
        has_more_items: paginated.has_more_items
      }

      return ok({
        meta,
        logs: paginated.items
      })
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
