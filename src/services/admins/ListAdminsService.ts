import { PaginateAdapter } from '../../adapters/PaginateAdapter'
import { t } from '../../config/i18next/I18nextLocalization'
import Admin from '../../entities/Admin'
import { ApplicationError } from '../../helpers/ApplicationError'
import { IAdminRepository } from '../../repositories/IAdminRepository'
import { ApplicationService } from '../ApplicationService'

type ListAdminsParams = {
  search: string
  page: number
  perPage: number
}

export class ListAdminsService implements ApplicationService {
  private adminRepository: IAdminRepository
  private paginator: PaginateAdapter

  constructor(adminRepository: IAdminRepository) {
    this.adminRepository = adminRepository
    this.paginator = new PaginateAdapter()
  }

  async run({
    search,
    page,
    perPage
  }: ListAdminsParams): Promise<object | ApplicationError> {
    try {
      this.paginator.setPerPage(perPage)
      this.paginator.setSkip(page)

      const adminsCount = (await this.adminRepository.count()) as number
      const admins = (await this.adminRepository.list({
        search,
        page: this.paginator.getSkip(),
        perPage: this.paginator.getPerPage()
      })) as Admin[]

      const adminsFormatted = admins.map(admin => admin.serializable_hash)
      const adminsPaginated = this.paginator.itemsPaginated(
        adminsFormatted,
        adminsCount
      )

      return adminsPaginated
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
