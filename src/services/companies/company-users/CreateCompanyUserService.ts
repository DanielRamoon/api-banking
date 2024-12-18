import { t } from '../../../config/i18next/I18nextLocalization'
import CompanyUser, {
  CompanyUserProps,
  Role
} from '../../../entities/CompanyUser'
import { ApplicationError } from '../../../helpers/ApplicationError'
import { ICompanyUserRepository } from '../../../repositories/ICompanyUserRepository'
import { ApplicationService } from '../../ApplicationService'

type CreateCompanyUserParams = {
  companyId: string
  name: string
  email: string
  role: Role
  encryptedPassword: string
}

export class CreateCompanyUserService implements ApplicationService {
  private companyUserRepository: ICompanyUserRepository

  constructor(companyUserRepository: ICompanyUserRepository) {
    this.companyUserRepository = companyUserRepository
  }

  async run({
    name,
    email,
    role,
    encryptedPassword,
    companyId
  }: CreateCompanyUserParams): Promise<CompanyUser | ApplicationError> {
    try {
      const companyUser = await this.companyUserRepository.create!({
        companyId,
        name,
        email,
        role,
        encryptedPassword
      })

      if (companyUser instanceof ApplicationError) return companyUser

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
