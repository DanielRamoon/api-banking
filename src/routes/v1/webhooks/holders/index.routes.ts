import { Router } from 'express'

import { resolve } from '../../../../middlewares/routes/ExpressRouteMiddleware'
import HoldersController from '../../../../controllers/webhooks/HoldersController'
import { WebhookAuthorization } from '../../../../middlewares/express/WebhookAuthorization'
import { HolderRepository } from '../../../../repositories/prisma/HolderRepository'
import { GetHolderService } from '../../../../services/holders/GetHolderService'
import { UpdateHolderService } from '../../../../services/holders/UpdateHolderService'

const holderRepository = new HolderRepository()

const getHolderService = new GetHolderService(holderRepository)
const updateHolderService = new UpdateHolderService(holderRepository)

const holdersController = new HoldersController(
  getHolderService,
  updateHolderService
)

const authorization = new WebhookAuthorization()

const holdersWebhooksRoutes = Router().post(
  '/holders',
  authorization.authorize(),
  resolve(holdersController)
)

export { holdersWebhooksRoutes }
