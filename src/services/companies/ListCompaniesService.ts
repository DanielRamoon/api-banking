import { PaginateAdapter } from '../../adapters/PaginateAdapter'
import { t } from '../../config/i18next/I18nextLocalization'
import Company from '../../entities/Company'
import { ApplicationError } from '../../helpers/ApplicationError'
import { ICompanyRepository } from '../../repositories/ICompanyRepository'
import { ApplicationService } from '../ApplicationService'

type ListCompaniesParams = {
  search: string
  page: number
  perPage: number
}

export class ListCompaniesService implements ApplicationService {
  private companyRepository: ICompanyRepository
  private paginator: PaginateAdapter

  constructor(companyRepository: ICompanyRepository) {
    this.companyRepository = companyRepository
    this.paginator = new PaginateAdapter()
  }

  async run({
    search,
    page,
    perPage
  }: ListCompaniesParams): Promise<object | ApplicationError> {
    try {
      this.paginator.setPerPage(perPage)
      this.paginator.setSkip(page)

      const companiesCount = (await this.companyRepository.count!()) as number
      const companies = (await this.companyRepository.list!({
        search,
        page: this.paginator.getSkip(),
        perPage: this.paginator.getPerPage()
      })) as Company[]

      const companiesFormatted = companies.map(
        company => company.serializable_hash
      )

      const companiesPaginated = this.paginator.itemsPaginated(
        companiesFormatted,
        companiesCount
      )

      return companiesPaginated
    } catch (error) {
      if (error instanceof ApplicationError) {
        return new ApplicationError(error.message)
      } else {
        return new ApplicationError(t('error.internal'))
      }
    }
  }
}
