import { AdminProps, Role } from '../../entities/Admin'
import { randomUUID } from 'crypto'

const mock: AdminProps = {
  id: randomUUID(),
  resource: 'admin',
  email: 'doe@example.com',
  name: 'John Doe',
  role: Role.admin,
  encryptedPassword: 'hashed_password',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-02')
}

export default mock
