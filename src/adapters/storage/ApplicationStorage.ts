/* eslint-disable no-unused-vars */
import { ApplicationError } from '../../helpers/ApplicationError'

export type UploadedFilesType = {
  uploadedFiles: unknown[]
  errors: unknown[]
}

export interface ApplicationStorage {
  uploadFiles(folderPath: string): Promise<UploadedFilesType | ApplicationError>
  uploadFile(
    folderPath: string,
    fileName: string
  ): Promise<object | ApplicationError>
  list(): Promise<object | ApplicationError>
}
