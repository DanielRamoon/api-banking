import { PaginateAdapter } from '../../../adapters/PaginateAdapter'
import { t } from '../../../config/i18next/I18nextLocalization'
import CompanyUser from '../../../entities/CompanyUser'
import { ApplicationError } from '../../../helpers/ApplicationError'
import { ICompanyUserRepository } from '../../../repositories/ICompanyUserRepository'
import { ApplicationService } from '../../ApplicationService'

type ListCompaniesParams = {
  companyId: string
  search: string
  page: number
  perPage: number
}

export class ListCompanyUsersService implements ApplicationService {
  private companyUserRepository: ICompanyUserRepository
  private paginator: PaginateAdapter

  constructor(companyUserRepository: ICompanyUserRepository) {
    this.companyUserRepository = companyUserRepository
    this.paginator = new PaginateAdapter()
  }

  async run({
    companyId,
    search,
    page,
    perPage
  }: ListCompaniesParams): Promise<object | ApplicationError> {
    try {
      this.paginator.setPerPage(perPage)
      this.paginator.setSkip(page)

      const companyUsersCount = (await this.companyUserRepository.count(
        companyId
      )) as number
      const companyUsers = (await this.companyUserRepository.list({
        search,
        companyId,
        page: this.paginator.getSkip(),
        perPage: this.paginator.getPerPage()
      })) as CompanyUser[]

      const formattedCompanyUsers = companyUsers.map(
        companyUser => companyUser.serializable_hash
      )

      const companyUsersPaginated = this.paginator.itemsPaginated(
        formattedCompanyUsers,
        companyUsersCount
      )

      return companyUsersPaginated
    } catch (error) {
      if (error instanceof ApplicationError) {
        return new ApplicationError(error.message)
      } else {
        return new ApplicationError(t('error.internal'))
      }
    }
  }
}
