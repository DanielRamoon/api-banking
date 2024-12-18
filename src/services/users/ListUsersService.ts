import { PaginateAdapter } from '../../adapters/PaginateAdapter'
import { t } from '../../config/i18next/I18nextLocalization'
import User, { UserProps } from '../../entities/User'
import { ApplicationError } from '../../helpers/ApplicationError'
import { IUserRepository } from '../../repositories/IUserRepository'
import { ApplicationService } from '../ApplicationService'

type ListUsersParams = {
  companyId: string
  search: string
  page: number
  perPage: number
}

export class ListUsersService implements ApplicationService {
  private userRepository: IUserRepository
  private paginator: PaginateAdapter

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
    this.paginator = new PaginateAdapter()
  }

  async run({
    companyId,
    search,
    page,
    perPage
  }: ListUsersParams): Promise<object | ApplicationError> {
    try {
      this.paginator.setPerPage(perPage)
      this.paginator.setSkip(page)

      const usersCount = (await this.userRepository.count()) as number
      let users = (await this.userRepository.list({
        companyId,
        search,
        page: this.paginator.getSkip(),
        perPage: this.paginator.getPerPage()
      })) as User[]

      users = users.map(
        user => new User(user as unknown as UserProps).serializable_hash
      )

      const usersPaginated = this.paginator.itemsPaginated(users, usersCount)

      return usersPaginated
    } catch (error) {
      if (error instanceof ApplicationError) {
        return new ApplicationError(error.message)
      } else {
        return new ApplicationError(t('error.internal'))
      }
    }
  }
}
