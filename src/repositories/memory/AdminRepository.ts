import { t } from '../../config/i18next/I18nextLocalization'
import Admin, { AdminProps } from '../../entities/Admin'
import User from '../../entities/User'
import { ApplicationError } from '../../helpers/ApplicationError'
import PasswordHelper from '../../helpers/PasswordHelper'
import { IUserRepository } from '../IUserRepository'

export default class AdminRepository implements IUserRepository {
  public admins: Map<string, Admin>

  constructor() {
    this.admins = new Map<string, Admin>()
  }

  async find(id: string): Promise<Admin | ApplicationError> {
    const admin = await this.admins.get(id)

    if (!admin)
      return new ApplicationError(t('error.notFound', { resource: 'admin' }))

    return admin
  }

  public async create(params: AdminProps): Promise<object | ApplicationError> {
    const {
      id,
      resource,
      email,
      name,
      encryptedPassword,
      role,
      createdAt,
      updatedAt
    }: AdminProps = params

    const _encryptedPassword = await PasswordHelper.encrypt(encryptedPassword!)
    const admin = new Admin({
      id,
      resource,
      email,
      name,
      encryptedPassword: _encryptedPassword,
      role,
      createdAt,
      updatedAt
    })

    this.admins.set(id!, admin)

    return admin
  }

  public async list(): Promise<Admin[] | ApplicationError> {
    const _admins = [...this.admins.values()]
    return _admins
  }

  public async findUser(
    type: string,
    email: string
  ): Promise<Admin | ApplicationError> {
    for (const admin of this.admins.values()) {
      const _foundAdmin = admin.email === email && admin.resource === type

      if (_foundAdmin) return admin
    }

    return new ApplicationError(t('error.notFound', { resource: type }))
  }

  async emailExists(email: string): Promise<boolean> {
    for (const user of this.admins.values()) {
      const _foundUser = user.email === email

      if (_foundUser) return true
    }

    return false
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
}
