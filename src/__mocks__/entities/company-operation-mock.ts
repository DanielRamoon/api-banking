import { CompanyOperationProps } from '../../entities/CompanyOperation'
import { randomUUID } from 'crypto'

const mock: CompanyOperationProps = {
  id: randomUUID(),
  resource: 'company_operation',
  zoopOperationId: randomUUID(),
  type: 'payment',
  amount: 100.0,
  currency: 'BRL',
  companyId: randomUUID(),
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-02')
}

export default mock
