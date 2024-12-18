/* eslint-disable max-len */
import { Router } from 'express'

import { resolve } from '../../../middlewares/routes/ExpressRouteMiddleware'
import { PaymentPolicy } from '../../../middlewares/policies/PaymentPolicy'
import { WalletRepository } from '../../../repositories/prisma/WalletRepository'
import { CreatePaymentService } from '../../../services/zoop/payments/CreatePaymentService'
import { CreatePaymentProvider } from '../../../adapters/providers/zoop/operations/payments/CreatePaymentProvider'
import { GetPaymentDatailsProvider } from '../../../adapters/providers/zoop/operations/payments/GetPaymentDatailsProvider'
import { AxiosAdapter } from '../../../adapters/http/axios/AxiosAdapter'
import CreatePaymentController from '../../../controllers/operations/payments/CreatePaymentController'
import { PrismaRepositoryHelper } from '../../../repositories/prisma/PrismaRepositoryHelper'
import { Authorization } from '../../../middlewares/express/Authorization'
import { ValidateBarCodeProvider } from '../../../adapters/providers/zoop/operations/payments/ValidateBarCodeProvider'
import { CreateOperationService } from '../../../services/operations/CreateOperationService'
import { GetPaymentDatailsService } from '../../../services/zoop/payments/GetPaymentDatailsService'
import { OperationRepository } from '../../../repositories/prisma/OperationRepostitory'
import GetPaymentDetailsController from '../../../controllers/operations/payments/GetPaymentDetailsController'
import { CreateExternalTransferSendProvider } from '../../../adapters/providers/zoop/operations/ted/CreateExternalTransferSendProvider'
import { CreateExternalTransferSendService } from '../../../services/zoop/ted/CreateExternalTransferSendService'
import CreateExternalTransferSendController from '../../../controllers/operations/ted/CreateExternalTransferSendController'

const axiosAdapter = new AxiosAdapter()
const createPaymentProvider = new CreatePaymentProvider(axiosAdapter)
const validateBarCodeProvider = new ValidateBarCodeProvider(axiosAdapter)
const getPaymentDetailsProvider = new GetPaymentDatailsProvider(axiosAdapter)
const createExternalTransferSendProvider =
  new CreateExternalTransferSendProvider(axiosAdapter)

const paymentPolicy = new PaymentPolicy()
const walletRepository = new WalletRepository()
const operationRepository = new OperationRepository()

const createPaymentService = new CreatePaymentService(createPaymentProvider)
const createOperationService = new CreateOperationService(operationRepository)
const getPaymentDetailsService = new GetPaymentDatailsService(
  walletRepository,
  getPaymentDetailsProvider
)
const createExternalTransferSendService = new CreateExternalTransferSendService(
  createExternalTransferSendProvider
)

const createPaymentController = new CreatePaymentController(
  createPaymentService,
  createOperationService,
  walletRepository,
  validateBarCodeProvider
)
const getPaymentDetailsController = new GetPaymentDetailsController(
  getPaymentDetailsService
)
const createExternalTransferSendController =
  new CreateExternalTransferSendController(
    createExternalTransferSendService,
    createOperationService,
    walletRepository
  )

const prismaRepository = new PrismaRepositoryHelper()
const authorization = new Authorization(prismaRepository)

const authenticatedPaymentRoutes = Router()
  .post(
    '/:wallet_id',
    authorization.authorize(),
    paymentPolicy.canCreatePayment(),
    resolve(createPaymentController)
  )
  .get(
    '/:wallet_id/validations/bar_code/:bar_code',
    authorization.authorize(),
    paymentPolicy.canGetPaymentDetails(),
    resolve(getPaymentDetailsController)
  )
  .post(
    '/:wallet_id/external-transfer-send',
    authorization.authorize(),
    paymentPolicy.canCreateExternalTransfer(),
    resolve(createExternalTransferSendController)
  )

export { authenticatedPaymentRoutes }
