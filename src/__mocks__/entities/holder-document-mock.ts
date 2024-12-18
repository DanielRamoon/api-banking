import {
  HolderDocumentProps,
  DocumentType
} from '../../entities/HolderDocument'
import { randomUUID } from 'crypto'

const mock: HolderDocumentProps = {
  id: randomUUID(),
  resource: 'holder_document',
  type: DocumentType.SELFIE,
  file: 'selfie.jpg',
  holderId: randomUUID(),
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-02')
}

export default mock
