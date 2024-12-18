import { OperationProps } from '../../entities/Operation'
import { randomUUID } from 'crypto'

const mock: OperationProps = {
  id: randomUUID(),
  resource: 'operation',
  zoopOperationId: randomUUID(),
  type: 'payment',
  amountCents: 10000,
  currency: 'BRL',
  status: 'created',
  referenceId: '',
  holderId: randomUUID(),
  walletId: randomUUID(),
  userId: randomUUID(),
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-02')
}

export default mock
