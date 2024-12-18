import { t } from '../../config/i18next/I18nextLocalization'
import CompanyUser, { CompanyUserProps } from '../../entities/CompanyUser'
import User from '../../entities/User'
import { ApplicationError } from '../../helpers/ApplicationError'
import PasswordHelper from '../../helpers/PasswordHelper'
import { IUserRepository } from '../IUserRepository'

export default class CompanyUserRepository implements IUserRepository {
  public companyUsers: Map<string, CompanyUser>

  constructor() {
    this.companyUsers = new Map<string, CompanyUser>()
  }
  emailExists(email: string): Promise<boolean> {
    throw new Error(`Method not implemented. ${email}`)
  }
  count(): Promise<number | ApplicationError> {
    throw new Error('Method not implemented.')
  }
  userExists(
    companyId: string,
    taxpayerId: string,
    cnpj?: string | undefined
  ): Promise<boolean | ApplicationError> {
    throw new Error(`Method not implemented. ${cnpj}`)
  }
  companyExists(companyId: string): Promise<boolean | ApplicationError> {
    throw new Error(`Method not implemented. ${companyId}`)
  }
  blockOrUnblock(id: string, is_blocked: boolean): Promise<User> {
    throw new Error(`Method not implemented. ${is_blocked}`)
  }

  updatePassword(
    email: string,
    password: string
  ): Promise<object | ApplicationError> {
    throw new Error(`Method not implemented. ${password}`)
  }

  update(id: string, params: object): Promise<object | ApplicationError> {
    throw new Error(`Method not implemented. ${params}`)
  }

  delete(id: string): Promise<void | ApplicationError> {
    throw new Error(`Method not implemented. ${id}`)
  }

  async find(id: string): Promise<CompanyUser | ApplicationError> {
    const companyUser = await this.companyUsers.get(id)

    if (!companyUser)
      return new ApplicationError(
        t('error.notFound', { resource: 'company_user' })
      )

    return companyUser
  }

  public async create(
    params: CompanyUserProps
  ): Promise<object | ApplicationError> {
    const {
      id,
      resource,
      email,
      name,
      companyId,
      encryptedPassword,
      role,
      createdAt,
      updatedAt
    }: CompanyUserProps = params

    const _encryptedPassword = await PasswordHelper.encrypt(encryptedPassword!)
    const companyUser = new CompanyUser({
      id,
      resource,
      email,
      name,
      companyId,
      encryptedPassword: _encryptedPassword,
      role,
      createdAt,
      updatedAt
    })

    this.companyUsers.set(id!, companyUser)

    return companyUser
  }

  public async list(): Promise<CompanyUser[] | ApplicationError> {
    const _companyUsers = [...this.companyUsers.values()]
    return _companyUsers
  }

  public async findUser(
    type: string,
    email: string
  ): Promise<CompanyUser | ApplicationError> {
    for (const admin of this.companyUsers.values()) {
      const _foundAdmin = admin.email === email && admin.resource === type

      if (_foundAdmin) return admin
    }

    return new ApplicationError(t('error.notFound', { resource: type }))
  }
}
