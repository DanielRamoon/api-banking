import { ApplicationProvider } from '../../adapters/providers/ApplicationProvider'
import { t } from '../../config/i18next/I18nextLocalization'
import Holder, { HolderProps } from '../../entities/Holder'
import { DocumentType } from '../../entities/HolderDocument'
import { ApplicationError } from '../../helpers/ApplicationError'
import {
  base64ImageDencode,
  deleteFolder,
  generateFileName,
  generateFolderName,
  getFileContentTypeFromBase64,
  getFileExtensionFromBase64,
  saveFileToLocalStorage
} from '../../helpers/FileHelper'
import HolderDocumentValidator from '../../helpers/validators/zod/HolderDocumentValidator'
import { IHolderRepository } from '../../repositories/IHolderRepository'
import { ApplicationService } from '../ApplicationService'

type HolderDocumentsProps = [
  {
    type: DocumentType
    file: string
  }
]

type SendHolderDocumentsParams = {
  holderId: string
  holderDocuments: HolderDocumentsProps
}

export class SendHolderDocumentsService implements ApplicationService {
  private holderRepository: IHolderRepository
  private sendFileToBucketService: ApplicationService
  private createHolderDocumentService: ApplicationService
  private sendDocumentProvider: ApplicationProvider

  private errors: { [key: string]: string[] } = {}
  private sentFiles: { [key: string]: string[] } = {}

  constructor(
    holderRepository: IHolderRepository,
    sendFileToBucketService: ApplicationService,
    createHolderDocumentService: ApplicationService,
    sendDocumentProvider: ApplicationProvider
  ) {
    this.holderRepository = holderRepository
    this.sendFileToBucketService = sendFileToBucketService
    this.createHolderDocumentService = createHolderDocumentService
    this.sendDocumentProvider = sendDocumentProvider
  }

  async run({
    holderId,
    holderDocuments
  }: SendHolderDocumentsParams): Promise<object | ApplicationError> {
    const holderDocumentsFolder = generateFolderName()

    try {
      const findOrError = await this.holderRepository.find(holderId)

      if (findOrError instanceof ApplicationError) {
        return {
          withErrors: true,
          sentFiles: [],
          errors: [findOrError.message]
        }
      }

      const holder = new Holder(findOrError as HolderProps).serializable_hash

      if (!holder.zoopHolderId) {
        return {
          withErrors: true,
          sentFiles: [],
          errors: [t('error.provider.zoopHolderId')]
        }
      }

      for (const holderDocument of holderDocuments) {
        this.errors[holderDocument.type] = []
        this.sentFiles[holderDocument.type] = []

        let filename = generateFileName()

        const holderDocumentValidator = new HolderDocumentValidator(
          {
            holderId,
            file: filename,
            type: holderDocument.type
          },
          this.holderRepository
        )

        const holderDocumentValid = await holderDocumentValidator.validate()

        if (!holderDocumentValid) {
          const holderDocumentErrors = await holderDocumentValidator.errors()
          this.errors[holderDocument.type].push(...holderDocumentErrors)
          continue
        }

        const file = holderDocument.file
        const buffer = base64ImageDencode(file)

        if (buffer instanceof ApplicationError) {
          this.errors[holderDocument.type].push(buffer.message)
          continue
        }

        const fileExtension = getFileExtensionFromBase64(file)
        filename = `${filename}${fileExtension}`

        const localFile = saveFileToLocalStorage(
          buffer as Buffer,
          holderDocumentsFolder,
          filename
        )

        if (localFile instanceof ApplicationError) {
          this.errors[holderDocument.type].push(localFile.message)
          continue
        }

        const createOrError = await this.createHolderDocumentService.run({
          holder_id: holder.id,
          type: holderDocument.type,
          filename
        })

        if (createOrError instanceof ApplicationError) {
          this.errors[holderDocument.type].push(createOrError.message)
          continue
        }

        const sendDocument = await this.sendFileToBucketService.run({
          filesFolder: holderDocumentsFolder,
          filename
        })

        if (sendDocument instanceof ApplicationError) {
          this.errors[holderDocument.type].push(sendDocument.message)
          continue
        }

        const contentType = getFileContentTypeFromBase64(file)
        const holderProvider = await this.sendDocumentProvider.execute({
          zoopHolderId: holder.zoopHolderId,
          type: holderDocument.type,
          filepath: localFile,
          filename,
          contentType
        })

        if (holderProvider instanceof ApplicationError) {
          const _holderProviderError = JSON.parse(holderProvider.message)
          this.errors[holderDocument.type].push(_holderProviderError)
          continue
        }

        this.sentFiles[holderDocument.type].push(filename)
      }

      const someSentFiles = Object.values(this.sentFiles)
        .flat(Infinity)
        .some(v => v)

      const sentFiles = someSentFiles ? this.sentFiles : []

      const someErrors = Object.values(this.errors)
        .flat(Infinity)
        .some(v => v)

      const errors = someErrors ? this.errors : []
      const withErrors = someErrors

      return {
        withErrors,
        sentFiles,
        errors
      }
    } catch (error) {
      const _message =
        error instanceof ApplicationError
          ? error.message
          : t('error.file.upload')
      return new ApplicationError(_message)
    } finally {
      deleteFolder(holderDocumentsFolder)
    }
  }
}
