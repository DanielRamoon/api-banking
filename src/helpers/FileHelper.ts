import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { ApplicationError } from './ApplicationError'
import { t } from '../config/i18next/I18nextLocalization'
import {
  BASE64_IMAGE_REGEX,
  MAX_IMAGE_FILE_SIZE,
  MIME_EXTENSIONS,
  POSSIBLE_IMAGE_FORMATS,
  TMP_FOLDER_PATH
} from './constants'

export const base64Encode = (filepath: string): string => {
  const bitmap = fs.readFileSync(filepath)
  return Buffer.from(bitmap).toString('base64')
}

export const base64ImageDencode = (
  image: string
): Buffer | ApplicationError => {
  try {
    const matches = image.match(BASE64_IMAGE_REGEX)

    if (!matches || matches.length === 0)
      return new ApplicationError(t('error.file.encode'))

    const contentType = matches[1]
    if (!POSSIBLE_IMAGE_FORMATS.includes(contentType))
      return new ApplicationError(
        t('error.file.type', {
          allowed_file_types: POSSIBLE_IMAGE_FORMATS.join(', ')
        })
      )

    const data = matches[2]
    const buffer = Buffer.from(data, 'base64')

    if (!buffer) return new ApplicationError(t('error.file.encode'))

    if (buffer.length > MAX_IMAGE_FILE_SIZE)
      return new ApplicationError(
        t('error.file.size', { max_size: MAX_IMAGE_FILE_SIZE })
      )

    return buffer
  } catch (error) {
    const _message =
      error instanceof ApplicationError ? error.message : t('error.file.upload')
    return new ApplicationError(_message)
  }
}

export const createFolder = (folder: string): void => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true })
  }
}

export const deleteFolder = (folder: string): void => {
  if (fs.existsSync(folder)) {
    fs.rmSync(folder, { recursive: true })
  }
}

export const saveFileToLocalStorage = (
  buffer: Buffer,
  folderpath: string,
  filename: string
): string | ApplicationError => {
  try {
    createFolder(folderpath)

    const outputFilePath = path.resolve(folderpath, filename)
    fs.writeFileSync(outputFilePath, buffer)

    return outputFilePath
  } catch (error) {
    const _message =
      error instanceof ApplicationError ? error.message : t('error.internal')
    return new ApplicationError(_message)
  }
}

export const getFileExtensionFromBase64 = (file: string): string => {
  const matches = file.match(BASE64_IMAGE_REGEX)
  const contentType = matches ? matches[1] : ''
  const mimeExtension = MIME_EXTENSIONS.find(m => m.mimeType === contentType)

  return mimeExtension ? mimeExtension.extension : ''
}

export const getFileContentTypeFromBase64 = (file: string): string => {
  const matches = file.match(BASE64_IMAGE_REGEX)
  const contentType = matches ? matches[1] : ''

  return contentType
}

export const generateFolderName = (): string => {
  const folderName = randomUUID()
  const destinationFolder = path.resolve(TMP_FOLDER_PATH, folderName)

  return destinationFolder
}

export const generateFileName = (): string => {
  const fileName = randomUUID()
  return fileName
}
