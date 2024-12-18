/* eslint-disable no-unused-vars */
import { ApplicationRepository } from '../repositories/ApplicationRepository'

export interface ApplicationRepositoryHelper {
  getRepositoryInstance(type: string): ApplicationRepository
}
