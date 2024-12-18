/* eslint-disable no-unused-vars */
import { ApplicationError } from '../helpers/ApplicationError'
import { ApplicationRepository } from './ApplicationRepository'

export interface ICompanyUserRepository extends ApplicationRepository {
  count(companyId?: string): Promise<number | ApplicationError>
  find(id: string, companyId?: string): Promise<object | ApplicationError>
}
