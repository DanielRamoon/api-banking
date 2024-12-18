import { t } from '../../config/i18next/I18nextLocalization'
import Company, { CompanyProps } from '../../entities/Company'
import { ApplicationError } from '../../helpers/ApplicationError'
import { ICompanyRepository } from '../ICompanyRepository'

export default class CompanyRepository implements ICompanyRepository {
  public companies: Map<string, Company>

  constructor() {
    this.companies = new Map<string, Company>()
  }
  delete(id: string): Promise<void | ApplicationError> {
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

  public async create(
    params: CompanyProps
  ): Promise<Company | ApplicationError> {
    const {
      id,
      resource,
      name,
      cnpj,
      companyName,
      createdAt,
      updatedAt
    }: CompanyProps = params

    const company = new Company({
      id,
      resource,
      name,
      cnpj,
      companyName,
      createdAt,
      updatedAt
    })

    this.companies.set(id!, company)

    return company
  }

  async cnpjExists(cnpj: string): Promise<boolean> {
    for (const company of this.companies.values()) {
      const _foundCompany = company.cnpj === cnpj

      if (_foundCompany) return true
    }

    return false
  }

  async findByIdOrCNPJ(search: string): Promise<Company | null> {
    for (const company of this.companies.values()) {
      const _foundCompany = company.cnpj === search || company.id === search

      if (_foundCompany) return company
    }

    return null
  }

  async blockOrUnblock(id: string, is_blocked: boolean): Promise<Company> {
    const company = this.companies.get(id)
    this.companies.set(id, {
      ...company,
      isBlocked: is_blocked
    } as Company)

    return this.companies.get(id) as Company
  }

  async count(): Promise<number | ApplicationError> {
    return this.companies.size
  }

  update(id: string, params: object): Promise<object | ApplicationError> {
    throw new Error(`Method not implemented. ${params}`)
  }

  async find(id: string): Promise<Company | ApplicationError> {
    const company = await this.companies.get(id)

    if (!company)
      return new ApplicationError(
        t('error.notFound', { resource: 'company_user' })
      )

    return company
  }

  public async list(): Promise<Company[] | ApplicationError> {
    const _companies = [...this.companies.values()]
    return _companies
  }
}
