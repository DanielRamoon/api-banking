import { Router } from 'express'

import { resolve } from '../../../middlewares/routes/ExpressRouteMiddleware'
import AuthenticationController from '../../../controllers/AuthenticationController'
import AuthenticationService from '../../../services/AuthenticationService'
import { AdminRepository } from '../../../repositories/prisma/AdminRepository'
import { PrismaRepositoryHelper } from '../../../repositories/prisma/PrismaRepositoryHelper'
import { Authorization } from '../../../middlewares/express/Authorization'
import { AdminPolicy } from '../../../middlewares/policies/AdminPolicy'
import { ListAdminsService } from '../../../services/admins/ListAdminsService'
import { CreateAdminService } from '../../../services/admins/CreateAdminService'
import { UpdateAdminService } from '../../../services/admins/UpdateAdminService'
import { DeleteAdminService } from '../../../services/admins/DeleteAdminService'
import ListAdminsController from '../../../controllers/admins/ListAdminsController'
import CreateAdminController from '../../../controllers/admins/CreateAdminController'
import UpdateAdminController from '../../../controllers/admins/UpdateAdminController'
import DeleteAdminController from '../../../controllers/admins/DeleteAdminController'
import GetAdminDataController from '../../../controllers/admins/GetAdminDataController'

const adminPolicy = new AdminPolicy()
const adminRepository = new AdminRepository()

const authenticationService = new AuthenticationService(adminRepository)
const listAdminsService = new ListAdminsService(adminRepository)
const createAdminService = new CreateAdminService(adminRepository)
const updateAdminService = new UpdateAdminService(adminRepository)
const deleteAdminService = new DeleteAdminService(adminRepository)

const authenticationController = new AuthenticationController(
  authenticationService
)
const listAdminsController = new ListAdminsController(listAdminsService)
const createAdminController = new CreateAdminController(
  adminRepository,
  createAdminService
)
const updateAdminController = new UpdateAdminController(
  adminRepository,
  updateAdminService
)
const deleteAdminController = new DeleteAdminController(deleteAdminService)
const getAdminDataController = new GetAdminDataController(adminRepository)

const prismaRepository = new PrismaRepositoryHelper()
const authorization = new Authorization(prismaRepository)

const unauthenticatedAdminRoutes = Router().post(
  '/login',
  resolve(authenticationController)
)

const authenticatedAdminRoutes = Router()
  .get(
    '/',
    authorization.authorize(),
    adminPolicy.canListAdmin(),
    resolve(listAdminsController)
  )
  .get(
    '/:id',
    authorization.authorize(),
    adminPolicy.canGetAdminDetails(),
    resolve(getAdminDataController)
  )
  .post(
    '/',
    authorization.authorize(),
    adminPolicy.canCreateAdmin(),
    resolve(createAdminController)
  )
  .put(
    '/:id',
    authorization.authorize(),
    adminPolicy.canUpdateAdmin(),
    resolve(updateAdminController)
  )
  .delete(
    '/:id',
    authorization.authorize(),
    adminPolicy.canDeleteAdmin(),
    resolve(deleteAdminController)
  )

export { unauthenticatedAdminRoutes, authenticatedAdminRoutes }
