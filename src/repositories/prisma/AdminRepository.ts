import { ApplicationError } from '../../helpers/ApplicationError'
import { IAdminRepository } from '../IAdminRepository'
import { prisma } from '../../config/database/prisma'
import { t } from '../../config/i18next/I18nextLocalization'
import ApplicationHelper from '../../helpers/ApplicationHelper'
import Admin, { AdminProps } from '../../entities/Admin'

type ListAdminsParams = {
  search: string
  page: number
  perPage: number
}

export class AdminRepository implements IAdminRepository {
  async emailExists(email: string, id?: string | undefined): Promise<boolean> {
    try {
      let validateWithId = {}
      if (id) {
        validateWithId = { NOT: { id } }
      }

      const admin = await prisma.admin.findUnique({
        where: { email, ...validateWithId }
      })

      return !!admin
    } catch (error) {
      return false
    }
  }

  async count(): Promise<number | ApplicationError> {
    const holdersAggregate = await prisma.admin.aggregate({
      _count: {
        id: true
      }
    })

    return holdersAggregate?._count?.id
  }

  async create({
    name,
    email,
    role,
    encryptedPassword
  }: AdminProps): Promise<object | ApplicationError> {
    try {
      const adminPrisma = await prisma.admin.create({
        data: {
          name,
          email,
          role,
          encrypted_password: encryptedPassword!
        }
      })

      const admin = ApplicationHelper.snakeToCamel(adminPrisma) as AdminProps

      return new Admin(admin)
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }

  async list({
    page,
    perPage
  }: ListAdminsParams): Promise<ApplicationError | object[]> {
    try {
      const admins = await prisma.admin.findMany({
        skip: page,
        take: perPage
      })

      const formatedAdmins = admins.map(admin => {
        return new Admin(ApplicationHelper.snakeToCamel(admin) as AdminProps)
      })

      return formatedAdmins
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }

  async update(
    id: string,
    params: AdminProps
  ): Promise<object | ApplicationError> {
    try {
      const _params = ApplicationHelper.camelToSnake(params)

      const admin = await prisma.admin.update({
        where: { id },
        data: {
          ..._params
        }
      })

      const updatedAdmin = new Admin(
        ApplicationHelper.snakeToCamel(admin) as AdminProps
      )

      return updatedAdmin
    } catch (error) {
      const _message =
        error instanceof ApplicationError
          ? error.message
          : t('error.notFound', { resource: 'admin' })
      return new ApplicationError(_message)
    }
  }

  async delete(id: string): Promise<void | ApplicationError> {
    try {
      await prisma.admin.delete({
        where: { id }
      })
    } catch (error) {
      const _message =
        error instanceof ApplicationError
          ? error.message
          : t('error.notFound', { resource: 'admin' })
      return new ApplicationError(_message)
    }
  }

  async find(id: string): Promise<Admin | ApplicationError> {
    try {
      const adminPrisma = await prisma.admin.findUnique({
        where: { id }
      })

      if (!adminPrisma)
        return new ApplicationError(t('error.notFound', { resource: 'admin' }))

      const admin = ApplicationHelper.snakeToCamel(adminPrisma) as AdminProps

      return admin as Admin
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }

  async findUser(
    type: string,
    email: string
  ): Promise<Admin | ApplicationError> {
    const adminPrisma = await prisma.admin.findUnique({
      where: {
        resource: type,
        email
      }
    })

    if (!adminPrisma)
      return new ApplicationError(t('error.notFound', { resource: type }))

    const admin = ApplicationHelper.snakeToCamel(adminPrisma) as AdminProps

    return new Admin(admin)
  }

  async updatePassword(
    email: string,
    password: string
  ): Promise<Admin | ApplicationError> {
    try {
      const updatedAdmin = await prisma.admin.update({
        where: { email },
        data: {
          encrypted_password: password
        }
      })

      if (!updatedAdmin) {
        return new ApplicationError(t('error.notFound', { resource: 'admin' }))
      }

      const admin = ApplicationHelper.snakeToCamel(updatedAdmin) as AdminProps

      return new Admin(admin)
    } catch (error) {
      return new ApplicationError(t('error.notFound', { resource: 'admin' }))
    }
  }
}
