import User, { UserProps } from '../../entities/User'
import { ApplicationError } from '../../helpers/ApplicationError'
import { IUserRepository } from '../../repositories/IUserRepository'
import { prisma } from '../../config/database/prisma'
import { t } from '../../config/i18next/I18nextLocalization'
import ApplicationHelper from '../../helpers/ApplicationHelper'

type ListUsersParams = {
  companyId: string
  search: string
  page: number
  perPage: number
}

export class UserRepository implements IUserRepository {
  async delete(id: string): Promise<void | ApplicationError> {
    try {
      await prisma.user.delete({
        where: { id }
      })
    } catch (error) {
      if (error instanceof ApplicationError) {
        return new ApplicationError(error.message)
      } else {
        return new ApplicationError(t('error.internal'))
      }
    }
  }

  async find(id: string): Promise<User | ApplicationError> {
    try {
      const userPrisma = await prisma.user.findUnique({
        where: { id },
        include: {
          wallets: true,
          company: true,
          holder: {
            include: {
              holder_documents: true,
              operations: true
            }
          }
        }
      })

      if (!userPrisma)
        return new ApplicationError(t('error.notFound', { resource: 'user' }))

      const user = ApplicationHelper.snakeToCamel(userPrisma) as UserProps

      return new User(user)
    } catch (error) {
      if (error instanceof ApplicationError) {
        return new ApplicationError(error.message)
      } else {
        return new ApplicationError(t('error.internal'))
      }
    }
  }

  async create({
    name,
    cnpj,
    email,
    taxpayerId,
    companyId,
    phone,
    phonePrefix,
    holderId,
    encryptedPassword
  }: UserProps): Promise<User | ApplicationError> {
    try {
      let associateUserToHolder = {}
      if (holderId) {
        associateUserToHolder = {
          holder_id: holderId
        }
      }

      const userPrisma = await prisma.user.create({
        data: {
          name,
          cnpj,
          email,
          phone,
          taxpayer_id: taxpayerId,
          phone_prefix: phonePrefix,
          encrypted_password: encryptedPassword!,
          company_id: companyId,
          ...associateUserToHolder
        }
      })

      const user = ApplicationHelper.snakeToCamel(userPrisma) as UserProps

      return new User(user)
    } catch (error) {
      if (error instanceof ApplicationError) {
        return new ApplicationError(error.message)
      } else {
        return new ApplicationError(t('error.internal'))
      }
    }
  }

  async list({
    companyId,
    search,
    page,
    perPage
  }: ListUsersParams): Promise<User[] | ApplicationError> {
    const TaxpayerIdFormatted = ApplicationHelper.taxpayerIdFormatted(search)
    const CNPJFormatted = ApplicationHelper.CNPJFormatted(search)

    let companyIdVerification = {}
    if (companyId) {
      companyIdVerification = {
        company_id: companyId
      }
    }

    const users = await prisma.user.findMany({
      skip: page,
      take: perPage,
      where: {
        ...companyIdVerification,
        OR: [
          { id: search },
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { taxpayer_id: { contains: search } },
          { taxpayer_id: { contains: search.replace(/\D+/g, '') } },
          { taxpayer_id: { contains: TaxpayerIdFormatted } },
          { cnpj: { contains: search } },
          { cnpj: { contains: search.replace(/\D+/g, '') } },
          { cnpj: { contains: CNPJFormatted } }
        ]
      },
      include: {
        company: true,
        wallets: true,
        holder: {
          include: {
            holder_documents: true,
            operations: true
          }
        }
      }
    })

    const formatedUsers = users.map(user => {
      return new User(ApplicationHelper.snakeToCamel(user) as UserProps)
    })

    return formatedUsers
  }

  async update(
    id: string,
    params: UserProps
  ): Promise<User | ApplicationError> {
    try {
      const { name, phone, phonePrefix, email } = params
      const user = await prisma.user.update({
        where: { id },
        data: {
          name,
          phone,
          email,
          phone_prefix: phonePrefix
        }
      })

      const updatedUser = new User(
        ApplicationHelper.snakeToCamel(user) as UserProps
      )

      return updatedUser
    } catch (error) {
      if (error instanceof ApplicationError) {
        return new ApplicationError(error.message)
      } else {
        return new ApplicationError(t('error.internal'))
      }
    }
  }

  async blockOrUnblock(id: string, is_blocked: boolean): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        is_blocked
      }
    })

    const updatedUser = new User(
      ApplicationHelper.snakeToCamel(user) as UserProps
    )

    return updatedUser
  }

  async userExists(
    companyId: string,
    taxpayerId: string,
    cnpj?: string
  ): Promise<boolean | ApplicationError> {
    try {
      let cnpjVerification = {}
      if (cnpj) {
        const formattedCNPJ = ApplicationHelper.CNPJFormatted(cnpj)
        cnpjVerification = {
          OR: [{ cnpj }, { cnpj: formattedCNPJ }]
        }
      }

      const TaxpayerIdFormatted =
        ApplicationHelper.taxpayerIdFormatted(taxpayerId)

      const user = await prisma.user.findFirst({
        where: {
          company_id: companyId,
          OR: [
            { taxpayer_id: taxpayerId },
            { taxpayer_id: taxpayerId.replace(/\D+/g, '') },
            { taxpayer_id: TaxpayerIdFormatted }
          ],
          ...cnpjVerification
        }
      })

      return !!user
    } catch (error) {
      if (error instanceof ApplicationError) {
        return new ApplicationError(error.message)
      } else {
        return new ApplicationError(t('error.internal'))
      }
    }
  }

  async companyExists(id: string): Promise<boolean | ApplicationError> {
    try {
      const company = await prisma.company.findUnique({
        where: { id }
      })

      return !!company
    } catch (error) {
      if (error instanceof ApplicationError) {
        return new ApplicationError(error.message)
      } else {
        return new ApplicationError(t('error.internal'))
      }
    }
  }

  async findUser(
    type: string,
    email: string
  ): Promise<User | ApplicationError> {
    const userPrisma = await prisma.user.findUnique({
      where: {
        resource: type,
        email
      },
      include: {
        wallets: true,
        company: true,
        holder: {
          include: {
            holder_documents: true,
            operations: true
          }
        }
      }
    })

    if (!userPrisma)
      return new ApplicationError(t('error.notFound', { resource: type }))

    const user = ApplicationHelper.snakeToCamel(userPrisma) as UserProps

    return new User(user)
  }

  async updatePassword(
    email: string,
    password: string
  ): Promise<Partial<User> | ApplicationError> {
    try {
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          encrypted_password: password
        }
      })

      if (!updatedUser) {
        return new ApplicationError(t('error.notFound', { resource: 'user' }))
      }

      const user = ApplicationHelper.snakeToCamel(updatedUser) as UserProps

      return new User(user)
    } catch (error) {
      return new ApplicationError(t('error.notFound', { resource: 'user' }))
    }
  }

  async emailExists(email: string, id?: string): Promise<boolean> {
    try {
      let validateWithId = {}
      if (id) {
        validateWithId = { NOT: { id } }
      }

      const user = await prisma.user.findUnique({
        where: { email, ...validateWithId }
      })

      return !!user
    } catch (error) {
      return false
    }
  }

  public async count(): Promise<number | ApplicationError> {
    const usersAggregate = await prisma.user.aggregate({
      _count: {
        id: true
      }
    })

    return usersAggregate?._count?.id
  }
}
