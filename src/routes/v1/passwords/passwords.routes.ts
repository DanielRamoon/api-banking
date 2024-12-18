/* eslint-disable max-len */
import { Router } from 'express'

import { resolve } from '../../../middlewares/routes/ExpressRouteMiddleware'
import SendRecoveryPasswordEmailController from '../../../controllers/SendRecoveryPasswordEmailController'
import UpdatePasswordController from '../../../controllers/UpdatePasswordController'
import SendRecoveryPasswordEmailService from '../../../services/mailers/SendRecoveryPasswordEmailService'
import UpdatePasswordService from '../../../services/UpdatePasswordService'
import { AxiosAdapter } from '../../../adapters/http/axios/AxiosAdapter'
import { SendPulse } from '../../../mailers/sendpulse/SendPulse'
import { PrismaRepositoryHelper } from '../../../repositories/prisma/PrismaRepositoryHelper'

const axiosAdapter = new AxiosAdapter()
const sendPulse = new SendPulse(axiosAdapter)
const prismaRepository = new PrismaRepositoryHelper()
const authenticationService = new SendRecoveryPasswordEmailService(
  sendPulse,
  prismaRepository
)
const sendRecoveryPasswordEmailController =
  new SendRecoveryPasswordEmailController(authenticationService)

const updatePasswordService = new UpdatePasswordService(prismaRepository)
const updatePasswordController = new UpdatePasswordController(
  updatePasswordService
)

const passwordsRoutes = Router()
  .post('/send-recovery-email', resolve(sendRecoveryPasswordEmailController))
  .post('/recovery-password', resolve(updatePasswordController))

export { passwordsRoutes }
