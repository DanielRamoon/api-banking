/* eslint-disable no-unused-vars */
import Operation from '../entities/Operation'
import { ApplicationError } from '../helpers/ApplicationError'
import { ApplicationRepository } from './ApplicationRepository'

export interface IOperationRepository extends ApplicationRepository {
  find(id: string, userId?: string): Promise<Operation | ApplicationError>
  findWithWalletId(
    id: string,
    walletId: string
  ): Promise<Operation | ApplicationError>
}
