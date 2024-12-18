import { ApplicationError } from '../../helpers/ApplicationError'
import { ApplicationService } from '../ApplicationService'
import { IAdminRepository } from '../../repositories/IAdminRepository'
import { t } from '../../config/i18next/I18nextLocalization'

type DeleteAdminParams = {
  id: string
}

export class DeleteAdminService implements ApplicationService {
  private adminRepository: IAdminRepository

  constructor(adminRepository: IAdminRepository) {
    this.adminRepository = adminRepository
  }

  async run({ id }: DeleteAdminParams): Promise<boolean | ApplicationError> {
    try {
      const deletedAdmin = await this.adminRepository.delete(id)

      if (deletedAdmin instanceof ApplicationError) return deletedAdmin

      return true
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
