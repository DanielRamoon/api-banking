/* eslint-disable no-unused-vars */
import Company from '../entities/Company'
import { ApplicationRepository } from './ApplicationRepository'

export interface ICompanyRepository extends ApplicationRepository {
  cnpjExists(cnpj: string): Promise<boolean>
  findByIdOrCNPJ(search: string): Promise<Company | null>
  blockOrUnblock(id: string, is_blocked: boolean): Promise<Company>
}
