import { t } from '../../../config/i18next/I18nextLocalization'
import CompanyUser, { CompanyUserProps } from '../../../entities/CompanyUser'
import { ApplicationError } from '../../../helpers/ApplicationError'
import { ICompanyUserRepository } from '../../../repositories/ICompanyUserRepository'
import { ApplicationService } from '../../ApplicationService'

type GetCompanyUserParams = {
  id: string
  companyId?: string
}

export class GetCompanyUserService implements ApplicationService {
  private companyUserRepository: ICompanyUserRepository

  constructor(companyUserRepository: ICompanyUserRepository) {
    this.companyUserRepository = companyUserRepository
  }

  async run({
    id,
    companyId
  }: GetCompanyUserParams): Promise<CompanyUser | ApplicationError> {
    try {
      const findOrError = await this.companyUserRepository.find(id, companyId)

      if (findOrError instanceof ApplicationError) return findOrError

      return new CompanyUser(findOrError as CompanyUserProps).serializable_hash
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
