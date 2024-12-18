import { randomUUID } from 'crypto'
import { t } from '../../config/i18next/I18nextLocalization'
import User, { UserProps } from '../../entities/User'
import { ApplicationError } from '../../helpers/ApplicationError'
import PasswordHelper from '../../helpers/PasswordHelper'
import { IUserRepository } from '../IUserRepository'

export default class UserRepository implements IUserRepository {
  public users: Map<string, User>

  constructor() {
    this.users = new Map<string, User>()
  }

  async emailExists(email: string): Promise<boolean> {
    for (const user of this.users.values()) {
      const _foundUser = user.email === email

      if (_foundUser) return true
    }

    return false
  }

  async count(): Promise<number | ApplicationError> {
    return this.users.size
  }

  userExists(
    companyId: string,
    taxpayerId: string,
    cnpj?: string | undefined
  ): Promise<boolean | ApplicationError> {
    throw new Error(
      `Method not implemented. ${{ companyId, taxpayerId, cnpj }}`
    )
  }

  async companyExists(companyId: string): Promise<boolean | ApplicationError> {
    return !!companyId
  }

  updatePassword(
    email: string,
    password: string
  ): Promise<object | ApplicationError> {
    throw new Error(`Method not implemented. ${{ email, password }}`)
  }

  async update(
    id: string,
    params: UserProps
  ): Promise<User | ApplicationError> {
    if (!id)
      return new ApplicationError(t('error.updating', { resource: 'user' }))

    const { name, email, phone, phonePrefix } = params

    const user = this.users.get(id)
    this.users.set(id, {
      ...user,
      name,
      email,
      phone,
      phonePrefix
    } as User)

    return this.users.get(id) as User
  }

  delete(id: string): Promise<void | ApplicationError> {
    throw new Error(`Method not implemented. ${id}`)
  }

  async blockOrUnblock(id: string, is_blocked: boolean): Promise<User> {
    const user = this.users.get(id)

    this.users.set(id, {
      ...user,
      isBlocked: is_blocked
    } as User)

    return new User(this.users.get(id) as unknown as UserProps) as User
  }

  async find(id: string): Promise<User | ApplicationError> {
    const user = await this.users.get(id)

    if (!user)
      return new ApplicationError(t('error.notFound', { resource: 'user' }))

    return user
  }

  public async create(params: UserProps): Promise<object | ApplicationError> {
    const {
      id,
      resource,
      email,
      name,
      taxpayerId,
      encryptedPassword,
      phonePrefix,
      phone,
      companyId,
      isBlocked,
      createdAt,
      updatedAt
    }: UserProps = params

    if (!email || !name || !taxpayerId) {
      return new ApplicationError(t('error.creating', { resource: 'user' }))
    }

    const userId = id ?? randomUUID()
    const userResource = resource ?? 'user'
    const userCreatedAt = createdAt ?? new Date()
    const userUpdatedAt = updatedAt ?? new Date()

    const _encryptedPassword = await PasswordHelper.encrypt(
      encryptedPassword ?? ''
    )
    const user = new User({
      id: userId,
      resource: userResource,
      email,
      name,
      taxpayerId,
      phonePrefix,
      phone,
      companyId,
      isBlocked,
      encryptedPassword: _encryptedPassword,
      createdAt: userCreatedAt,
      updatedAt: userUpdatedAt
    })

    this.users.set(id!, user)

    return user
  }

  public async list(): Promise<User[] | ApplicationError> {
    const _users = [...this.users.values()]
    return _users
  }

  public async findUser(
    type: string,
    email: string
  ): Promise<User | ApplicationError> {
    for (const user of this.users.values()) {
      const _foundUser = user.email === email && user.resource === type

      if (_foundUser) return user
    }

    return new ApplicationError(t('error.notFound', { resource: type }))
  }
}
