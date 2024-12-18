import { t } from '../../config/i18next/I18nextLocalization'
import HolderDocument, {
  HolderDocumentProps
} from '../../entities/HolderDocument'
import { ApplicationError } from '../../helpers/ApplicationError'
import { IHolderDocumentRepository } from '../../repositories/IHolderDocumentRepository'
import { ApplicationService } from '../ApplicationService'

type CreateHolderDocumentParams = {
  holder_id: string
  filename: string
  type: string
}

export class CreateHolderDocumentService implements ApplicationService {
  private holderDocumentRepository: IHolderDocumentRepository

  constructor(holderDocumentRepository: IHolderDocumentRepository) {
    this.holderDocumentRepository = holderDocumentRepository
  }

  async run({
    holder_id,
    filename,
    type
  }: CreateHolderDocumentParams): Promise<HolderDocument | ApplicationError> {
    try {
      const holderDocument = await this.holderDocumentRepository.create({
        holderId: holder_id,
        file: filename,
        type
      })

      if (holderDocument instanceof ApplicationError) return holderDocument

      return new HolderDocument(holderDocument as HolderDocumentProps)
        .serializable_hash
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
