/* eslint-disable max-len */
import { Router } from 'express'

import { resolve } from '../../../middlewares/routes/ExpressRouteMiddleware'
import AuthenticationController from '../../../controllers/AuthenticationController'
import AuthenticationService from '../../../services/AuthenticationService'
import { Authorization } from '../../../middlewares/express/Authorization'
import { CompanyPolicy } from '../../../middlewares/policies/CompanyPolicy'

import CreateCompanyController from '../../../controllers/companies/CreateCompanyController'
import UpdateCompanyController from '../../../controllers/companies/UpdateCompanyController'
import FindCompanyByIdOrCNPJController from '../../../controllers/companies/FindCompanyByIdOrCNPJController'
import BlockOrUnblockCompanyController from '../../../controllers/companies/BlockOrUnblockCompanyController'
import ListCompaniesController from '../../../controllers/companies/ListCompaniesController'

import { CompanyRepository } from '../../../repositories/prisma/CompanyRepository'
import { CompanyUserRepository } from '../../../repositories/prisma/CompanyUserRepository'

import { CreateCompanyService } from '../../../services/companies/CreateCompanyService'
import { UpdateCompanyService } from '../../../services/companies/UpdateCompanyService'
import { BlockOrUnblockCompanyService } from '../../../services/companies/BlockOrUnblockCompanyService'
import { ListCompaniesService } from '../../../services/companies/ListCompaniesService'
import { PrismaRepositoryHelper } from '../../../repositories/prisma/PrismaRepositoryHelper'

const companyPolicy = new CompanyPolicy()

const companyUserRepository = new CompanyUserRepository()
const companyRepository = new CompanyRepository()

const createCompanyService = new CreateCompanyService(companyRepository)
const updateCompanyService = new UpdateCompanyService(companyRepository)
const blockorUnblockCompanyService = new BlockOrUnblockCompanyService(
  companyRepository
)
const listCompaniesService = new ListCompaniesService(companyRepository)

const authenticationService = new AuthenticationService(companyUserRepository)
const authenticationController = new AuthenticationController(
  authenticationService
)
const findCompanyByIdOrCNPJController = new FindCompanyByIdOrCNPJController(
  companyRepository
)
const createCompanyController = new CreateCompanyController(
  companyRepository,
  companyUserRepository,
  createCompanyService
)
const updateCompanyController = new UpdateCompanyController(
  companyRepository,
  updateCompanyService
)
const blockOrUnblockCompanyController = new BlockOrUnblockCompanyController(
  blockorUnblockCompanyService
)
const listCompaniesController = new ListCompaniesController(
  listCompaniesService
)

const prismaRepository = new PrismaRepositoryHelper()
const authorization = new Authorization(prismaRepository)

const unauthenticatedCompanyRoutes = Router().post(
  '/login',
  resolve(authenticationController)
)

const authenticatedCompanyRoutes = Router()
  .get(
    '/',
    authorization.authorize(),
    companyPolicy.canListCompany(),
    resolve(listCompaniesController)
  )
  .get(
    '/:search',
    authorization.authorize(),
    companyPolicy.canListCompany(),
    resolve(findCompanyByIdOrCNPJController)
  )
  .post(
    '/',
    authorization.authorize(),
    companyPolicy.canCreateCompany(),
    resolve(createCompanyController)
  )
  .put(
    '/:id',
    authorization.authorize(),
    companyPolicy.canUpdateCompany(),
    resolve(updateCompanyController)
  )
  .patch(
    '/:id',
    authorization.authorize(),
    companyPolicy.canBlockOrUnblockCompany(),
    resolve(blockOrUnblockCompanyController)
  )

export { unauthenticatedCompanyRoutes, authenticatedCompanyRoutes }
