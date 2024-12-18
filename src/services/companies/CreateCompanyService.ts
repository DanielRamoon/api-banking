import { t } from '../../config/i18next/I18nextLocalization'
import Company, { CompanyProps } from '../../entities/Company'
import { Role } from '../../entities/CompanyUser'
import { ApplicationError } from '../../helpers/ApplicationError'
import { ICompanyRepository } from '../../repositories/ICompanyRepository'
import { ApplicationService } from '../ApplicationService'

type CreateCompanyParams = {
  name: string
  cnpj: string
  companyName: string
  companyUser: CreateCompanyUserParams
}

type CreateCompanyUserParams = {
  name: string
  email: string
  role: Role
  encrypetedPassword: string
}

export class CreateCompanyService implements ApplicationService {
  private companyRepository: ICompanyRepository

  constructor(companyRepository: ICompanyRepository) {
    this.companyRepository = companyRepository
  }

  async run({
    name,
    cnpj,
    companyName,
    companyUser
  }: CreateCompanyParams): Promise<Company | ApplicationError> {
    try {
      const company = await this.companyRepository.create!({
        name,
        cnpj,
        companyName,
        companyUser
      })

      if (company instanceof ApplicationError) throw company

      return new Company(company as CompanyProps).serializable_hash
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
