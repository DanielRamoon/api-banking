/* eslint-disable max-len */
import { Router } from 'express'

import { resolve } from '../../../middlewares/routes/ExpressRouteMiddleware'
import { HolderRepository } from '../../../repositories/prisma/HolderRepository'
import { Authorization } from '../../../middlewares/express/Authorization'
import { HolderPolicy } from '../../../middlewares/policies/HolderPolicy'
import { PrismaRepositoryHelper } from '../../../repositories/prisma/PrismaRepositoryHelper'
import { ListHoldersService } from '../../../services/holders/ListHoldersService'
import ListHoldersController from '../../../controllers/holders/ListHoldersController'
import { CreateHolderService } from '../../../services/holders/CreateHolderService'
import CreateHolderController from '../../../controllers/holders/CreateHolderController'
import { AxiosAdapter } from '../../../adapters/http/axios/AxiosAdapter'
import { GetCNAEProvider } from '../../../adapters/providers/zoop/cnaes/GetCNAEProvider'
import { GetCBOProvider } from '../../../adapters/providers/zoop/cbos/GetCBOProvider'
import { CreateHolderProvider } from '../../../adapters/providers/zoop/holders/CreateHolderProvider'
import { UpdateHolderService } from '../../../services/holders/UpdateHolderService'
import UpdateHolderController from '../../../controllers/holders/UpdateHolderController'
import { LinkUserService } from '../../../services/holders/LinkUserService'
import LinkUserController from '../../../controllers/holders/LinkUserController'
import { UnlinkUserService } from '../../../services/holders/UnlinkUserService'
import UnlinkUserController from '../../../controllers/holders/UnlinkUserController'
import SendHolderDocumentsController from '../../../controllers/holders/SendHolderDocumentsController'
import { HolderDocumentRepository } from '../../../repositories/prisma/HolderDocumentRepository'
import S3Storage from '../../../adapters/storage/aws/S3Storage'
import { SendFileToBucketService } from '../../../services/documents/SendFileToBucketService'
import { CreateHolderDocumentService } from '../../../services/holder-documents/CreateHolderDocumentService'
import { SendHolderDocumentProvider } from '../../../adapters/providers/zoop/holders/SendHolderDocumentProvider'
import { SendHolderDocumentsService } from '../../../services/holders/SendHolderDocumentsService'
import { GetHolderService } from '../../../services/holders/GetHolderService'
import GetHolderController from '../../../controllers/holders/GetHolderController'

const axiosAdapter = new AxiosAdapter()
const getCNAEProvider = new GetCNAEProvider(axiosAdapter)
const getCBOProvider = new GetCBOProvider(axiosAdapter)
const createHolderProvider = new CreateHolderProvider(axiosAdapter)
const sendHolderDocumentProvider = new SendHolderDocumentProvider(axiosAdapter)
const s3Storage = new S3Storage()

const holderPolicy = new HolderPolicy()
const holderRepository = new HolderRepository()
const holderDocumentRepository = new HolderDocumentRepository()

const listHoldersService = new ListHoldersService(holderRepository)
const createHolderService = new CreateHolderService(holderRepository)
const updateHolderService = new UpdateHolderService(holderRepository)
const linkUserService = new LinkUserService(holderRepository)
const unlinkUserService = new UnlinkUserService(holderRepository)
const uploadDocumentsService = new SendFileToBucketService(s3Storage)
const getHolderService = new GetHolderService(holderRepository)
const createHolderDocumentService = new CreateHolderDocumentService(
  holderDocumentRepository
)
const sendHolderDocumentsService = new SendHolderDocumentsService(
  holderRepository,
  uploadDocumentsService,
  createHolderDocumentService,
  sendHolderDocumentProvider
)

const listHoldersController = new ListHoldersController(listHoldersService)
const linkUserController = new LinkUserController(linkUserService)
const unlinkUserController = new UnlinkUserController(unlinkUserService)
const getHolderController = new GetHolderController(getHolderService)
const sendHolderDocumentsController = new SendHolderDocumentsController(
  sendHolderDocumentsService
)
const createHolderController = new CreateHolderController(
  holderRepository,
  createHolderService,
  updateHolderService,
  getCNAEProvider,
  getCBOProvider,
  createHolderProvider
)
const updateHolderController = new UpdateHolderController(
  holderRepository,
  updateHolderService,
  getCNAEProvider,
  getCBOProvider
)

const prismaRepository = new PrismaRepositoryHelper()
const authorization = new Authorization(prismaRepository)

const authenticatedHolderRoutes = Router()
  .get(
    '/',
    authorization.authorize(),
    holderPolicy.canListHolder(),
    resolve(listHoldersController)
  )
  .get(
    '/:id',
    authorization.authorize(),
    holderPolicy.canGetHolder(),
    resolve(getHolderController)
  )
  .post(
    '/',
    authorization.authorize(),
    holderPolicy.canCreateHolder(),
    resolve(createHolderController)
  )
  .put(
    '/:id',
    authorization.authorize(),
    holderPolicy.canUpdateHolder(),
    resolve(updateHolderController)
  )
  .patch(
    '/:id/link-user',
    authorization.authorize(),
    holderPolicy.canLinkUser(),
    resolve(linkUserController)
  )
  .patch(
    '/:id/unlink-user',
    authorization.authorize(),
    holderPolicy.canUnlinkUser(),
    resolve(unlinkUserController)
  )
  .post(
    '/:id/send-holder-documents',
    authorization.authorize(),
    holderPolicy.canSendHolderDocuments(),
    resolve(sendHolderDocumentsController)
  )

export { authenticatedHolderRoutes }
