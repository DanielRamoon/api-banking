import ApplicationLocalization from '../../config/ApplicationLocalization'
import HttpServer from '../../server/HttpServer'
import routes from '../../routes/index.routes'
import cors from 'cors'
import express from 'express'

export default class ExpressAdapter implements HttpServer {
  private app: express.Application
  private localization: ApplicationLocalization

  constructor(localization: ApplicationLocalization) {
    this.app = express()
    this.localization = localization
  }

  public initialize(): void {
    this.app.use(
      cors({
        exposedHeaders: ['x-total-count', 'Content-Type', 'Content-Length']
      })
    )

    this.app.use(
      express.json({
        type: ['application/json', 'text/plain']
      })
    )

    this.app.use(routes)

    this.app.use(this.localization.middleware)
  }

  public listen(port: string, message?: string): void {
    this.app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(message)
    })
  }
}
