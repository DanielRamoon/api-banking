/* eslint-disable no-unused-vars */
import Wallet from '../entities/Wallet'
import { ApplicationError } from '../helpers/ApplicationError'
import { ApplicationRepository } from './ApplicationRepository'

export interface IWalletRepository extends ApplicationRepository {
  find(
    id: string,
    userId?: string,
    companyId?: string
  ): Promise<Wallet | ApplicationError>
}
