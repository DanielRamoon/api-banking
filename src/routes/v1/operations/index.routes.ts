import { Router } from 'express'

import { resolve } from '../../../middlewares/routes/ExpressRouteMiddleware'
import { OperationPolicy } from '../../../middlewares/policies/OperationPolicy'
import { OperationRepository } from '../../../repositories/prisma/OperationRepostitory'
import { ListOperationsService } from '../../../services/operations/ListOperationsService'
import { GetOperationService } from '../../../services/operations/GetOperationService'
import ListOperationsController from '../../../controllers/operations/ListOperationsController'
import GetOperationController from '../../../controllers/operations/GetOperationController'
import { PrismaRepositoryHelper } from '../../../repositories/prisma/PrismaRepositoryHelper'
import { Authorization } from '../../../middlewares/express/Authorization'

const operationPolicy = new OperationPolicy()
const operationRepository = new OperationRepository()

const listOperationsService = new ListOperationsService(operationRepository)
const getOperationService = new GetOperationService(operationRepository)

const listOperationsController = new ListOperationsController(
  listOperationsService
)
const getOperationController = new GetOperationController(getOperationService)

const prismaRepository = new PrismaRepositoryHelper()
const authorization = new Authorization(prismaRepository)

const authenticatedOperationRoutes = Router()
  .get(
    '/',
    authorization.authorize(),
    operationPolicy.canListOperations(),
    resolve(listOperationsController)
  )
  .get(
    '/:operation_id',
    authorization.authorize(),
    operationPolicy.canGetOperation(),
    resolve(getOperationController)
  )

export { authenticatedOperationRoutes }
