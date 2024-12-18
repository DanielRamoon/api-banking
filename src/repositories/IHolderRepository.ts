/* eslint-disable no-unused-vars */
import Holder from '../entities/Holder'
import { ApplicationError } from '../helpers/ApplicationError'
import { ApplicationRepository } from './ApplicationRepository'

export interface IHolderRepository extends ApplicationRepository {
  findByCNPJAndTaxpayerId(
    taxpayerId: string,
    cnpj?: string
  ): Promise<Holder | ApplicationError>
  ensureTaxpayerIdCNPJUniqueness(
    taxpayerId: string,
    cnpj: string | undefined,
    id?: string
  ): Promise<boolean>
  linkUser(id: string, user_id: string): Promise<Holder | ApplicationError>
  unlinkUser(id: string, user_id: string): Promise<Holder | ApplicationError>
  userCount(holderId: string): Promise<number>
}
