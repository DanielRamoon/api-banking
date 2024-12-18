import { t } from '../../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../../helpers/ApplicationError'
import { ICompanyUserRepository } from '../../../repositories/ICompanyUserRepository'
import { ApplicationService } from '../../ApplicationService'

type DeleteCompanyParams = {
  id: string
}

export class DeleteCompanyUserService implements ApplicationService {
  private companyUserRepository: ICompanyUserRepository

  constructor(companyUserRepository: ICompanyUserRepository) {
    this.companyUserRepository = companyUserRepository
  }

  async run({ id }: DeleteCompanyParams): Promise<boolean | ApplicationError> {
    try {
      const deletedCompanyUser = await this.companyUserRepository.delete!(id)

      if (deletedCompanyUser instanceof ApplicationError)
        throw deletedCompanyUser

      return true
    } catch (error) {
      if (error instanceof ApplicationError) {
        return new ApplicationError(error.message)
      } else {
        return new ApplicationError(t('error.internal'))
      }
    }
  }
}
