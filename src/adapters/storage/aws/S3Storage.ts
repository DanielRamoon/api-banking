import {
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { readFileSync, readdirSync } from 'node:fs'

import { ApplicationError } from '../../../helpers/ApplicationError'
import { t } from '../../../config/i18next/I18nextLocalization'
import { ApplicationStorage, UploadedFilesType } from '../ApplicationStorage'

export default class S3Storage implements ApplicationStorage {
  private client: S3Client

  private AWS_REGION = process.env.AWS_REGION!
  private AWS_BUCKET = process.env.AWS_BUCKET_NAME!

  constructor() {
    this.client = new S3Client({
      region: this.AWS_REGION
    })
  }

  async uploadFile(
    folderPath: string,
    fileName: string
  ): Promise<object | ApplicationError> {
    try {
      const filePath = `${folderPath}/${fileName}`
      const fileContent = readFileSync(filePath)

      const response = await this.client.send(
        new PutObjectCommand({
          Bucket: this.AWS_BUCKET,
          Body: fileContent,
          Key: fileName
        })
      )

      return response
    } catch (error) {
      const _message =
        error instanceof ApplicationError
          ? error.message
          : t('error.file.upload')
      return new ApplicationError(_message)
    }
  }

  async uploadFiles(
    folderPath: string
  ): Promise<UploadedFilesType | ApplicationError> {
    const keys = readdirSync(folderPath)
    const files = keys.map(key => {
      const filePath = `${folderPath}/${key}`
      const fileContent = readFileSync(filePath)
      return {
        Key: key,
        Body: fileContent
      }
    })

    const errors = []
    const uploadedFiles = []
    for (const file of files) {
      try {
        const response = await this.client.send(
          new PutObjectCommand({
            Bucket: this.AWS_BUCKET,
            Body: file.Body,
            Key: file.Key
          })
        )

        uploadedFiles.push(response)
      } catch (error) {
        errors.push(error)
      }
    }

    return {
      uploadedFiles,
      errors
    }
  }

  async list(): Promise<object | ApplicationError> {
    const command = new ListObjectsV2Command({
      Bucket: this.AWS_BUCKET,
      MaxKeys: 10
    })
    try {
      let isTruncated = true
      const contents = []

      while (isTruncated) {
        const { Contents, IsTruncated, NextContinuationToken } =
          await this.client.send(command)
        const contentsList = Contents?.map(c => c.Key)

        contents.push(contentsList)
        isTruncated = !!IsTruncated
        command.input.ContinuationToken = NextContinuationToken
      }

      return contents
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }
}
