/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { prisma } from '../../config/database/prisma'
import { t } from '../../config/i18next/I18nextLocalization'
import HolderDocument, {
  HolderDocumentProps
} from '../../entities/HolderDocument'
import { ApplicationError } from '../../helpers/ApplicationError'
import ApplicationHelper from '../../helpers/ApplicationHelper'
import { IHolderDocumentRepository } from '../IHolderDocumentRepository'

export class HolderDocumentRepository implements IHolderDocumentRepository {
  async create({
    holderId,
    type,
    file
  }: HolderDocumentProps): Promise<HolderDocument | ApplicationError> {
    try {
      const holderDocumentPrisma = await prisma.holderDocument.create({
        data: {
          holder_id: holderId,
          type,
          file
        }
      })

      const holderDocument = ApplicationHelper.snakeToCamel(
        holderDocumentPrisma
      ) as HolderDocumentProps

      return new HolderDocument(holderDocument)
    } catch (error) {
      const _message =
        error instanceof ApplicationError
          ? error.message
          : t('error.creating', { resource: 'holder_document' })
      return new ApplicationError(_message)
    }
  }

  list(params: object): Promise<ApplicationError | object[]> {
    throw new Error('Method not implemented.')
  }
  update(id: string, params: object): Promise<object | ApplicationError> {
    throw new Error('Method not implemented.')
  }
  delete(id: string): Promise<void | ApplicationError> {
    throw new Error('Method not implemented.')
  }
  find(id: string): Promise<object | ApplicationError> {
    throw new Error('Method not implemented.')
  }
  findUser(type: string, email: string): Promise<object | ApplicationError> {
    throw new Error('Method not implemented.')
  }
  updatePassword(
    email: string,
    password: string
  ): Promise<object | ApplicationError> {
    throw new Error('Method not implemented.')
  }
  emailExists(email: string, id?: string | undefined): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  count(): Promise<number | ApplicationError> {
    throw new Error('Method not implemented.')
  }
}
