import { ApplicationError } from '../../../../helpers/ApplicationError'
import ApplicationHttpRequest, {
  ApplicationHttpRequestProps,
  AuthorizationType,
  Method
} from '../../../../helpers/ApplicationHttpRequest'
import { ApplicationProvider } from '../../ApplicationProvider'

type CreateHolderProps = {
  holderId: string
  accountType: string
  name: string
  email: string
  taxpayerId: string
  revenueCents: number
  cnae: string
  legalName: string
  establishmentFormat: string
  establishmentDate: string
  birthday: string
  rg: string
  cbo: string
  pep: boolean
  mothersName: string
}

export class InviteSellerProvider implements ApplicationProvider {
  private applicationHttpRequest: ApplicationHttpRequest

  private ZOOP_BANKING_BASE_URL = process.env.ZOOP_BANKING_BASE_URL!
  private ZOOP_API_KEY = process.env.ZOOP_API_KEY

  constructor(applicationHttpRequest: ApplicationHttpRequest) {
    this.applicationHttpRequest = applicationHttpRequest
  }

  async execute({
    holderId,
    accountType,
    name,
    email,
    taxpayerId,
    revenueCents,
    cnae,
    legalName,
    establishmentFormat,
    establishmentDate,
    birthday,
    rg,
    cbo,
    pep,
    mothersName
  }: CreateHolderProps): Promise<
    ApplicationHttpRequestProps | ApplicationError
  > {
    this.applicationHttpRequest.initialize(
      AuthorizationType.basic,
      this.ZOOP_BANKING_BASE_URL,
      this.ZOOP_API_KEY,
      ''
    )

    const _verb = Method.POST
    const _endpoint = `${this.applicationHttpRequest.getBaseURL()}/holders/${holderId}`

    try {
      const _body = this.holderParams({
        holderId,
        accountType,
        name,
        email,
        taxpayerId,
        revenueCents,
        cnae,
        legalName,
        establishmentFormat,
        establishmentDate,
        birthday,
        rg,
        cbo,
        pep,
        mothersName
      })

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

  private holderParams(params: CreateHolderProps): object {
    const {
      accountType,
      name,
      email,
      taxpayerId,
      revenueCents,
      cnae,
      legalName,
      establishmentFormat,
      establishmentDate,
      birthday,
      rg,
      cbo,
      pep,
      mothersName
    } = params

    if (accountType === 'business') {
      return {
        type: accountType,
        national_registration: taxpayerId,
        revenue: revenueCents,
        legal_name: legalName,
        name,
        email,
        cnae,
        establishment: {
          format: establishmentFormat,
          date: establishmentDate
        }
      }
    } else {
      return {
        type: accountType,
        national_registration: taxpayerId,
        revenue: revenueCents,
        mothers_name: mothersName,
        name,
        email,
        cbo,
        pep,
        rg,
        birthday
      }
    }
  }
}
