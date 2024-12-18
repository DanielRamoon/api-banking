import { Router } from 'express'
import {
  unauthenticatedUserRoutes,
  authenticatedUserRoutes
} from './v1/users/users.routes'
import {
  unauthenticatedAdminRoutes,
  authenticatedAdminRoutes
} from './v1/admins/admins.routes'
import { passwordsRoutes } from './v1/passwords/passwords.routes'
import {
  unauthenticatedCompanyRoutes,
  authenticatedCompanyRoutes
} from './v1/companies/index.routes'
import { authenticatedHolderRoutes } from './v1/holders/index.routes'
import { integrityRoutes } from './integrity/routes'
import { authenticatedWalletRoutes } from './v1/wallets/index.routes'
import { authenticatedOperationRoutes } from './v1/operations/index.routes'
import { authenticatedCompanyUsersRoutes } from './v1/companies/company-users/index.routes'
import { authenticatedPaymentRoutes } from './v1/payments/index.routes'
import { authenticatedPixRoutes } from './v1/pix/index.routes'
import { authenticatedTwoFactorAuthenticationRoutes } from './v1/2fa/2fa.routes'
import { authenticatedLogRoutes } from './v1/logs/logs.routes'
import { holdersWebhooksRoutes } from './v1/webhooks/holders/index.routes'
import { operationsWebhooksRoutes } from './v1/webhooks/operations/index.routes'

const routes = Router()
  .use('/users', authenticatedUserRoutes)
  .use('/users', unauthenticatedUserRoutes)
  .use('/admins', authenticatedAdminRoutes)
  .use('/admins', unauthenticatedAdminRoutes)
  .use('/companies', authenticatedCompanyUsersRoutes)
  .use('/companies', unauthenticatedCompanyRoutes)
  .use('/companies', authenticatedCompanyRoutes)
  .use('/holders', authenticatedHolderRoutes)
  .use('/passwords', passwordsRoutes)
  .use('/check_integrity', integrityRoutes)
  .use('/wallets', authenticatedWalletRoutes)
  .use('/operations', authenticatedOperationRoutes)
  .use('/payments', authenticatedPaymentRoutes)
  .use('/pix', authenticatedPixRoutes)
  .use('/2fa', authenticatedTwoFactorAuthenticationRoutes)
  .use('/logs', authenticatedLogRoutes)
  .use('/webhooks', holdersWebhooksRoutes)
  .use('/webhooks', operationsWebhooksRoutes)

export default Router().use('/api', routes)
