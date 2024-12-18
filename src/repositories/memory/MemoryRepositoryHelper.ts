import { ApplicationRepositoryHelper } from '../../helpers/ApplicationRepositoryHelper'
import { ApplicationRepository } from '../ApplicationRepository'
import AdminRepository from './AdminRepository'
import CompanyUserRepository from './CompanyUserRepository'
import UserRepository from './UserRepository'
import userMock from '../../__mocks__/entities/user-mock'
import adminMock from '../../__mocks__/entities/admin-mock'
import companyUserMock from '../../__mocks__/entities/company-user-mock'

export class MemoryRepositoryHelper implements ApplicationRepositoryHelper {
  adminRepository: AdminRepository
  userRepository: UserRepository
  companyUserRepository: CompanyUserRepository

  constructor() {
    this.adminRepository = new AdminRepository()
    this.userRepository = new UserRepository()
    this.companyUserRepository = new CompanyUserRepository()

    this.userRepository.create(userMock)
    this.adminRepository.create(adminMock)
    this.companyUserRepository.create(companyUserMock)
  }

  getRepositoryInstance(type: string): ApplicationRepository {
    if (type === 'admin') return this.adminRepository
    else if (type === 'user') return this.userRepository

    return this.companyUserRepository
  }
}
