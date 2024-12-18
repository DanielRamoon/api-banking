/* eslint-disable @typescript-eslint/no-explicit-any */
import { t } from '../../config/i18next/I18nextLocalization'
import { ApplicationError } from '../../helpers/ApplicationError'
import ApplicationHttpRequest, {
  AuthorizationType,
  Method
} from '../../helpers/ApplicationHttpRequest'
import { ApplicationMailer } from '../ApplicationMailer'
import { compareAsc, addMinutes } from 'date-fns'
import fs from 'node:fs'

type TokenRequest = {
  data: {
    access_token: string
  }
}

export class SendPulse implements ApplicationMailer {
  private applicationHttpRequest: ApplicationHttpRequest
  private SEND_PULSE_SMTP_BASE_URL = 'https://api.sendpulse.com/smtp/emails'
  private SEND_PULSE_ACCESS_TOKEN_URL =
    'https://api.sendpulse.com/oauth/access_token'

  #clientId = process.env.SEND_PULSE_CLIENT_ID
  #clientSecret = process.env.SEND_PULSE_CLIENT_SECRET

  #emailFrom = process.env.EMAIL_FROM
  #emailFromName = process.env.EMAIL_FROM_NAME

  #linkRecoveryPassword = process.env.RECOVERY_PASSWORD_BASE_LINK

  #tokenfile = './src/mailers/sendpulse/token.json'

  constructor(applicationHttpRequest: ApplicationHttpRequest) {
    this.applicationHttpRequest = applicationHttpRequest
  }

  private async refreshToken(): Promise<string | ApplicationError> {
    const url = this.SEND_PULSE_ACCESS_TOKEN_URL
    const body = {
      grant_type: 'client_credentials',
      client_id: this.#clientId,
      client_secret: this.#clientSecret
    }

    try {
      const result = (await this.applicationHttpRequest.fetch(
        Method.POST,
        url,
        body
      )) as TokenRequest

      return result.data.access_token
    } catch (error) {
      return new ApplicationError(t('email.error.token'))
    }
  }

  private async token(): Promise<string | ApplicationError> {
    try {
      const currentDate = new Date()
      let { token }: any = this.localCredentials
      const { expireDate }: any = this.localCredentials

      const expiredToken = compareAsc(currentDate, new Date(expireDate)) === 1
      if (token && expireDate && !expiredToken) {
        return token
      } else {
        // refresh token
        token = await this.refreshToken()

        const newToken = {
          token,
          expireDate: addMinutes(new Date(), 50)
        }

        const jsonString = JSON.stringify(newToken)
        fs.writeFile(this.#tokenfile, jsonString, err => {
          if (err) throw new ApplicationError(t('email.error.token'))
        })

        return token
      }
    } catch (error: any) {
      return new ApplicationError(error.message)
    }
  }

  public async send(
    subject: string,
    to: Array<object>,
    linkRecovery: string
  ): Promise<object | ApplicationError> {
    const token = await this.token()
    if (token instanceof ApplicationError) return token

    this.applicationHttpRequest.initialize(
      AuthorizationType.bearer,
      this.SEND_PULSE_SMTP_BASE_URL,
      token
    )

    const url = this.applicationHttpRequest.getBaseURL()
    const body = {
      email: {
        html: this.emailBase64(linkRecovery),
        text: this.emailText(linkRecovery),
        subject,
        to,
        from: {
          name: this.#emailFromName,
          email: this.#emailFrom
        }
      }
    }

    try {
      const result = await this.applicationHttpRequest.fetch(
        Method.POST,
        url,
        body
      )

      return result
    } catch (error) {
      return new ApplicationError(t('email.error.send'))
    }
  }

  public async sendRecoveryPassword(
    subject: string,
    to: Array<object>,
    token: string
  ): Promise<object | ApplicationError> {
    try {
      const linkRecovery = `${this.#linkRecoveryPassword}${token}`

      const send = await this.send(subject, to, linkRecovery)

      return send
    } catch (error) {
      return new ApplicationError(t('email.error.send'))
    }
  }

  private get localCredentials(): object {
    let _token, _expireDate
    try {
      const file = fs.readFileSync(this.#tokenfile)
      const { token, expireDate } = JSON.parse(file.toString())

      _token = token
      _expireDate = expireDate
    } catch (error) {
      _token = ''
      _expireDate = ''
    }

    return { token: _token, expireDate: _expireDate }
  }

  private emailBase64(linkRecovery: string): string {
    const baseText = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Recuperação de Senha</title>
        </head>
        <body>
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Recuperação de Senha</h2>
          <p>Olá,</p>
          <p>
            Recebemos uma solicitação de recuperação de senha para a sua conta.
            Se você não solicitou isso,
            pode ignorar este e-mail.
          </p>
          <p>
            Se você solicitou a recuperação da senha,
            clique no link abaixo para redefinir sua senha:
          </p>
          <p><a href="${linkRecovery}" target="_blank">Redefinir Senha</a></p>
          <p>Este link é válido por 1 hora.</p>
          <p>Se você tiver alguma dúvida, entre em contato conosco.</p>
          <p>Obrigado,</p>
          <p>Sua Equipe</p>
        </div>
        </body>
      </html>
    `

    return Buffer.from(baseText).toString('base64')
  }

  private emailText(linkRecovery: string): string {
    return `
      Recuperação de Senha\n
      Olá,\n\n

      Recebemos uma solicitação de recuperação de senha para a sua conta.
      Se você não solicitou isso,
      pode ignorar este e-mail.\n\n

      Se você solicitou a recuperação da senha,
      clique no link abaixo para redefinir sua senha:\n\n

      Link para redefinir a Senha: ${linkRecovery}\n
      Este link é válido por 1 hora.\n
      Se você tiver alguma dúvida, entre em contato conosco.\n
      Obrigado,\n
      Sua Equipe\n
    `
  }
}
