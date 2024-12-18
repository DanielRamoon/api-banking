import { WalletProps, TransactionLevel } from '../../entities/Wallet'
import { randomUUID } from 'crypto'

const mock: WalletProps = {
  id: randomUUID(),
  resource: 'wallet',
  zoopAccountId: randomUUID(),
  isPrimary: true,
  transactionLevel: TransactionLevel.internal,
  userId: randomUUID(),
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-02')
}

export default mock
