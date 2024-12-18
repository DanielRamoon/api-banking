import { CompanyUserProps, Role } from '../../entities/CompanyUser'
import { randomUUID } from 'crypto'

const mock: CompanyUserProps = {
  id: randomUUID(),
  resource: 'company_user',
  email: 'doe@example.com',
  name: 'John Doe',
  role: Role.owner,
  companyId: randomUUID(),
  encryptedPassword: 'hashed_password',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-02')
}

export default mock
