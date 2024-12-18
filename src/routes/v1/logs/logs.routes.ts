import { Router } from 'express'

import { resolve } from '../../../middlewares/routes/ExpressRouteMiddleware'
import { AdminPolicy } from '../../../middlewares/policies/AdminPolicy'
import { LogRepository } from '../../../repositories/prisma/LogRepository'
import { ListLogsService } from '../../../services/logs/ListLogsService'
import ListLogsController from '../../../controllers/logs/ListLogsController'
import { PrismaRepositoryHelper } from '../../../repositories/prisma/PrismaRepositoryHelper'
import { Authorization } from '../../../middlewares/express/Authorization'

const adminPolicy = new AdminPolicy()
const logRepository = new LogRepository()

const listLogsService = new ListLogsService(logRepository)

const listLogsController = new ListLogsController(listLogsService)

const prismaRepository = new PrismaRepositoryHelper()
const authorization = new Authorization(prismaRepository)

const authenticatedLogRoutes = Router().get(
  '/',
  authorization.authorize(),
  adminPolicy.canListLogs(),
  resolve(listLogsController)
)

export { authenticatedLogRoutes }
