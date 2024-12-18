import { UserProps } from '../../entities/User'
import { randomUUID } from 'crypto'

const mock: UserProps = {
  id: randomUUID(),
  resource: 'user',
  companyId: randomUUID(),
  name: 'John Doe',
  email: 'doe@example.com',
  taxpayerId: '279.528.272-00',
  phonePrefix: '91',
  phone: '98385-1504',
  encryptedPassword: 'hashed_password',
  isBlocked: false,
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-02')
}

export default mock
