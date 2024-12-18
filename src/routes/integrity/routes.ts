import { Router } from 'express'

import { resolve } from '../../middlewares/routes/ExpressRouteMiddleware'
import IntegrityController from '../../controllers/IntegrityController'

const integrityController = new IntegrityController()
const integrityRoutes = Router().get('/', resolve(integrityController))

export { integrityRoutes }
