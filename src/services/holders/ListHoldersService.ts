import { PaginateAdapter, PaginatedItems } from '../../adapters/PaginateAdapter'
import { t } from '../../config/i18next/I18nextLocalization'
import Holder from '../../entities/Holder'
import { ApplicationError } from '../../helpers/ApplicationError'
import { IHolderRepository } from '../../repositories/IHolderRepository'
import { ApplicationService } from '../ApplicationService'

type ListHoldersParams = {
  companyId: string
  search: string
  page: number
  perPage: number
}

export class ListHoldersService implements ApplicationService {
  private holderRepository: IHolderRepository
  private paginator: PaginateAdapter

  constructor(holderRepository: IHolderRepository) {
    this.holderRepository = holderRepository
    this.paginator = new PaginateAdapter()
  }

  async run({
    companyId,
    search,
    page,
    perPage
  }: ListHoldersParams): Promise<PaginatedItems | ApplicationError> {
    try {
      this.paginator.setPerPage(perPage)
      this.paginator.setSkip(page)

      const holdersCount = (await this.holderRepository.count()) as number
      const holders = (await this.holderRepository.list({
        companyId,
        search,
        page: this.paginator.getSkip(),
        perPage: this.paginator.getPerPage()
      })) as Holder[]

      const holdersFormatted = holders.map(holder => holder.serializable_hash)

      const holdersPaginated = this.paginator.itemsPaginated(
        holdersFormatted,
        holdersCount
      )

      return holdersPaginated
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
