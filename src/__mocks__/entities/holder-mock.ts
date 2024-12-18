import { ApplicationProvider } from '../../adapters/providers/ApplicationProvider'
import {
  HolderProps,
  EstablishmentFormat,
  AccountType
} from '../../entities/Holder'
import { randomUUID } from 'crypto'
import { ApplicationError } from '../../helpers/ApplicationError'
import { lightFormat } from 'date-fns'

const mock: HolderProps = {
  id: randomUUID(),
  resource: 'holder',
  zoopHolderId: randomUUID(),
  zoopAccountId: randomUUID(),
  taxpayerId: '258.264.940-69',
  name: 'John Doe',
  accountType: AccountType.individual,
  email: 'doe@example.com',
  cnpj: '87.887.939/0001-06',
  revenueCents: 100000,
  cbo: '766305',
  rg: '403214890',
  pep: false,
  mothersName: 'Mary Mother',
  birthday: lightFormat(new Date('1990-01-01'), 'yyyy-MM-dd'),
  cnae: '0112101',
  legalName: 'John Doe',
  establishmentFormat: EstablishmentFormat.MEI,
  establishmentDate: lightFormat(new Date('2000-01-01'), 'yyyy-MM-dd'),
  phoneAreaCode: '55',
  phonePrefix: '91',
  phoneNumber: '99999-9999',
  addressStreet: '123 Main St',
  addressNumber: '456',
  addressCity: 'City',
  addressComplement: 'Apt 789',
  addressState: 'State',
  addressNeighborhood: 'Neighborhood',
  addressPostalCode: '12345-678',
  addressCountry: 'Country',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-02')
}

type GetCBOProps = {
  cbo: string
}

type GetCNAEProps = {
  cnae: string
}
export class GetCBOProviderMock implements ApplicationProvider {
  async execute({ cbo }: GetCBOProps): Promise<object | ApplicationError> {
    return {
      withError: !!cbo
    }
  }
}

export class GetCNAEProviderMock implements ApplicationProvider {
  async execute({ cnae }: GetCNAEProps): Promise<object | ApplicationError> {
    return {
      withError: !!cnae
    }
  }
}

export default mock
