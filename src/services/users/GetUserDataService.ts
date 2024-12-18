import { t } from '../../config/i18next/I18nextLocalization'
import User, { UserProps } from '../../entities/User'
import { ApplicationError } from '../../helpers/ApplicationError'
import { IUserRepository } from '../../repositories/IUserRepository'
import { ApplicationService } from '../ApplicationService'

type GetUserDataParams = {
  id: string
}

export class GetUserDataService implements ApplicationService {
  private userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async run({ id }: GetUserDataParams): Promise<unknown> {
    try {
      const findOrError = await this.userRepository.find(id)

      if (findOrError instanceof ApplicationError) return findOrError

      return new User(findOrError as UserProps).serializable_hash
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
