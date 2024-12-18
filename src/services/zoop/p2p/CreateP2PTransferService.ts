import { P2PTransferTypes } from '../../../@types/zoop/P2PTransferTypes'
import { ApplicationProvider } from '../../../adapters/providers/ApplicationProvider'
import { t } from '../../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../../helpers/ApplicationError'
import { ApplicationService } from '../../ApplicationService'

type CreateP2PTransferParams = {
  accountFrom: string
  accountTo: string
  amount: number
  description: string
  statementDescriptor: string
  referenceId: string
}

export class CreateP2PTransferService implements ApplicationService {
  private createP2PTransferProvider: ApplicationProvider

  constructor(createP2PTransferProvider: ApplicationProvider) {
    this.createP2PTransferProvider = createP2PTransferProvider
  }

  async run({
    accountFrom,
    accountTo,
    amount,
    description,
    statementDescriptor,
    referenceId
  }: CreateP2PTransferParams): Promise<P2PTransferTypes | ApplicationError> {
    try {
      const p2pOperation = await this.createP2PTransferProvider.execute({
        accountFrom,
        accountTo,
        amount,
        description,
        statementDescriptor,
        referenceId
      })

      if (p2pOperation instanceof ApplicationError) return p2pOperation

      return p2pOperation as P2PTransferTypes
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
