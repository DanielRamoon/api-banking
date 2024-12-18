import { prisma } from '../../config/database/prisma'
import { ApplicationError } from '../../helpers/ApplicationError'
import { ICompanyRepository } from '../ICompanyRepository'
import Company, { CompanyProps } from '../../entities/Company'
import ApplicationHelper from '../../helpers/ApplicationHelper'
import { t } from '../../config/i18next/I18nextLocalization'

type ListCompaniesParams = {
  search: string
  page: number
  perPage: number
}

export class CompanyRepository implements ICompanyRepository {
  public async create({
    name,
    cnpj,
    companyName,
    companyUser
  }: CompanyProps): Promise<Company | ApplicationError> {
    return await prisma.$transaction(async tx => {
      const company = await tx.company.create({
        data: {
          name,
          cnpj,
          company_name: companyName,
          company_users: {
            create: {
              name: companyUser!.name,
              email: companyUser!.email,
              encrypted_password: companyUser!.encryptedPassword
            }
          }
        }
      })

      if (!company)
        return new ApplicationError(
          t('error.creating', {
            resource: 'company'
          })
        )

      const newCompany = new Company(
        ApplicationHelper.snakeToCamel(company) as CompanyProps
      )

      return newCompany
    })
  }

  async update(
    id: string,
    params: CompanyProps
  ): Promise<Company | ApplicationError> {
    const { name, cnpj, companyName } = params
    const company = await prisma.company.update({
      where: { id },
      data: {
        name,
        cnpj,
        company_name: companyName
      }
    })

    const updatedCompany = new Company(
      ApplicationHelper.snakeToCamel(company) as CompanyProps
    )

    return updatedCompany
  }

  async list({
    search,
    page,
    perPage
  }: ListCompaniesParams): Promise<Company[] | ApplicationError> {
    const CNPJFormatted = ApplicationHelper.CNPJFormatted(search)

    const companies = await prisma.company.findMany({
      skip: page,
      take: perPage,
      where: {
        OR: [
          { id: search },
          { name: { contains: search, mode: 'insensitive' } },
          { cnpj: { contains: search } },
          { cnpj: search.replace(/\D+/g, '') },
          { cnpj: CNPJFormatted }
        ]
      }
    })

    const formatedCompanies = companies.map(company => {
      return new Company(
        ApplicationHelper.snakeToCamel(company) as CompanyProps
      )
    })

    return formatedCompanies
  }

  public async findByIdOrCNPJ(search: string): Promise<Company | null> {
    const CNPJFormatted = ApplicationHelper.CNPJFormatted(search)

    const company = await prisma.company.findFirst({
      where: {
        OR: [
          { id: search },
          { cnpj: search },
          { cnpj: search.replace(/\D+/g, '') },
          { cnpj: CNPJFormatted }
        ]
      }
    })

    if (!company) return null

    const newCompany = new Company(
      ApplicationHelper.snakeToCamel(company) as CompanyProps
    )

    return newCompany
  }

  public async blockOrUnblock(
    id: string,
    is_blocked: boolean
  ): Promise<Company> {
    const company = await prisma.company.update({
      where: { id },
      data: {
        is_blocked
      }
    })

    const updatedCompany = new Company(
      ApplicationHelper.snakeToCamel(company) as CompanyProps
    )

    return updatedCompany
  }

  public async cnpjExists(cnpj: string): Promise<boolean> {
    const company = await prisma.company.findUnique({
      where: { cnpj }
    })

    return !!company
  }

  public async count(): Promise<number | ApplicationError> {
    const companiesAggregate = await prisma.company.aggregate({
      _count: {
        id: true
      }
    })

    return companiesAggregate?._count?.id
  }

  delete(id: string): Promise<void | ApplicationError> {
    throw new Error(`Method not implemented. ${id}`)
  }

  find(id: string): Promise<object | ApplicationError> {
    throw new Error(`Method not implemented. ${id}`)
  }

  findUser(type: string, email: string): Promise<object | ApplicationError> {
    throw new Error(`Method not implemented. ${email}`)
  }

  updatePassword(
    email: string,
    password: string
  ): Promise<object | ApplicationError> {
    throw new Error(`Method not implemented. ${password}`)
  }

  emailExists(email: string): Promise<boolean> {
    throw new Error(`Method not implemented. ${email}`)
  }
}
