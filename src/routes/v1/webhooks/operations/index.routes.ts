/* eslint-disable max-len */
import { Router } from 'express'

import { resolve } from '../../../../middlewares/routes/ExpressRouteMiddleware'
import { WebhookAuthorization } from '../../../../middlewares/express/WebhookAuthorization'
import { HolderRepository } from '../../../../repositories/prisma/HolderRepository'
import { GetHolderService } from '../../../../services/holders/GetHolderService'
import OperationsController from '../../../../controllers/webhooks/OperationsController'
import { GetWalletService } from '../../../../services/wallets/GetWalletService'
import { WalletRepository } from '../../../../repositories/prisma/WalletRepository'
import { OperationRepository } from '../../../../repositories/prisma/OperationRepostitory'
import { GetOperationService } from '../../../../services/operations/GetOperationService'
import { AxiosAdapter } from '../../../../adapters/http/axios/AxiosAdapter'
import { CreateP2PTransferProvider } from '../../../../adapters/providers/zoop/operations/p2p/CreateP2PTransferProvider'
import { CreateP2PTransferService } from '../../../../services/zoop/p2p/CreateP2PTransferService'

const axiosAdapter = new AxiosAdapter()
const createP2PTransferProvider = new CreateP2PTransferProvider(axiosAdapter)

const holderRepository = new HolderRepository()
const walletRepository = new WalletRepository()
const operationRepository = new OperationRepository()

const getHolderService = new GetHolderService(holderRepository)
const getWalletService = new GetWalletService(walletRepository)
const getOperationService = new GetOperationService(operationRepository)
const createP2PTransferService = new CreateP2PTransferService(
  createP2PTransferProvider
)

const operationController = new OperationsController(
  getHolderService,
  getWalletService,
  holderRepository,
  getOperationService,
  createP2PTransferService
)

const authorization = new WebhookAuthorization()

const operationsWebhooksRoutes = Router().post(
  '/operations',
  authorization.authorize(),
  resolve(operationController)
)

export { operationsWebhooksRoutes }
