/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplicationError } from '../helpers/ApplicationError'
import ApplicationHelper from '../helpers/ApplicationHelper'
import { ApplicationRepository } from '../repositories/ApplicationRepository'
import { ApplicationService } from './ApplicationService'
import VerifyTokenService from './VerifyTokenService'
import { USER_TYPES } from '../helpers/constants'
import { t } from '../config/i18next/I18nextLocalization'
import PasswordHelper from '../helpers/PasswordHelper'
import { ApplicationRepositoryHelper } from '../helpers/ApplicationRepositoryHelper'

type UpdatePasswordProps = {
  token: string
  password: string
  confirmPassword: string
  applicationRepository: ApplicationRepository
}

type DecodedTokenProps = {
  type: string
  email: string
}

export default class UpdatePasswordService implements ApplicationService {
  private applicationRepositoryHelper: ApplicationRepositoryHelper
  private verifyTokenService: VerifyTokenService

  constructor(applicationRepositoryHelper: ApplicationRepositoryHelper) {
    this.applicationRepositoryHelper = applicationRepositoryHelper
    this.verifyTokenService = new VerifyTokenService()
  }

  async run({
    token,
    password,
    confirmPassword
  }: UpdatePasswordProps): Promise<object | ApplicationError> {
    try {
      this.validateParams(token, password, confirmPassword)
      const decodedToken = await this.validateToken(token)

      const { type, email } = decodedToken as DecodedTokenProps
      this.validateUserType(type)

      const { repository } = await this.validateUser(type, email)

      const encryptedPassword = await PasswordHelper.encrypt(password)
      const result = await repository.updatePassword(email, encryptedPassword)

      if (result instanceof ApplicationError) throw result

      return result
    } catch (error) {
      if (error instanceof ApplicationError) {
        return new ApplicationError(error.message)
      } else {
        return new ApplicationError(t('error.internal'))
      }
    }
  }

  private validateParams(
    token: string,
    password: string,
    confirmPassword: string
  ): void {
    if (!token || !password || !confirmPassword) throw new ApplicationError('')
    if (password !== confirmPassword) throw new ApplicationError('')
  }

  private async validateToken(token: string): Promise<object> {
    const decodedToken = await this.verifyTokenService.run({ token })
    if (decodedToken instanceof ApplicationError) throw decodedToken

    return decodedToken
  }

  private validateUserType(type: string): void {
    const snakeCaseObject = { [type]: type.toLocaleLowerCase() }
    const camelCaseObject = ApplicationHelper.snakeToCamel(snakeCaseObject)

    const clazz = Object.keys(camelCaseObject)[0].replace(
      /^./,
      type[0].toUpperCase()
    )
    if (!USER_TYPES.includes(clazz)) throw new ApplicationError('')
  }

  private async validateUser(type: string, email: string): Promise<any> {
    const repository =
      this.applicationRepositoryHelper.getRepositoryInstance(type)
    const user = await repository.findUser(type, email)

    if (!user)
      throw new ApplicationError(t('error.notFound', { resource: type }))

    return {
      user,
      repository
    }
  }
}
