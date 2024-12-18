import 'dotenv/config'

import ExpressAdapter from './adapters/express/ExpressAdapter'
import I18nextLocalization, { t } from './config/i18next/I18nextLocalization'

const serverPort = process.env.SERVER_PORT || '5000'
const httpServer = new ExpressAdapter(new I18nextLocalization())

httpServer.initialize()
httpServer.listen(serverPort, `Running ${t('app_name')} on port ${serverPort}`)
