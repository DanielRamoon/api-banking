import { HTTPRequest } from '../../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  fail,
  ok,
  unprocessable
} from '../../../adapters/http/HttpResponseAdapter'
import { t } from '../../../config/i18next/I18nextLocalization'
import Company from '../../../entities/Company'
import { ApplicationError } from '../../../helpers/ApplicationError'
import { ApplicationService } from '../../../services/ApplicationService'

type ListCompaniesParams = {
  company_id?: string
  search?: string
  page?: string
  per_page?: string
}

type PaginatedList = {
  total_items: number
  per_page: number
  current_page: number
  next_page: number
  has_more_items: boolean
  items: Array<Company>
}

export default class ListCompanyUsersController implements HTTPRequest {
  private listCompanyUsersService: ApplicationService

  constructor(listCompanyUsersService: ApplicationService) {
    this.listCompanyUsersService = listCompanyUsersService
  }

  async handle({
    company_id,
    search,
    page,
    per_page
  }: ListCompaniesParams): Promise<HttpResponse> {
    try {
      const skip = parseInt(page ?? '0')
      const take = parseInt(per_page ?? '10')
      search = search ?? ''

      const result = await this.listCompanyUsersService.run({
        companyId: company_id,
        search,
        page: skip,
        perPage: take
      })

      if (result instanceof ApplicationError) {
        return unprocessable(result)
      }

      const paginated = result as PaginatedList

      const meta = {
        search,
        total_items: paginated.total_items,
        per_page: paginated.per_page,
        current_page: paginated.current_page,
        next_page: paginated.next_page,
        has_more_items: paginated.has_more_items
      }

      return ok({
        meta,
        companyUsers: paginated.items
      })
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
