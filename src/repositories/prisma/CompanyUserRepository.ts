import { ApplicationError } from '../../helpers/ApplicationError'
import { ICompanyUserRepository } from '../ICompanyUserRepository'
import CompanyUser, { CompanyUserProps, Role } from '../../entities/CompanyUser'
import { prisma } from '../../config/database/prisma'
import { t } from '../../config/i18next/I18nextLocalization'
import ApplicationHelper from '../../helpers/ApplicationHelper'

type ListCompanyUsersParams = {
  companyId: string
  search: string
  page: number
  perPage: number
}

export class CompanyUserRepository implements ICompanyUserRepository {
  async find(
    id: string,
    companyId?: string
  ): Promise<CompanyUser | ApplicationError> {
    const whereCompanyId = companyId ? { company_id: companyId } : {}

    try {
      const companyUserPrisma = await prisma.companyUser.findFirst({
        where: { id, ...whereCompanyId }
      })

      if (!companyUserPrisma)
        return new ApplicationError(
          t('error.notFound', { resource: 'company_user' })
        )

      const companyUser = ApplicationHelper.snakeToCamel(
        companyUserPrisma
      ) as CompanyUserProps

      return companyUser as CompanyUser
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }

  async create({
    name,
    email,
    role,
    encryptedPassword,
    companyId
  }: CompanyUserProps): Promise<CompanyUser | ApplicationError> {
    return await prisma.$transaction(async tx => {
      const company_user = await tx.companyUser.create({
        data: {
          encrypted_password: encryptedPassword!,
          company_id: companyId!,
          name,
          email: email!,
          role
        }
      })

      if (!company_user)
        return new ApplicationError(
          t('error.creating', {
            resource: 'company_user'
          })
        )

      const newCompanyUser = new CompanyUser(
        ApplicationHelper.snakeToCamel(company_user) as CompanyUserProps
      )

      return newCompanyUser
    })
  }

  async update(
    id: string,
    params: CompanyUserProps
  ): Promise<object | ApplicationError> {
    const { name, role } = params
    const companyUser = await prisma.companyUser.update({
      where: { id },
      data: { name, role }
    })

    const updatedCompanyUser = new CompanyUser(
      ApplicationHelper.snakeToCamel(companyUser) as CompanyUserProps
    )

    return updatedCompanyUser
  }

  async list({
    companyId,
    search,
    page,
    perPage
  }: ListCompanyUsersParams): Promise<CompanyUser[] | ApplicationError> {
    let roleSearch = {}
    if (Object.values(Role).includes(search as Role)) {
      roleSearch = {
        role: search as Role
      }
    }

    const companyUsers = await prisma.companyUser.findMany({
      skip: page,
      take: perPage,
      where: {
        company_id: companyId,
        OR: [
          { id: search },
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { ...roleSearch }
        ]
      }
    })

    const formatedCompanyUsers = companyUsers.map(companyUser => {
      return new CompanyUser(
        ApplicationHelper.snakeToCamel(companyUser) as CompanyUserProps
      )
    })

    return formatedCompanyUsers
  }

  async delete(id: string): Promise<void | ApplicationError> {
    try {
      await prisma.companyUser.delete({
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

  async emailExists(email: string, id?: string): Promise<boolean> {
    try {
      let validateWithId = {}
      if (id) {
        validateWithId = { NOT: { id } }
      }

      const companyUser = await prisma.companyUser.findUnique({
        where: { email, ...validateWithId }
      })

      return !!companyUser
    } catch (error) {
      return false
    }
  }

  async findUser(
    type: string,
    email: string
  ): Promise<Partial<CompanyUser> | ApplicationError> {
    const companyUserPrisma = await prisma.companyUser.findUnique({
      where: { email, resource: type }
    })

    if (!companyUserPrisma)
      return new ApplicationError(t('error.notFound', { resource: type }))

    const companyUser = ApplicationHelper.snakeToCamel(
      companyUserPrisma
    ) as CompanyUserProps

    return new CompanyUser(companyUser)
  }

  async updatePassword(
    email: string,
    password: string
  ): Promise<Partial<CompanyUser>> {
    try {
      const updatedCompanyUser = await prisma.companyUser.update({
        where: { email: email },
        data: {
          encrypted_password: password
        }
      })

      if (!updatedCompanyUser) {
        return new ApplicationError(
          t('error.notFound', { resource: 'company_user' })
        )
      }

      const companyUser = ApplicationHelper.snakeToCamel(
        updatedCompanyUser
      ) as CompanyUserProps

      return new CompanyUser(companyUser)
    } catch (error) {
      if (error instanceof ApplicationError) {
        return new ApplicationError(error.message)
      } else {
        return new ApplicationError(t('error.internal'))
      }
    }
  }

  public async count(companyId?: string): Promise<number | ApplicationError> {
    const companyUsersAggregate = await prisma.companyUser.aggregate({
      where: { company_id: companyId },
      _count: {
        id: true
      }
    })

    return companyUsersAggregate?._count?.id
  }
}
