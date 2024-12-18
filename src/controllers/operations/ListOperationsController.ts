import { HTTPRequest } from '../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  fail,
  ok,
  unprocessable
} from '../../adapters/http/HttpResponseAdapter'
import { t } from '../../config/i18next/I18nextLocalization'
import Wallet from '../../entities/Wallet'
import { ApplicationError } from '../../helpers/ApplicationError'
import { ApplicationService } from '../../services/ApplicationService'

type ListWalletsParams = {
  wallet_id: string
  id?: string
  user_id?: string
  company_id?: string
  page?: string
  per_page?: string
}

type PaginatedList = {
  total_items: number
  per_page: number
  current_page: number
  next_page: number
  has_more_items: boolean
  items: Array<Wallet>
}

export default class ListOperationsController implements HTTPRequest {
  private listWalletService: ApplicationService

  constructor(listWalletService: ApplicationService) {
    this.listWalletService = listWalletService
  }

  async handle({
    wallet_id,
    id,
    user_id,
    company_id,
    page,
    per_page
  }: ListWalletsParams): Promise<HttpResponse> {
    try {
      const skip = parseInt(page ?? '0')
      const take = parseInt(per_page ?? '10')

      const result = await this.listWalletService.run({
        walletId: wallet_id,
        userId: id ?? user_id,
        companyId: company_id,
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
        operations: paginated.items
      })
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
