import { t } from '../../config/i18next/I18nextLocalization'
import Holder, { HolderProps } from '../../entities/Holder'
import { ApplicationError } from '../../helpers/ApplicationError'
import { IHolderRepository } from '../../repositories/IHolderRepository'
import { ApplicationService } from '../ApplicationService'

type LinkUserServiceParams = {
  id: string
  user_id: string
}

export class LinkUserService implements ApplicationService {
  private holderRepository: IHolderRepository

  constructor(holderRepository: IHolderRepository) {
    this.holderRepository = holderRepository
  }

  async run({
    id,
    user_id
  }: LinkUserServiceParams): Promise<Holder | ApplicationError> {
    try {
      const linkUser = await this.holderRepository.linkUser(id, user_id)

      if (linkUser instanceof ApplicationError) return linkUser

      return new Holder(linkUser as HolderProps).serializable_hash
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
