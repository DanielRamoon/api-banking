import { CompanyDocumentProps } from '../../entities/CompanyDocument'
import { randomUUID } from 'crypto'

const mock: CompanyDocumentProps = {
  id: randomUUID(),
  resource: 'company_document',
  type: 'invoice',
  file: 'invoice.pdf',
  companyId: randomUUID(),
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-02')
}

export default mock
