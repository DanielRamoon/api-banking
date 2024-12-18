/* eslint-disable prettier/prettier */
import { randomUUID } from 'node:crypto'
import { HTTPRequest } from '../../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  clientError,
  created,
  fail,
  notFound,
  unprocessable
} from '../../../adapters/http/HttpResponseAdapter'
import { t } from '../../../config/i18next/I18nextLocalization'
import ApplicationUser from '../../../entities/ApplicationUser'
import User, { UserProps } from '../../../entities/User'
import Wallet, { WalletProps } from '../../../entities/Wallet'
import { ApplicationError } from '../../../helpers/ApplicationError'
import ExternalTransferValidator from '../../../helpers/validators/zod/ExternalTransferValidator'
import { IWalletRepository } from '../../../repositories/IWalletRepository'
import { ApplicationService } from '../../../services/ApplicationService'

type CreatePaymentParams = {
  user: ApplicationUser
  company_id: string
  wallet_id: string
  amount: number
  description: string
  purpose_code: string
  bank_code: string
  routing_number: string
  routing_check_digit: string
  account_number: string
  account_check_digit: string
}

export default class CreateExternalTransferSendController implements HTTPRequest {
  private createExternalTransferSendService: ApplicationService
  private createOperationService: ApplicationService
  private walletRepository: IWalletRepository

  constructor(
    createExternalTransferSendService: ApplicationService,
    createOperationService: ApplicationService,
    walletRepository: IWalletRepository
  ) {
    this.createExternalTransferSendService = createExternalTransferSendService
    this.walletRepository = walletRepository
    this.createOperationService = createOperationService
  }

  async handle({
    user,
    company_id,
    wallet_id,
    amount,
    description,
    purpose_code,
    bank_code,
    routing_number,
    routing_check_digit,
    account_number,
    account_check_digit
  }: CreatePaymentParams): Promise<HttpResponse> {
    try {
      const _wallet = await this.walletRepository.find(
        wallet_id,
        user.id,
        company_id
      )

      if (_wallet instanceof ApplicationError) return notFound(_wallet)

      const wallet = new Wallet(_wallet as WalletProps).serializable_hash
      const _user = new User(user as UserProps).serializable_hash

      const paymentValidator = new ExternalTransferValidator(
        {
          user_id: _user.id,
          zoop_account_id: wallet.zoopAccountId,
          company_id,
          wallet_id,
          amount,
          description,
          purpose_code,
          bank_code,
          routing_number,
          routing_check_digit,
          account_check_digit,
          account_number: parseInt(account_number),
        }
      )

      const paymentValid = await paymentValidator.validate()

      if (!paymentValid) {
        const errors = await paymentValidator.errors()
        return clientError(errors)
      }

      const referenceId = randomUUID()

      const result = await this.createExternalTransferSendService.run({
        user: _user,
        wallet,
        amount,
        description,
        bankCode: bank_code,
        routingNumber: routing_number,
        routingCheckDigit: routing_check_digit,
        accountNumber: account_number,
        accountCheckDigit: account_check_digit,
        document: _user.holder?.cnpj || _user.holder?.taxpayerId,
        purposeCode: purpose_code,
        referenceId
      })

      if (result instanceof ApplicationError) {
        return unprocessable(
          new ApplicationError(
            t('error.provider.operation', { provider: 'zoop' })
          )
        )
      }

      const operation = this.createOperationService.run({
        user,
        wallet,
        operationParams: result,
        type: 'ted',
        referenceId
      })

      if (operation instanceof ApplicationError) return unprocessable(operation)

      return created(operation)
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
