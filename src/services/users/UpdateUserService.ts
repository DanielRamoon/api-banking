import { t } from '../../config/i18next/I18nextLocalization'
import User, { UserProps } from '../../entities/User'
import { ApplicationError } from '../../helpers/ApplicationError'
import { IUserRepository } from '../../repositories/IUserRepository'
import { ApplicationService } from '../ApplicationService'

type UpdateUserParams = {
  id: string
  name: string
  email: string
  phone: string
  phonePrefix: string
}

export class UpdateUserService implements ApplicationService {
  private userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async run({
    id,
    name,
    email,
    phone,
    phonePrefix
  }: UpdateUserParams): Promise<User | ApplicationError> {
    try {
      phonePrefix = phonePrefix?.replace(/\D+/g, '')
      phone = phone?.replace(/\D+/g, '')

      const user = await this.userRepository.update(id, {
        name,
        email,
        phone,
        phonePrefix
      })

      if (user instanceof ApplicationError) throw user

      return new User(user as UserProps).serializable_hash
    } catch (error) {
      if (error instanceof ApplicationError) {
        return new ApplicationError(error.message)
      } else {
        return new ApplicationError(t('error.internal'))
      }
    }
  }
}
