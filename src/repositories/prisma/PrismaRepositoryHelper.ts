import { ApplicationRepositoryHelper } from '../../helpers/ApplicationRepositoryHelper'
import { ApplicationRepository } from '../ApplicationRepository'
import { AdminRepository } from './AdminRepository'
import { CompanyUserRepository } from './CompanyUserRepository'
import { UserRepository } from './UserRepository'

export class PrismaRepositoryHelper implements ApplicationRepositoryHelper {
  getRepositoryInstance(type: string): ApplicationRepository {
    if (type === 'admin') return new AdminRepository()
    else if (type === 'user') return new UserRepository()

    return new CompanyUserRepository()
  }
}
