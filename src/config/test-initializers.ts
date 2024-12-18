import I18nextLocalization from './i18next/I18nextLocalization'
import dotenv from 'dotenv'

// Init env variables for testing purposes
dotenv.config({ path: '.env.testing' })

// Init localization
new I18nextLocalization()
