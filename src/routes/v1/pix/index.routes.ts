/* eslint-disable max-len */
import { Router } from 'express'

import { resolve } from '../../../middlewares/routes/ExpressRouteMiddleware'
import { PixPolicy } from '../../../middlewares/policies/PixPolicy'
import { AxiosAdapter } from '../../../adapters/http/axios/AxiosAdapter'
import { ListPixKeysProvider } from '../../../adapters/providers/zoop/operations/pix/ListPixKeysProvider'
import { WalletRepository } from '../../../repositories/prisma/WalletRepository'
import { ListPixKeysService } from '../../../services/zoop/pix/ListPixKeysService'
import ListPixKeysController from '../../../controllers/operations/pix/ListPixKeysController'
import { PrismaRepositoryHelper } from '../../../repositories/prisma/PrismaRepositoryHelper'
import { Authorization } from '../../../middlewares/express/Authorization'
import { CreatePixKeyProvider } from '../../../adapters/providers/zoop/operations/pix/CreatePixKeyProvider'
import { CreatePixKeyService } from '../../../services/zoop/pix/CreatePixKeyService'
import CreatePixKeyController from '../../../controllers/operations/pix/CreatePixKeyController'
import { GetPixByKeyProvider } from '../../../adapters/providers/zoop/operations/pix/GetPixByKeyProvider'
import { GetPixByKeyService } from '../../../services/zoop/pix/GetPixByKeyService'
import GetPixByKeyController from '../../../controllers/operations/pix/GetPixByKeyController'
import { LoginProvider } from '../../../adapters/providers/zoop/two-factor-authentication/authentication/LoginProvider'

const axiosAdapter = new AxiosAdapter()
const listPixKeysProvider = new ListPixKeysProvider(axiosAdapter)
const getPixByKeyProvider = new GetPixByKeyProvider(axiosAdapter)
const createPixKeyProvider = new CreatePixKeyProvider(axiosAdapter)
const loginProvider = new LoginProvider(axiosAdapter)

const pixPolicy = new PixPolicy()
const walletRepository = new WalletRepository()

const listPixKeysService = new ListPixKeysService(
  walletRepository,
  listPixKeysProvider,
  loginProvider
)
const createPixKeyService = new CreatePixKeyService(createPixKeyProvider)
const getPixByKeyService = new GetPixByKeyService(
  walletRepository,
  getPixByKeyProvider
)

const listPixKeysController = new ListPixKeysController(listPixKeysService)
const createPixKeyController = new CreatePixKeyController(
  createPixKeyService,
  walletRepository
)
const getPixByKeyController = new GetPixByKeyController(getPixByKeyService)

const prismaRepository = new PrismaRepositoryHelper()
const authorization = new Authorization(prismaRepository)

const authenticatedPixRoutes = Router()
  .get(
    '/:wallet_id/keys',
    authorization.authorize(),
    pixPolicy.canListPixKeys(),
    resolve(listPixKeysController)
  )
  .get(
    '/:wallet_id/keys/:value',
    authorization.authorize(),
    pixPolicy.canGetPixByKey(),
    resolve(getPixByKeyController)
  )
  .post(
    '/:wallet_id/keys',
    authorization.authorize(),
    pixPolicy.canCreatePixKey(),
    resolve(createPixKeyController)
  )

export { authenticatedPixRoutes }
