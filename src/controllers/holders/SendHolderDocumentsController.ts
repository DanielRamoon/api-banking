import { HTTPRequest } from '../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  fail,
  ok,
  unprocessable
} from '../../adapters/http/HttpResponseAdapter'
import { t } from '../../config/i18next/I18nextLocalization'
import { DocumentType } from '../../entities/HolderDocument'
import { ApplicationError } from '../../helpers/ApplicationError'
import { ApplicationService } from '../../services/ApplicationService'

type HolderDocumentsProps = [
  {
    type: DocumentType
    file: string
  }
]

type SendHolderDocumentsParams = {
  id: string
  holder_documents: HolderDocumentsProps
}

export default class SendHolderDocumentsController implements HTTPRequest {
  private sendHolderDocumentsService: ApplicationService

  constructor(sendHolderDocumentsService: ApplicationService) {
    this.sendHolderDocumentsService = sendHolderDocumentsService
  }

  async handle({
    id,
    holder_documents
  }: SendHolderDocumentsParams): Promise<HttpResponse> {
    try {
      const result = await this.sendHolderDocumentsService.run({
        holderId: id,
        holderDocuments: holder_documents
      })

      if (result instanceof ApplicationError) return unprocessable(result)

      return ok(result)
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
