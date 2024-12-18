import {
  ApplicationStorage,
  UploadedFilesType
} from '../../adapters/storage/ApplicationStorage'
import { t } from '../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../helpers/ApplicationError'
import { ApplicationService } from '../ApplicationService'

type UpdloadDocumentsParams = {
  filesFolder: string
  filename?: string
  multiple?: boolean
}

export class SendFileToBucketService implements ApplicationService {
  private applicationStorage: ApplicationStorage

  constructor(apllicationStorage: ApplicationStorage) {
    this.applicationStorage = apllicationStorage
  }

  async run({
    filesFolder,
    filename = '',
    multiple = false
  }: UpdloadDocumentsParams): Promise<object | ApplicationError> {
    try {
      if (multiple) {
        const { uploadedFiles, errors } =
          (await this.applicationStorage.uploadFiles(
            filesFolder
          )) as UploadedFilesType

        if (errors.length > 0) {
          return new ApplicationError(
            t('error.creating', { resource: 'document' })
          )
        }

        return uploadedFiles
      } else {
        const response = this.applicationStorage.uploadFile(
          filesFolder,
          filename
        )

        if (response instanceof ApplicationError)
          return new ApplicationError(response.message)

        return response
      }
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
