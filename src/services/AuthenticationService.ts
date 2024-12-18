import { t } from '../config/i18next/I18nextLocalization'
import Admin, { AdminProps } from '../entities/Admin'
import ApplicationUser from '../entities/ApplicationUser'
import CompanyUser, { CompanyUserProps } from '../entities/CompanyUser'
import User, { UserProps } from '../entities/User'
import { ApplicationError } from '../helpers/ApplicationError'
import PasswordHelper from '../helpers/PasswordHelper'
import { ApplicationRepository } from '../repositories/ApplicationRepository'
import { ApplicationService } from './ApplicationService'

type AuthenticationProps = {
  type: string
  email: string
  password: string
}

type AuthenticationUserProps = {
  props: {
    isBlocked: boolean
    encryptedPassword: string
  }
}

export default class AuthenticationService implements ApplicationService {
  private repository: ApplicationRepository | Partial<ApplicationRepository>

  constructor(
    repository: ApplicationRepository | Partial<ApplicationRepository>
  ) {
    this.repository = repository
  }

  public async run({
    type,
    email,
    password
  }: AuthenticationProps): Promise<ApplicationUser | ApplicationError> {
    const _user = (await this.repository.findUser!(
      type,
      email
    )) as AuthenticationUserProps
    if (_user instanceof ApplicationError)
      return this.#throwUnauthenticated(type)

    const _userProps = _user.props

    if (_userProps.isBlocked) return this.#throwUnauthenticated(type)
    const isAuthenticated = await this.#isUserAuthenticated(
      password,
      _userProps.encryptedPassword
    )

    if (isAuthenticated) {
      if (type === 'user')
        return new User(_user.props as UserProps).serializable_hash
      if (type === 'admin')
        return new Admin(_user.props as AdminProps).serializable_hash
      if (type === 'company_user')
        return new CompanyUser(_user.props as CompanyUserProps)
          .serializable_hash
    }

    return this.#throwUnauthenticated(type)
  }

  async #isUserAuthenticated(password: string, hash: string): Promise<boolean> {
    return await PasswordHelper.compare(password, hash)
  }

  #throwUnauthenticated = (resource: string): ApplicationError => {
    return new ApplicationError(
      t('error.authentication.failed', {
        resource
      })
    )
  }
}
