import { t } from '../../config/i18next/I18nextLocalization'
import User, { UserProps } from '../../entities/User'
import { ApplicationError } from '../../helpers/ApplicationError'
import { IHolderRepository } from '../../repositories/IHolderRepository'
import { IUserRepository } from '../../repositories/IUserRepository'
import { ApplicationService } from '../ApplicationService'

type CreateUserParams = {
  name: string
  email: string
  cnpj?: string
  taxpayerId: string
  phone: string
  phonePrefix: string
  companyId: string
  encryptedPassword: string
}

export class CreateUserService implements ApplicationService {
  private userRepository: IUserRepository
  private holderRepository: IHolderRepository

  constructor(
    userRepository: IUserRepository,
    holderRepository: IHolderRepository
  ) {
    this.userRepository = userRepository
    this.holderRepository = holderRepository
  }

  async run({
    name,
    cnpj,
    email,
    taxpayerId,
    companyId,
    phone,
    phonePrefix,
    encryptedPassword
  }: CreateUserParams): Promise<User | ApplicationError> {
    try {
      cnpj = cnpj?.replace(/\D+/g, '')
      taxpayerId = taxpayerId?.replace(/\D+/g, '')
      phonePrefix = phonePrefix?.replace(/\D+/g, '')
      phone = phone?.replace(/\D+/g, '')

      let holderId = ''
      const holder = await this.holderRepository.findByCNPJAndTaxpayerId(
        taxpayerId,
        cnpj
      )
      if (!(holder instanceof ApplicationError)) {
        if (holder) holderId = holder.id
      }

      const user = await this.userRepository.create({
        name,
        cnpj,
        email,
        taxpayerId,
        companyId,
        phone,
        phonePrefix,
        encryptedPassword,
        holderId
      })

      if (user instanceof ApplicationError) throw user

      return new User(user as UserProps).serializable_hash
    } catch (error) {
      if (error instanceof ApplicationError) {
        return new ApplicationError(error.message)
      } else {
        return new ApplicationError(t('error.internal'))
      }
    }
  }
}
