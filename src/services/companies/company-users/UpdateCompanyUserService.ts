import { t } from '../../../config/i18next/I18nextLocalization'
import CompanyUser, {
  CompanyUserProps,
  Role
} from '../../../entities/CompanyUser'
import { ApplicationError } from '../../../helpers/ApplicationError'
import { ICompanyUserRepository } from '../../../repositories/ICompanyUserRepository'
import { ApplicationService } from '../../ApplicationService'

type UpdateCompanyParams = {
  id: string
  name: string
  role: Role
}

export class UpdateCompanyUserService implements ApplicationService {
  private companyUserRepository: ICompanyUserRepository

  constructor(companyUserRepository: ICompanyUserRepository) {
    this.companyUserRepository = companyUserRepository
  }

  async run({
    id,
    name,
    role
  }: UpdateCompanyParams): Promise<CompanyUser | ApplicationError> {
    try {
      const companyUser = await this.companyUserRepository.update!(id, {
        name,
        role
      })

      if (companyUser instanceof ApplicationError) throw companyUser

      return new CompanyUser(companyUser as CompanyUserProps).serializable_hash
    } catch (error) {
      if (error instanceof ApplicationError) {
        return new ApplicationError(error.message)
      } else {
        return new ApplicationError(t('error.internal'))
      }
    }
  }
}
