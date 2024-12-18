import { HolderTypes } from '../../@types/zoop/HolderTypes'
import { SellerTypes } from '../../@types/zoop/SellerTypes'
import { WalletTypes } from '../../@types/zoop/WalletTypes'
import { HTTPRequest } from '../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  clientError,
  fail,
  notFound,
  ok,
  unprocessable
} from '../../adapters/http/HttpResponseAdapter'
import { ApplicationProvider } from '../../adapters/providers/ApplicationProvider'
import { t } from '../../config/i18next/I18nextLocalization'
import Holder, { AccountType, EstablishmentFormat } from '../../entities/Holder'
import { DocumentType } from '../../entities/HolderDocument'
import User, { UserProps } from '../../entities/User'
import { ApplicationError } from '../../helpers/ApplicationError'
import HolderValidator from '../../helpers/validators/zod/HolderValidator'
import { IHolderRepository } from '../../repositories/IHolderRepository'
import { IUserRepository } from '../../repositories/IUserRepository'
import { ApplicationService } from '../../services/ApplicationService'

type HolderDocumentsProps = [
  {
    type: DocumentType
    file: string
  }
]

type HolderDocumentsServiceProps = {
  withErrors: boolean
  sentFile: [] | object
  errors: [] | object
}

type CompleteRegistrationParams = {
  id: string
  taxpayer_id: string
  name: string
  email: string
  cnae: string
  cnpj: string
  revenue_cents: number
  cbo: string
  rg: string
  pep: boolean
  mothers_name: string
  birthday: string
  legal_name: string
  establishment_format: EstablishmentFormat
  establishment_date: string
  phone_areacode: string
  phone_prefix: string
  phone_number: string
  address_street: string
  address_number: string
  address_city: string
  address_complement: string
  address_state: string
  address_neighborhood: string
  address_postalcode: string
  address_country: string
  holder_documents: HolderDocumentsProps
}

export class CompleteRegistrationController implements HTTPRequest {
  private holderRepository: IHolderRepository
  private userRepository: IUserRepository
  private createOrUpdateHolderService: ApplicationService
  private getCNAEProvider: ApplicationProvider
  private getCBOProvider: ApplicationProvider
  private findOrCreateSellerService: ApplicationService
  private sendHolderDocumentsService: ApplicationService
  private inviteSellerProvider: ApplicationProvider
  private requestApprovalProvider: ApplicationProvider
  private createWalletProvider: ApplicationProvider
  private createWalletService: ApplicationService

  constructor(
    holderRepository: IHolderRepository,
    userRepository: IUserRepository,
    createOrUpdateHolderService: ApplicationService,
    getCNAEProvider: ApplicationProvider,
    getCBOProvider: ApplicationProvider,
    findOrCreateSellerService: ApplicationService,
    sendHolderDocumentsService: ApplicationService,
    inviteSellerProvider: ApplicationProvider,
    requestApprovalProvider: ApplicationProvider,
    createWalletProvider: ApplicationProvider,
    createWalletService: ApplicationService
  ) {
    this.holderRepository = holderRepository
    this.userRepository = userRepository
    this.createOrUpdateHolderService = createOrUpdateHolderService
    this.getCNAEProvider = getCNAEProvider
    this.getCBOProvider = getCBOProvider
    this.findOrCreateSellerService = findOrCreateSellerService
    this.sendHolderDocumentsService = sendHolderDocumentsService
    this.inviteSellerProvider = inviteSellerProvider
    this.requestApprovalProvider = requestApprovalProvider
    this.createWalletProvider = createWalletProvider
    this.createWalletService = createWalletService
  }

  async handle({
    id,
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
    address_country,
    holder_documents
  }: CompleteRegistrationParams): Promise<HttpResponse> {
    try {
      const findOrError = await this.userRepository.find(id)
      if (findOrError instanceof ApplicationError) return notFound(findOrError)

      if (!holder_documents || holder_documents.length <= 0)
        return unprocessable(new ApplicationError(t('error.file.required')))

      const user = new User(findOrError as UserProps).serializable_hash

      const phoneAreaCode = phone_areacode || '55'
      const addressCountry = address_country || 'BR'
      const accountType = user.cnpj
        ? AccountType.business
        : AccountType.individual

      let holderId = undefined
      const existingHolder =
        await this.holderRepository.findByCNPJAndTaxpayerId(
          user.taxpayerId,
          user.cnpj
        )

      if (!(existingHolder instanceof ApplicationError)) {
        if (existingHolder) holderId = existingHolder.id
      }

      const holderValidator = new HolderValidator(
        {
          id: holderId,
          rg,
          accountType,
          name: user.name,
          email: user.email,
          taxpayerId: user.taxpayerId,
          cnpj: accountType === AccountType.business ? user.cnpj : undefined,
          cnae: accountType === AccountType.business ? cnae : undefined,
          cbo: accountType === AccountType.individual ? cbo : undefined,
          pep: !!pep,
          birthday: birthday,
          revenueCents: revenue_cents
            ? parseInt(`${revenue_cents}`)
            : undefined,
          mothersName: mothers_name ?? undefined,
          legalName: legal_name,
          establishmentFormat: establishment_format as EstablishmentFormat,
          establishmentDate: establishment_date,
          phoneAreaCode,
          phonePrefix: phone_prefix,
          phoneNumber: phone_number,
          addressStreet: address_street,
          addressNumber: address_number,
          addressCity: address_city,
          addressComplement: address_complement
            ? address_complement
            : undefined,
          addressState: address_state,
          addressNeighborhood: address_neighborhood,
          addressPostalCode: address_postalcode,
          addressCountry
        },
        this.holderRepository,
        this.getCNAEProvider,
        this.getCBOProvider,
        !holderId
      )

      const holderValid = await holderValidator.validate()

      if (!holderValid) {
        const errors = await holderValidator.errors()
        return clientError(errors)
      }

      rg = rg?.replace(/\D+/g, '')
      phone_prefix = phone_prefix?.replace(/\D+/g, '')
      phone_number = phone_number?.replace(/\D+/g, '')

      const createOrUpdateHolder = await this.createOrUpdateHolderService.run({
        id: holderId,
        name: user.name,
        email: user.email,
        cnpj: user.cnpj,
        taxpayerId: user.taxpayerId,
        revenueCents: revenue_cents ? parseInt(`${revenue_cents}`) : 0,
        mothersName: mothers_name,
        legalName: legal_name,
        establishmentFormat: establishment_format,
        establishmentDate: establishment_date,
        phoneAreaCode,
        phonePrefix: phone_prefix,
        phoneNumber: phone_number,
        addressStreet: address_street,
        addressNumber: address_number,
        addressCity: address_city,
        addressComplement: address_complement,
        addressState: address_state,
        addressNeighborhood: address_neighborhood,
        addressPostalCode: address_postalcode,
        cbo,
        rg,
        pep,
        cnae,
        birthday,
        accountType,
        addressCountry
      })

      if (createOrUpdateHolder instanceof ApplicationError)
        return unprocessable(createOrUpdateHolder)

      let holder = createOrUpdateHolder as Holder

      const errors = []

      const nameArray = holder.name.split(/\s/)
      const firstName = nameArray.shift()
      const lastName = nameArray.pop()

      const sellerProvider = await this.findOrCreateSellerService.run({
        firstName,
        lastName,
        accountType: holder.accountType,
        email: holder.email,
        phoneNumber: holder.phoneNumber,
        taxpayerId: holder.taxpayerId,
        cnpj: holder.cnpj,
        birthdate: holder.birthday,
        legalName: holder.legalName,
        statementDescriptor: firstName,
        addressCountry: holder.addressCountry,
        addressPostalCode: holder.addressPostalCode,
        addressCity: holder.addressCity,
        addressState: holder.addressState,
        addressNeighborhood: holder.addressNeighborhood,
        addressStreet: holder.addressStreet,
        addressNumber: holder.addressNumber,
        addressComplement: holder.addressComplement
      })

      if (sellerProvider instanceof ApplicationError) {
        const _sellerProviderError = JSON.parse(sellerProvider.message)
        const error = {
          seller: _sellerProviderError
        }

        return unprocessable(error)
      }

      const zoopSellerId = (sellerProvider as SellerTypes).data.id

      const holderProvider = await this.inviteSellerProvider.execute({
        holderId: zoopSellerId,
        accountType: holder.accountType,
        name: holder.name,
        email: holder.email,
        taxpayerId: holder.taxpayerId,
        revenueCents: holder.revenueCents,
        cnae: holder.cnae,
        legalName: holder.legalName,
        establishmentFormat: holder.establishmentFormat,
        establishmentDate: holder.establishmentDate,
        birthday: holder.birthday,
        rg: holder.rg,
        cbo: holder.cbo,
        pep: holder.pep,
        mothersName: holder.mothersName
      })

      if (holderProvider instanceof ApplicationError) {
        const _holderProviderError = JSON.parse(holderProvider.message)
        const error = {
          holder: _holderProviderError
        }

        return unprocessable(error)
      }

      if (holderProvider.withError)
        return unprocessable(
          new ApplicationError(
            holderProvider.data?.error?.message ||
              t('error.provider.holder', { provider: 'zoop' })
          )
        )

      holder = (await this.createOrUpdateHolderService.run({
        ...holder,
        zoopHolderId: (holderProvider as HolderTypes).data.id
      })) as Holder

      const holderDocuments = await this.sendHolderDocumentsService.run({
        holderId: holder.id,
        holderDocuments: holder_documents
      })

      if (holderDocuments instanceof ApplicationError)
        return unprocessable(holderDocuments)

      const requestApproval = await this.requestApprovalProvider.execute({
        holderId: (holderProvider as HolderTypes).data.id
      })

      if (
        requestApproval instanceof ApplicationError ||
        (requestApproval.withError && requestApproval.status != 412)
      ) {
        errors.push((requestApproval as ApplicationError).message)
      }

      const mainAccount = await this.createWalletProvider.execute({
        holderId: (holderProvider as HolderTypes).data.id,
        primary: true
      })

      let mainAccountId = null
      if (mainAccount instanceof ApplicationError || mainAccount.withError) {
        errors.push((mainAccount as ApplicationError).message)
      } else {
        mainAccountId = (mainAccount as WalletTypes).data.id
      }

      const secondaryAccount = await this.createWalletProvider.execute({
        holderId: (holderProvider as HolderTypes).data.id,
        primary: false
      })

      if (
        secondaryAccount instanceof ApplicationError ||
        secondaryAccount.withError
      ) {
        errors.push((secondaryAccount as ApplicationError).message)
      } else {
        await this.createWalletService.run({
          userId: user.id,
          zoopAccountId: (secondaryAccount as WalletTypes).data.id
        })
      }

      const updatedHolder = await this.createOrUpdateHolderService.run({
        ...holder,
        zoopHolderStatus: (holderProvider as HolderTypes).data.status,
        zoopAccountId: mainAccountId,
        zoopSellerId
      })

      const withErrors =
        errors.length > 0 ||
        (holderDocuments as HolderDocumentsServiceProps).withErrors

      return ok({
        withErrors,
        holder: updatedHolder,
        providerErrors: errors,
        holderDocuments
      })
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
