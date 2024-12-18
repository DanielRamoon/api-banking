import { randomUUID } from 'crypto'
import { HTTPRequest } from '../../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  clientError,
  created,
  fail,
  notFound,
  unprocessable
} from '../../../adapters/http/HttpResponseAdapter'
import { ApplicationProvider } from '../../../adapters/providers/ApplicationProvider'
import { t } from '../../../config/i18next/I18nextLocalization'
import ApplicationUser from '../../../entities/ApplicationUser'
import Wallet, { WalletProps } from '../../../entities/Wallet'
import { ApplicationError } from '../../../helpers/ApplicationError'
import PaymentValidator from '../../../helpers/validators/zod/PaymentValidator'
import { IWalletRepository } from '../../../repositories/IWalletRepository'
import { ApplicationService } from '../../../services/ApplicationService'

type CreatePaymentParams = {
  user: ApplicationUser
  company_id: string
  wallet_id: string
  bar_code: string
  amount: number
  interest?: number
  discount?: number
}

export default class CreatePaymentController implements HTTPRequest {
  private createPaymentService: ApplicationService
  private createOperationService: ApplicationService
  private walletRepository: IWalletRepository
  private validateBarCodeProvider: ApplicationProvider

  constructor(
    createPaymentService: ApplicationService,
    createOperationService: ApplicationService,
    walletRepository: IWalletRepository,
    validateBarCodeProvider: ApplicationProvider
  ) {
    this.createPaymentService = createPaymentService
    this.walletRepository = walletRepository
    this.validateBarCodeProvider = validateBarCodeProvider
    this.createOperationService = createOperationService
  }

  async handle({
    user,
    company_id,
    wallet_id,
    bar_code,
    amount,
    interest,
    discount
  }: CreatePaymentParams): Promise<HttpResponse> {
    try {
      const _wallet = await this.walletRepository.find(
        wallet_id,
        user.id,
        company_id
      )

      if (_wallet instanceof ApplicationError) return notFound(_wallet)

      const wallet = new Wallet(_wallet as WalletProps).serializable_hash

      const paymentValidator = new PaymentValidator(
        {
          user_id: user.id,
          zoop_account_id: wallet.zoopAccountId,
          company_id,
          wallet_id,
          bar_code,
          amount,
          interest,
          discount
        },
        this.validateBarCodeProvider
      )

      const paymentValid = await paymentValidator.validate()

      if (!paymentValid) {
        const errors = await paymentValidator.errors()
        return clientError(errors)
      }

      const referenceId = randomUUID()

      const result = await this.createPaymentService.run({
        user,
        wallet,
        amount,
        interest,
        discount,
        referenceId,
        barCode: bar_code
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
        referenceId,
        operationParams: result
      })

      if (operation instanceof ApplicationError) return unprocessable(operation)

      return created(operation)
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
