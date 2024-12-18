/* eslint-disable @typescript-eslint/no-explicit-any */
import ApplicationLocalization from '../ApplicationLocalization'
import i18next from 'i18next'
import Backend from 'i18next-fs-backend'
import httpMiddleware from 'i18next-http-middleware'
import { lstatSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

export default class I18nextLocalization implements ApplicationLocalization {
  constructor() {
    this.initLocalization()
  }

  middleware = () => httpMiddleware.handle(i18next)

  initLocalization(): void {
    i18next
      .use(Backend)
      .use(httpMiddleware.LanguageDetector)
      .init({
        debug: false,
        initImmediate: false,
        fallbackLng: 'pt-BR',
        lng: 'pt-BR',
        preload: readdirSync(join(__dirname, './locales')).filter(fileName => {
          const joinedPath = join(join(__dirname, './locales'), fileName)
          const isDirectory = lstatSync(joinedPath).isDirectory()
          return isDirectory
        }),
        ns: 'translation',
        defaultNS: 'translation',
        backend: {
          loadPath: join(__dirname, './locales/{{lng}}/{{ns}}.json')
        }
      })

    i18next.init()
  }
}

export function t(value: string, options?: any): any {
  return i18next.t(value, options)
}
