import { ApplicationError } from '../../../../helpers/ApplicationError'
import ApplicationHttpRequest, {
  ApplicationHttpRequestProps,
  AuthorizationType,
  Method
} from '../../../../helpers/ApplicationHttpRequest'
import { ApplicationProvider } from '../../ApplicationProvider'

type CreateSellerProps = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  taxpayerId: string
  cnpj: string
  birthdate: string
  legalName: string
  statementDescriptor: string
  addressCountry: string
  addressPostalCode: string
  addressCity: string
  addressState: string
  addressNeighborhood: string
  addressStreet: string
  addressNumber: string
  addressComplement: string
}

export class CreateSellerBusinessProvider implements ApplicationProvider {
  private applicationHttpRequest: ApplicationHttpRequest

  private ZOOP_V1_BASE_URL = process.env.ZOOP_V1_BASE_URL!
  private ZOOP_API_KEY = process.env.ZOOP_API_KEY

  constructor(applicationHttpRequest: ApplicationHttpRequest) {
    this.applicationHttpRequest = applicationHttpRequest
  }

  async execute({
    firstName,
    lastName,
    email,
    phoneNumber,
    taxpayerId,
    cnpj,
    birthdate,
    legalName,
    statementDescriptor,
    addressCountry,
    addressPostalCode,
    addressCity,
    addressState,
    addressNeighborhood,
    addressStreet,
    addressNumber,
    addressComplement
  }: CreateSellerProps): Promise<object | ApplicationError> {
    this.applicationHttpRequest.initialize(
      AuthorizationType.basic,
      this.ZOOP_V1_BASE_URL,
      this.ZOOP_API_KEY,
      ''
    )

    const _verb = Method.POST
    const _endpoint = `${this.applicationHttpRequest.getBaseURL()}/sellers/businesses`

    try {
      const _body = {
        owner: {
          first_name: firstName,
          last_name: lastName,
          taxpayer_id: taxpayerId,
          phone_number: phoneNumber,
          email,
          birthdate
        },
        owner_address: {
          line1: addressStreet,
          line2: addressNumber,
          line3: addressComplement,
          neighborhood: addressNeighborhood,
          city: addressCity,
          state: addressState,
          postal_code: addressPostalCode,
          country_code: addressCountry ?? 'BR'
        },
        business_description: statementDescriptor,
        business_name: legalName,
        business_phone: phoneNumber,
        business_email: email,
        statement_descriptor: legalName,
        ein: cnpj,
        business_address: {
          line1: addressStreet,
          line2: addressNumber,
          line3: addressComplement,
          neighborhood: addressNeighborhood,
          city: addressCity,
          state: addressState,
          postal_code: addressPostalCode,
          country_code: addressCountry ?? 'BR'
        }
      }

      const result = (await this.applicationHttpRequest.fetch(
        _verb,
        _endpoint,
        _body
      )) as ApplicationHttpRequestProps

      return result
    } catch (e) {
      const { data } = e as ApplicationHttpRequestProps

      const _fields = data?.error?.fields
      const _message = data?.error?.message

      const error = {
        message: _message,
        fields: _fields
      }

      return new ApplicationError(JSON.stringify(error))
    }
  }
}
