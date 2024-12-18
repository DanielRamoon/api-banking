import { t } from '../../config/i18next/I18nextLocalization'
import User from '../../entities/User'
import { ApplicationError } from '../../helpers/ApplicationError'
import { IUserRepository } from '../../repositories/IUserRepository'
import { ApplicationService } from '../ApplicationService'

type BlockOrUnblockUserParams = {
  id: string
  is_blocked: string
}

export class BlockOrUnblockUserService implements ApplicationService {
  private userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  possibleValues: string[] = ['true', 'false']

  async run({
    id,
    is_blocked
  }: BlockOrUnblockUserParams): Promise<User | ApplicationError> {
    try {
      is_blocked = is_blocked.toString().toLowerCase()

      if (!this.possibleValues.includes(is_blocked)) {
        return new ApplicationError(t('error.values.invalid'))
      }

      const isBlocked = /true/.test(is_blocked)

      const user = await this.userRepository.blockOrUnblock(id, isBlocked)

      return new User(user.props).serializable_hash
    } catch (error) {
      if (error instanceof ApplicationError) {
        return new ApplicationError(error.message)
      } else {
        return new ApplicationError(t('error.internal'))
      }
    }
  }
}
