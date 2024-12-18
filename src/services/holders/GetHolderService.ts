import { t } from '../../config/i18next/I18nextLocalization'
import Holder, { HolderProps } from '../../entities/Holder'
import { ApplicationError } from '../../helpers/ApplicationError'
import { IHolderRepository } from '../../repositories/IHolderRepository'
import { ApplicationService } from '../ApplicationService'

type GetHolderParams = {
  id: string
}

export class GetHolderService implements ApplicationService {
  private holderRepository: IHolderRepository

  constructor(holderRepository: IHolderRepository) {
    this.holderRepository = holderRepository
  }

  async run({ id }: GetHolderParams): Promise<Holder | ApplicationError> {
    try {
      const findOrError = await this.holderRepository.find(id)

      if (findOrError instanceof ApplicationError) return findOrError

      return new Holder(findOrError as HolderProps).serializable_hash
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
