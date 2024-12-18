import { CompanyProps } from '../../entities/Company'
import { randomUUID } from 'crypto'

const mock: CompanyProps = {
  id: randomUUID(),
  resource: 'company',
  name: 'John Smith',
  cnpj: '58.638.614/0001-83',
  companyName: 'Example Inc.',
  zoopAccountId: randomUUID(),
  isBlocked: false,
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-02')
}

export default mock
