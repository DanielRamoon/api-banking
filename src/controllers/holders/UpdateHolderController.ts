import { HTTPRequest } from '../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  clientError,
  ok,
  unprocessable
} from '../../adapters/http/HttpResponseAdapter'
import { ApplicationProvider } from '../../adapters/providers/ApplicationProvider'
import { t } from '../../config/i18next/I18nextLocalization'
import { AccountType, EstablishmentFormat } from '../../entities/Holder'
import { ApplicationError } from '../../helpers/ApplicationError'
import HolderValidator from '../../helpers/validators/zod/HolderValidator'
import { IHolderRepository } from '../../repositories/IHolderRepository'
import { ApplicationService } from '../../services/ApplicationService'

type UpdateHolderParams = {
  id: string
  taxpayer_id: string
  name: string
  email: string
  account_type: string
  cnae: string
  cnpj: string | undefined
  revenue_cents: number
  cbo: string | undefined
  rg: string | undefined
  pep: boolean | undefined
  mothers_name: string | undefined
  birthday: string | undefined
  legal_name: string | undefined
  establishment_format: string | undefined
  establishment_date: string | undefined
  phone_areacode: string | undefined
  phone_prefix: string | undefined
  phone_number: string | undefined
  address_street: string | undefined
  address_number: string | undefined
  address_city: string | undefined
  address_complement: string | undefined
  address_state: string | undefined
  address_neighborhood: string | undefined
  address_postalcode: string | undefined
  address_country: string | undefined
}

export default class UpdateHolderController implements HTTPRequest {
  private holderRepository: IHolderRepository
  private updateHolderService: ApplicationService
  private getCNAEProvider: ApplicationProvider
  private getCBOProvider: ApplicationProvider

  constructor(
    holderRepository: IHolderRepository,
    updateHolderService: ApplicationService,
    getCNAEProvider: ApplicationProvider,
    getCBOProvider: ApplicationProvider
  ) {
    this.holderRepository = holderRepository
    this.updateHolderService = updateHolderService
    this.getCNAEProvider = getCNAEProvider
    this.getCBOProvider = getCBOProvider
  }

  async handle({
    id,
    taxpayer_id,
    name,
    account_type,
    email,
    cnpj,
    revenue_cents,
    cbo,
    rg,
    pep,
    mothers_name,
    birthday,
    cnae,
    legal_name,
    establishment_format,
    establishment_date,
    phone_areacode,
    phone_prefix,
    phone_number,
    address_street,
    address_number,
    address_city,
    address_complement,
    address_state,
    address_neighborhood,
    address_postalcode,
    address_country
  }: UpdateHolderParams): Promise<HttpResponse> {
    try {
      const holderValidator = new HolderValidator(
        {
          id,
          name,
          email,
          cnae,
          taxpayerId: taxpayer_id,
          accountType: account_type as AccountType,
          cnpj: cnpj ? cnpj : undefined,
          cbo: cbo ? cbo : undefined,
          rg: rg ? rg : undefined,
          pep,
          birthday: birthday ? birthday : undefined,
          revenueCents: revenue_cents
            ? parseInt(`${revenue_cents}`)
            : undefined,
          mothersName: mothers_name ? mothers_name : undefined,
          legalName: legal_name ? legal_name : undefined,
          establishmentFormat: establishment_format
            ? (establishment_format as EstablishmentFormat)
            : undefined,
          establishmentDate: establishment_date
            ? establishment_date
            : undefined,
          phoneAreaCode: phone_areacode ? phone_areacode : undefined,
          phonePrefix: phone_prefix ? phone_prefix : undefined,
          phoneNumber: phone_number ? phone_number : undefined,
          addressStreet: address_street ? address_street : undefined,
          addressNumber: address_number ? address_number : undefined,
          addressCity: address_city ? address_city : undefined,
          addressComplement: address_complement
            ? address_complement
            : undefined,
          addressState: address_state ? address_state : undefined,
          addressNeighborhood: address_neighborhood
            ? address_neighborhood
            : undefined,
          addressPostalCode: address_postalcode
            ? address_postalcode
            : undefined,
          addressCountry: address_country ? address_country : undefined
        },
        this.holderRepository,
        this.getCNAEProvider,
        this.getCBOProvider
      )

      const holderValid = await holderValidator.validate()

      if (!holderValid) {
        const errors = await holderValidator.errors()
        return clientError(errors)
      }

      const updatedHolder = await this.updateHolderService.run({
        id,
        name,
        email,
        cnpj,
        cbo,
        rg,
        pep,
        cnae,
        birthday,
        taxpayerId: taxpayer_id,
        accountType: account_type as AccountType,
        revenueCents: parseInt(`${revenue_cents}`),
        mothersName: mothers_name,
        legalName: legal_name,
        establishmentFormat: establishment_format as EstablishmentFormat,
        establishmentDate: establishment_date,
        phoneAreaCode: phone_areacode,
        phonePrefix: phone_prefix,
        phoneNumber: phone_number,
        addressStreet: address_street,
        addressNumber: address_number,
        addressCity: address_city,
        addressComplement: address_complement,
        addressState: address_state,
        addressNeighborhood: address_neighborhood,
        addressPostalCode: address_postalcode,
        addressCountry: address_country
      })

      if (updatedHolder instanceof ApplicationError)
        return unprocessable(updatedHolder)

      return ok({
        holder: updatedHolder
      })
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
