/* eslint-disable max-len */
import { Router } from 'express'

import { resolve } from '../../../../middlewares/routes/ExpressRouteMiddleware'
import { Authorization } from '../../../../middlewares/express/Authorization'
import { CompanyUserPolicy } from '../../../../middlewares/policies/CompanyUserPolicy'
import { CompanyUserRepository } from '../../../../repositories/prisma/CompanyUserRepository'
import { CreateCompanyUserService } from '../../../../services/companies/company-users/CreateCompanyUserService'
import CreateCompanyUserController from '../../../../controllers/companies/company-users/CreateCompanyUserController'
import { ListCompanyUsersService } from '../../../../services/companies/company-users/ListCompanyUsersService'
import ListCompanyUsersController from '../../../../controllers/companies/company-users/ListCompanyUsersController'
import { UpdateCompanyUserService } from '../../../../services/companies/company-users/UpdateCompanyUserService'
import UpdateCompanyUserController from '../../../../controllers/companies/company-users/UpdateCompanyUserController'
import { DeleteCompanyUserService } from '../../../../services/companies/company-users/DeleteCompanyUserService'
import DeleteCompanyUserController from '../../../../controllers/companies/company-users/DeleteCompanyUserController'
import { PrismaRepositoryHelper } from '../../../../repositories/prisma/PrismaRepositoryHelper'
import { WalletPolicy } from '../../../../middlewares/policies/WalletPolicy'
import { ListWalletsService } from '../../../../services/wallets/ListWalletsService'
import { GetWalletService } from '../../../../services/wallets/GetWalletService'
import { ListOperationsService } from '../../../../services/operations/ListOperationsService'
import { GetOperationService } from '../../../../services/operations/GetOperationService'
import { WalletRepository } from '../../../../repositories/prisma/WalletRepository'
import { OperationRepository } from '../../../../repositories/prisma/OperationRepostitory'
import ListWalletsController from '../../../../controllers/wallets/ListWalletsController'
import GetWalletController from '../../../../controllers/wallets/GetWalletController'
import ListOperationsController from '../../../../controllers/operations/ListOperationsController'
import GetOperationController from '../../../../controllers/operations/GetOperationController'
import { OperationPolicy } from '../../../../middlewares/policies/OperationPolicy'
import GetCompanyUserController from '../../../../controllers/companies/company-users/GetCompanyUserController'
import { GetCompanyUserService } from '../../../../services/companies/company-users/GetCompanyUserService'
import { AxiosAdapter } from '../../../../adapters/http/axios/AxiosAdapter'
import { FindWalletProvider } from '../../../../adapters/providers/zoop/wallets/FindWalletProvider'
import { GetWalletBalanceService } from '../../../../services/zoop/wallets/GetWalletBalanceService'

const axiosAdapter = new AxiosAdapter()
const companyUserPolicy = new CompanyUserPolicy()
const walletPolicy = new WalletPolicy()
const operationPolicy = new OperationPolicy()
const companyUserRepository = new CompanyUserRepository()
const walletRepository = new WalletRepository()
const operationRepository = new OperationRepository()
const findWalletProvider = new FindWalletProvider(axiosAdapter)

const createCompanyUserService = new CreateCompanyUserService(
  companyUserRepository
)
const listCompanyUsersService = new ListCompanyUsersService(
  companyUserRepository
)
const updateCompanyUserService = new UpdateCompanyUserService(
  companyUserRepository
)
const deleteCompanyUserService = new DeleteCompanyUserService(
  companyUserRepository
)
const listWalletsService = new ListWalletsService(walletRepository)
const getWalletService = new GetWalletService(walletRepository)
const listOperationsService = new ListOperationsService(operationRepository)
const getOperationService = new GetOperationService(operationRepository)
const getCompanyUserService = new GetCompanyUserService(companyUserRepository)
const getWalletBalanceService = new GetWalletBalanceService(findWalletProvider)

const getCompanyUserController = new GetCompanyUserController(
  getCompanyUserService
)
const createCompanyUserController = new CreateCompanyUserController(
  companyUserRepository,
  createCompanyUserService
)
const listCompanyUsersController = new ListCompanyUsersController(
  listCompanyUsersService
)
const updateCompanyUserController = new UpdateCompanyUserController(
  companyUserRepository,
  updateCompanyUserService
)
const deleteCompanyUserController = new DeleteCompanyUserController(
  deleteCompanyUserService
)
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

const prismaRepository = new PrismaRepositoryHelper()
const authorization = new Authorization(prismaRepository)

const authenticatedCompanyUsersRoutes = Router()
  .get(
    '/:company_id/company-users',
    authorization.authorize(),
    companyUserPolicy.canListCompanyUser(),
    resolve(listCompanyUsersController)
  )
  .get(
    '/:company_id/company-users/:company_user_id',
    authorization.authorize(),
    companyUserPolicy.canGetCompanyUser(),
    resolve(getCompanyUserController)
  )
  .get(
    '/:company_id/company-users/:company_user_id/wallets',
    authorization.authorize(),
    walletPolicy.canListWallets(),
    resolve(listWalletsController)
  )
  .get(
    '/:company_id/company-users/:company_user_id/wallets/:wallet_id',
    authorization.authorize(),
    walletPolicy.canGettWallet(),
    resolve(getWalletController)
  )
  .get(
    '/:company_id/company-users/:company_user_id/operations',
    authorization.authorize(),
    operationPolicy.canListOperations(),
    resolve(listOperationsController)
  )
  .get(
    '/:company_id/company-users/:company_user_id/operations/:operation_id',
    authorization.authorize(),
    operationPolicy.canGetOperation(),
    resolve(getOperationController)
  )
  .post(
    '/:company_id/company-users',
    authorization.authorize(),
    companyUserPolicy.canCreateCompanyUser(),
    resolve(createCompanyUserController)
  )
  .put(
    '/:company_id/company-users/:company_user_id',
    authorization.authorize(),
    companyUserPolicy.canUpdateCompanyUser(),
    resolve(updateCompanyUserController)
  )
  .delete(
    '/:company_id/company-users/:company_user_id',
    authorization.authorize(),
    companyUserPolicy.canDeleteCompanyUser(),
    resolve(deleteCompanyUserController)
  )

export { authenticatedCompanyUsersRoutes }
