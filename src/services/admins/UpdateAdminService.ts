import { t } from '../../config/i18next/I18nextLocalization'
import Admin, { AdminProps, Role } from '../../entities/Admin'
import { ApplicationError } from '../../helpers/ApplicationError'
import { IAdminRepository } from '../../repositories/IAdminRepository'
import { ApplicationService } from '../ApplicationService'

type UpdateAdminParams = {
  id: string
  name: string
  email: string
  role: Role
}

export class UpdateAdminService implements ApplicationService {
  private adminRepository: IAdminRepository

  constructor(adminRepository: IAdminRepository) {
    this.adminRepository = adminRepository
  }

  async run({
    id,
    name,
    email,
    role
  }: UpdateAdminParams): Promise<Admin | ApplicationError> {
    try {
      const admin = await this.adminRepository.update(id, {
        name,
        email,
        role
      })

      if (admin instanceof ApplicationError) throw admin

      return new Admin(admin as AdminProps).serializable_hash
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
