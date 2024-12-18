import { t } from '../../config/i18next/I18nextLocalization'
import Company, { CompanyProps } from '../../entities/Company'
import { ApplicationError } from '../../helpers/ApplicationError'
import { ICompanyRepository } from '../../repositories/ICompanyRepository'
import { ApplicationService } from '../ApplicationService'

type UpdateCompanyParams = {
  id: string
  name: string
  cnpj: string
  companyName: string
}

export class UpdateCompanyService implements ApplicationService {
  private companyRepository: ICompanyRepository
  constructor(companyRepository: ICompanyRepository) {
    this.companyRepository = companyRepository
  }

  async run({
    id,
    name,
    cnpj,
    companyName
  }: UpdateCompanyParams): Promise<Company | ApplicationError> {
    try {
      const company = await this.companyRepository.update!(id, {
        name,
        cnpj,
        companyName
      })

      if (company instanceof ApplicationError) throw company

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
