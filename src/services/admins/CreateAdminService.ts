import { t } from '../../config/i18next/I18nextLocalization'
import Admin, { AdminProps, Role } from '../../entities/Admin'
import { ApplicationError } from '../../helpers/ApplicationError'
import { IAdminRepository } from '../../repositories/IAdminRepository'
import { ApplicationService } from '../ApplicationService'

type CreateAdminParams = {
  name: string
  email: string
  role: Role
  encryptedPassword: string
}

export class CreateAdminService implements ApplicationService {
  private adminRepository: IAdminRepository

  constructor(adminRepository: IAdminRepository) {
    this.adminRepository = adminRepository
  }

  async run({
    name,
    email,
    role,
    encryptedPassword
  }: CreateAdminParams): Promise<Admin | ApplicationError> {
    try {
      const admin = await this.adminRepository.create({
        name,
        email,
        role,
        encryptedPassword
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
