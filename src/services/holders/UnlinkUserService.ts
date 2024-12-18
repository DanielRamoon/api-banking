import { t } from '../../config/i18next/I18nextLocalization'
import Holder, { HolderProps } from '../../entities/Holder'
import { ApplicationError } from '../../helpers/ApplicationError'
import { IHolderRepository } from '../../repositories/IHolderRepository'
import { ApplicationService } from '../ApplicationService'

type UnlinkUserServiceParams = {
  id: string
  user_id: string
}

export class UnlinkUserService implements ApplicationService {
  private holderRepository: IHolderRepository

  constructor(holderRepository: IHolderRepository) {
    this.holderRepository = holderRepository
  }

  async run({
    id,
    user_id
  }: UnlinkUserServiceParams): Promise<Holder | ApplicationError> {
    try {
      const unlinkUser = await this.holderRepository.unlinkUser(id, user_id)

      if (unlinkUser instanceof ApplicationError) return unlinkUser

      return new Holder(unlinkUser as HolderProps).serializable_hash
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
