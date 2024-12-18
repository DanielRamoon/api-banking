import { t } from '../../config/i18next/I18nextLocalization'
import Company, { CompanyProps } from '../../entities/Company'
import { ApplicationError } from '../../helpers/ApplicationError'
import { ICompanyRepository } from '../../repositories/ICompanyRepository'
import { ApplicationService } from '../ApplicationService'

type BlockOrUnblockCompanyParams = {
  id: string
  is_blocked: string
}

export class BlockOrUnblockCompanyService implements ApplicationService {
  private companyRepository: ICompanyRepository

  constructor(companyRepository: ICompanyRepository) {
    this.companyRepository = companyRepository
  }

  possibleValues: string[] = ['true', 'false']

  async run({
    id,
    is_blocked
  }: BlockOrUnblockCompanyParams): Promise<Company | ApplicationError> {
    try {
      is_blocked = is_blocked.toString().toLowerCase()

      if (!this.possibleValues.includes(is_blocked)) {
        return new ApplicationError(t('error.values.invalid'))
      }

      const isBlocked = /true/.test(is_blocked)

      const company = await this.companyRepository.blockOrUnblock(id, isBlocked)

      return new Company(company as CompanyProps).serializable_hash
    } catch (error) {
      if (error instanceof ApplicationError) {
        return new ApplicationError(error.message)
      } else {
        return new ApplicationError(t('error.internal'))
      }
    }
  }
}
