/* eslint-disable max-len */
import { Router } from 'express'

import { resolve } from '../../../middlewares/routes/ExpressRouteMiddleware'
import { Authorization } from '../../../middlewares/express/Authorization'
import { UserPolicy } from '../../../middlewares/policies/UserPolicy'

import { LoginService } from '../../../services/zoop/two-factor-authentication/authentication/LoginService'
import { LoginProvider } from '../../../adapters/providers/zoop/two-factor-authentication/authentication/LoginProvider'
import { AxiosAdapter } from '../../../adapters/http/axios/AxiosAdapter'
import { PrismaRepositoryHelper } from '../../../repositories/prisma/PrismaRepositoryHelper'
import { RegisterUserCellPhoneService } from '../../../services/zoop/two-factor-authentication/usuario/RegisterUserCellPhoneService'
import { RegisterUserCellPhoneProvider } from '../../../adapters/providers/zoop/two-factor-authentication/user/RegisterUserCellPhoneProvider'
import RegisterUserCellPhoneController from '../../../controllers/two-factor-authentication/RegisterUserCellPhoneController'
import { RequestUserSessionBySMSProvider } from '../../../adapters/providers/zoop/two-factor-authentication/authentication/RequestUserSessionBySMSProvider'
import { ValidateCodeSentByBySMSService } from '../../../services/zoop/two-factor-authentication/authentication/ValidateCodeSentByBySMSService'
import ValidateCodeSentByBySMSController from '../../../controllers/two-factor-authentication/ValidateCodeSentByBySMSController'

const axiosAdapter = new AxiosAdapter()
const loginProvider = new LoginProvider(axiosAdapter)
const registerUserCellPhoneProvider = new RegisterUserCellPhoneProvider(
  axiosAdapter
)
const requestUserSessionBySMSProvider = new RequestUserSessionBySMSProvider(
  axiosAdapter
)

const userPolicy = new UserPolicy()

const loginService = new LoginService(loginProvider)
const registerCellphoneUserService = new RegisterUserCellPhoneService(
  registerUserCellPhoneProvider
)
const validateCodeSentByBySMSService = new ValidateCodeSentByBySMSService(
  requestUserSessionBySMSProvider
)

const registerUserCellPhoneController = new RegisterUserCellPhoneController(
  loginService,
  registerCellphoneUserService
)
const validateCodeSentByBySMSController = new ValidateCodeSentByBySMSController(
  loginService,
  validateCodeSentByBySMSService
)

const prismaRepository = new PrismaRepositoryHelper()
const authorization = new Authorization(prismaRepository)

const authenticatedTwoFactorAuthenticationRoutes = Router()
  .post(
    '/register-cellphone',
    authorization.authorize(),
    userPolicy.canUseTwoFactorAuthentication(),
    resolve(registerUserCellPhoneController)
  )
  .post(
    '/register-cellphone/validate',
    authorization.authorize(),
    userPolicy.canUseTwoFactorAuthentication(),
    resolve(validateCodeSentByBySMSController)
  )

export { authenticatedTwoFactorAuthenticationRoutes }
