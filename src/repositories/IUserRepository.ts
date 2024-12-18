/* eslint-disable no-unused-vars */
import User from '../entities/User'
import { ApplicationError } from '../helpers/ApplicationError'
import { ApplicationRepository } from './ApplicationRepository'

export interface IUserRepository extends ApplicationRepository {
  userExists(
    companyId: string,
    taxpayerId: string,
    cnpj?: string
  ): Promise<boolean | ApplicationError>
  companyExists(companyId: string): Promise<boolean | ApplicationError>
  blockOrUnblock(id: string, is_blocked: boolean): Promise<User>
}
