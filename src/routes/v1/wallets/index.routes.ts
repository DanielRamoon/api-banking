import { Router } from 'express'

import { resolve } from '../../../middlewares/routes/ExpressRouteMiddleware'
import { WalletPolicy } from '../../../middlewares/policies/WalletPolicy'
import { WalletRepository } from '../../../repositories/prisma/WalletRepository'
import { ListWalletsService } from '../../../services/wallets/ListWalletsService'
import ListWalletsController from '../../../controllers/wallets/ListWalletsController'
import { PrismaRepositoryHelper } from '../../../repositories/prisma/PrismaRepositoryHelper'
import { Authorization } from '../../../middlewares/express/Authorization'
import { GetWalletService } from '../../../services/wallets/GetWalletService'
import GetWalletController from '../../../controllers/wallets/GetWalletController'
import { FindWalletProvider } from '../../../adapters/providers/zoop/wallets/FindWalletProvider'
import { AxiosAdapter } from '../../../adapters/http/axios/AxiosAdapter'
import { GetWalletBalanceService } from '../../../services/zoop/wallets/GetWalletBalanceService'

const axiosAdapter = new AxiosAdapter()
const walletPolicy = new WalletPolicy()
const walletRepository = new WalletRepository()
const findWalletProvider = new FindWalletProvider(axiosAdapter)

const listWalletsService = new ListWalletsService(walletRepository)
const getWalletService = new GetWalletService(walletRepository)
const getWalletBalanceService = new GetWalletBalanceService(findWalletProvider)

const listWalletsController = new ListWalletsController(
  listWalletsService,
  getWalletBalanceService
)
const getWalletController = new GetWalletController(
  getWalletService,
  getWalletBalanceService
)

const prismaRepository = new PrismaRepositoryHelper()
const authorization = new Authorization(prismaRepository)

const authenticatedWalletRoutes = Router()
  .get(
    '/',
    authorization.authorize(),
    walletPolicy.canListWallets(),
    resolve(listWalletsController)
  )
  .get(
    '/:wallet_id',
    authorization.authorize(),
    walletPolicy.canGettWallet(),
    resolve(getWalletController)
  )

export { authenticatedWalletRoutes }
