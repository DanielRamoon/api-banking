/* eslint-disable max-len */
import { Router } from 'express'

import { resolve } from '../../../middlewares/routes/ExpressRouteMiddleware'
import AuthenticationController from '../../../controllers/AuthenticationController'
import AuthenticationService from '../../../services/AuthenticationService'
import { Authorization } from '../../../middlewares/express/Authorization'
import { UserPolicy } from '../../../middlewares/policies/UserPolicy'

import { UserRepository } from '../../../repositories/prisma/UserRepository'
import { CreateUserService } from '../../../services/users/CreateUserService'
import CreateUserController from '../../../controllers/users/CreateUserController'
import { HolderRepository } from '../../../repositories/prisma/HolderRepository'
import { ListUsersService } from '../../../services/users/ListUsersService'
import ListUsersController from '../../../controllers/users/ListUsersController'
import { UpdateUserService } from '../../../services/users/UpdateUserService'
import UpdateUserController from '../../../controllers/users/UpdateUserController'
import { BlockOrUnblockUserService } from '../../../services/users/BlockOrUnblockUserService'
import BlockOrUnblockUserController from '../../../controllers/users/BlockOrUnblockUserController'
import { PrismaRepositoryHelper } from '../../../repositories/prisma/PrismaRepositoryHelper'
import GetUserDataController from '../../../controllers/users/GetUserDataController'
import { CompleteRegistrationController } from '../../../controllers/users/CompleteRegistrationController'
import { AxiosAdapter } from '../../../adapters/http/axios/AxiosAdapter'
import { GetCNAEProvider } from '../../../adapters/providers/zoop/cnaes/GetCNAEProvider'
import { GetCBOProvider } from '../../../adapters/providers/zoop/cbos/GetCBOProvider'
import { SendHolderDocumentProvider } from '../../../adapters/providers/zoop/holders/SendHolderDocumentProvider'
import S3Storage from '../../../adapters/storage/aws/S3Storage'
import { UpdateHolderService } from '../../../services/holders/UpdateHolderService'
import { CreateSellerService } from '../../../services/zoop/seller/CreateSellerService'
import { CreateSellerIndividualProvider } from '../../../adapters/providers/zoop/sellers/CreateSellerIndividualProvider'
import { CreateSellerBusinessProvider } from '../../../adapters/providers/zoop/sellers/CreateSellerBusinessProvider'
import { CreateHolderService } from '../../../services/holders/CreateHolderService'
import { InviteSellerProvider } from '../../../adapters/providers/zoop/sellers/InviteSellerProvider'
import { SendFileToBucketService } from '../../../services/documents/SendFileToBucketService'
import { SendHolderDocumentsService } from '../../../services/holders/SendHolderDocumentsService'
import { HolderDocumentRepository } from '../../../repositories/prisma/HolderDocumentRepository'
import { CreateHolderDocumentService } from '../../../services/holder-documents/CreateHolderDocumentService'
import { RequestApprovalProvider } from '../../../adapters/providers/zoop/holders/RequestApprovalProvider'
import { CreateWalletProvider } from '../../../adapters/providers/zoop/wallets/CreateWalletProvider'
import { FindOrCreateSellerService } from '../../../services/zoop/seller/FindOrCreateSellerService'
import { FindSellerProvider } from '../../../adapters/providers/zoop/sellers/FindSellerProvider'
import { CreateOrUpdateHolderService } from '../../../services/holders/CreateOrUpdateHolderService'
import { WalletRepository } from '../../../repositories/prisma/WalletRepository'
import { CreateWalletService } from '../../../services/wallets/CreateWalletService'
import { GetUserDataService } from '../../../services/users/GetUserDataService'
import { WalletPolicy } from '../../../middlewares/policies/WalletPolicy'
import ListWalletsController from '../../../controllers/wallets/ListWalletsController'
import { ListWalletsService } from '../../../services/wallets/ListWalletsService'
import { GetWalletService } from '../../../services/wallets/GetWalletService'
import GetWalletController from '../../../controllers/wallets/GetWalletController'
import { OperationPolicy } from '../../../middlewares/policies/OperationPolicy'
import { OperationRepository } from '../../../repositories/prisma/OperationRepostitory'
import { ListOperationsService } from '../../../services/operations/ListOperationsService'
import { GetOperationService } from '../../../services/operations/GetOperationService'
import ListOperationsController from '../../../controllers/operations/ListOperationsController'
import GetOperationController from '../../../controllers/operations/GetOperationController'
import ConfirmationOfReceiptController from '../../../controllers/operations/ConfirmationOfReceiptController'
import { CreateP2PTransferProvider } from '../../../adapters/providers/zoop/operations/p2p/CreateP2PTransferProvider'
import { CreateP2PTransferService } from '../../../services/zoop/p2p/CreateP2PTransferService'
import { FindWalletProvider } from '../../../adapters/providers/zoop/wallets/FindWalletProvider'
import { GetWalletBalanceService } from '../../../services/zoop/wallets/GetWalletBalanceService'

const axiosAdapter = new AxiosAdapter()
const getCNAEProvider = new GetCNAEProvider(axiosAdapter)
const getCBOProvider = new GetCBOProvider(axiosAdapter)
const sendHolderDocumentProvider = new SendHolderDocumentProvider(axiosAdapter)
const findSellerProvider = new FindSellerProvider(axiosAdapter)
const createSellerIndividualProvider = new CreateSellerIndividualProvider(
  axiosAdapter
)
const createSellerBusinessProvider = new CreateSellerBusinessProvider(
  axiosAdapter
)
const inviteSellerProvider = new InviteSellerProvider(axiosAdapter)
const requestApprovalProvider = new RequestApprovalProvider(axiosAdapter)
const createWalletProvider = new CreateWalletProvider(axiosAdapter)
const createP2PTransferProvider = new CreateP2PTransferProvider(axiosAdapter)
const findWalletProvider = new FindWalletProvider(axiosAdapter)
const s3Storage = new S3Storage()

const userPolicy = new UserPolicy()
const walletPolicy = new WalletPolicy()
const operationPolicy = new OperationPolicy()
const userRepository = new UserRepository()
const holderRepository = new HolderRepository()
const holderDocumentRepository = new HolderDocumentRepository()
const walletRepository = new WalletRepository()
const operationRepository = new OperationRepository()

const authenticationService = new AuthenticationService(userRepository)
const createUserService = new CreateUserService(
  userRepository,
  holderRepository
)
const listUsersService = new ListUsersService(userRepository)
const updateUserService = new UpdateUserService(userRepository)
const blockorUnblockUserService = new BlockOrUnblockUserService(userRepository)
const createHolderService = new CreateHolderService(holderRepository)
const updateHolderService = new UpdateHolderService(holderRepository)
const createWalletService = new CreateWalletService(walletRepository)
const getUserDataService = new GetUserDataService(userRepository)
const getWalletBalanceService = new GetWalletBalanceService(findWalletProvider)
const createSellerService = new CreateSellerService(
  createSellerIndividualProvider,
  createSellerBusinessProvider
)
const findOrCreateSellerService = new FindOrCreateSellerService(
  findSellerProvider,
  createSellerService
)
const createOrUpdateHolderService = new CreateOrUpdateHolderService(
  holderRepository,
  updateHolderService,
  createHolderService
)

const authenticationController = new AuthenticationController(
  authenticationService
)
const createUserController = new CreateUserController(
  userRepository,
  createUserService
)
const listUsersController = new ListUsersController(listUsersService)
const updateUserController = new UpdateUserController(
  userRepository,
  updateUserService
)
const blockOrUnblockUserController = new BlockOrUnblockUserController(
  blockorUnblockUserService
)
const uploadDocumentsService = new SendFileToBucketService(s3Storage)
const createHolderDocumentService = new CreateHolderDocumentService(
  holderDocumentRepository
)
const sendHolderDocumentsService = new SendHolderDocumentsService(
  holderRepository,
  uploadDocumentsService,
  createHolderDocumentService,
  sendHolderDocumentProvider
)
const createP2PTransferService = new CreateP2PTransferService(
  createP2PTransferProvider
)
const listWalletsService = new ListWalletsService(walletRepository)
const getWalletService = new GetWalletService(walletRepository)
const listOperationsService = new ListOperationsService(operationRepository)
const getOperationService = new GetOperationService(operationRepository)

const completeRegisttrationController = new CompleteRegistrationController(
  holderRepository,
  userRepository,
  createOrUpdateHolderService,
  getCNAEProvider,
  getCBOProvider,
  findOrCreateSellerService,
  sendHolderDocumentsService,
  inviteSellerProvider,
  requestApprovalProvider,
  createWalletProvider,
  createWalletService
)
const getUserDataController = new GetUserDataController(getUserDataService)
const listWalletsController = new ListWalletsController(
  listWalletsService,
  getWalletBalanceService
)
const getWalletController = new GetWalletController(
  getWalletService,
  getWalletBalanceService
)
const listOperationsController = new ListOperationsController(
  listOperationsService
)
const getOperationController = new GetOperationController(getOperationService)
const confirmationOfReceiptController = new ConfirmationOfReceiptController(
  getUserDataService,
  getOperationService,
  createP2PTransferService
)

const prismaRepository = new PrismaRepositoryHelper()
const authorization = new Authorization(prismaRepository)

const unauthenticatedUserRoutes = Router().post(
  '/login',
  resolve(authenticationController)
)

const authenticatedUserRoutes = Router()
  .get(
    '/',
    authorization.authorize(),
    userPolicy.canListUser(),
    resolve(listUsersController)
  )
  .get(
    '/:id/wallets',
    authorization.authorize(),
    walletPolicy.canListWallets(),
    resolve(listWalletsController)
  )
  .get(
    '/:id/wallets/:wallet_id',
    authorization.authorize(),
    walletPolicy.canGettWallet(),
    resolve(getWalletController)
  )
  .get(
    '/:id/operations',
    authorization.authorize(),
    operationPolicy.canListOperations(),
    resolve(listOperationsController)
  )
  .get(
    '/:id/operations/:operation_id',
    authorization.authorize(),
    operationPolicy.canGetOperation(),
    resolve(getOperationController)
  )
  .post(
    '/:id/operations/:operation_id/confirmation-of-receipt',
    authorization.authorize(),
    operationPolicy.canConfirmReceipt(),
    resolve(confirmationOfReceiptController)
  )
  .get(
    '/:id',
    authorization.authorize(),
    userPolicy.canGetUserData(),
    resolve(getUserDataController)
  )
  .post(
    '/',
    authorization.authorize(),
    userPolicy.canCreateUser(),
    resolve(createUserController)
  )
  .put(
    '/:id',
    authorization.authorize(),
    userPolicy.canUpdateUser(),
    resolve(updateUserController)
  )
  .patch(
    '/:id',
    authorization.authorize(),
    userPolicy.canBlockOrUnblockUser(),
    resolve(blockOrUnblockUserController)
  )
  .post(
    '/:id/complete-registration',
    authorization.authorize(),
    userPolicy.canCompleteRegistration(),
    resolve(completeRegisttrationController)
  )

export { unauthenticatedUserRoutes, authenticatedUserRoutes }
