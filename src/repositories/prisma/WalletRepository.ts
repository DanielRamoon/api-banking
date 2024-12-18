/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { prisma } from '../../config/database/prisma'
import { t } from '../../config/i18next/I18nextLocalization'
import Wallet, { WalletProps } from '../../entities/Wallet'
import { ApplicationError } from '../../helpers/ApplicationError'
import ApplicationHelper from '../../helpers/ApplicationHelper'
import { IWalletRepository } from '../IWalletRepository'

type ListWalletsParams = {
  userId: string
  companyId?: string
  page: number
  perPage: number
}

export class WalletRepository implements IWalletRepository {
  async create({
    userId,
    zoopAccountId,
    isPrimary,
    transactionLevel
  }: WalletProps): Promise<Wallet | ApplicationError> {
    try {
      const walletPrisma = await prisma.wallet.create({
        data: {
          user_id: userId,
          zoop_account_id: zoopAccountId,
          is_primary: isPrimary,
          transaction_level: transactionLevel
        }
      })

      if (!walletPrisma)
        return new ApplicationError(t('error.creating', { resource: 'wallet' }))

      const wallet = ApplicationHelper.snakeToCamel(walletPrisma) as WalletProps

      return new Wallet(wallet)
    } catch (error) {
      const _message =
        error instanceof ApplicationError
          ? error.message
          : t('error.creating', { resource: 'holder_document' })
      return new ApplicationError(_message)
    }
  }

  async list({
    userId,
    companyId,
    page,
    perPage
  }: ListWalletsParams): Promise<ApplicationError | Wallet[]> {
    const where = userId ? { user_id: userId } : {}
    const whereCompany = companyId
      ? { ...where, user: { company_id: companyId } }
      : {}

    try {
      const wallets = await prisma.wallet.findMany({
        skip: page,
        take: perPage,
        where: {
          ...where,
          ...whereCompany
        },
        include: {
          user: true
        }
      })

      const formattedWallets = wallets.map(wallet => {
        return new Wallet(ApplicationHelper.snakeToCamel(wallet) as WalletProps)
      })

      return formattedWallets
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }

  async count(): Promise<number | ApplicationError> {
    const holdersAggregate = await prisma.wallet.aggregate({
      _count: {
        id: true
      }
    })

    return holdersAggregate?._count?.id
  }

  async find(
    id: string,
    userId?: string,
    companyId?: string
  ): Promise<Wallet | ApplicationError> {
    const where = userId ? { user_id: userId } : {}
    const whereCompany = companyId
      ? { ...where, user: { company_id: companyId } }
      : {}

    try {
      const walletPrisma = await prisma.wallet.findFirst({
        where: {
          OR: [{ id }, { zoop_account_id: id }],
          ...where,
          ...whereCompany
        },
        include: {
          user: true
        }
      })

      if (!walletPrisma)
        return new ApplicationError(t('error.notFound', { resource: 'wallet' }))

      const holder = ApplicationHelper.snakeToCamel(walletPrisma) as WalletProps

      return holder as Wallet
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }

  update(id: string, params: object): Promise<object | ApplicationError> {
    throw new Error('Method not implemented.')
  }

  delete(id: string): Promise<void | ApplicationError> {
    throw new Error('Method not implemented.')
  }

  findUser(type: string, email: string): Promise<object | ApplicationError> {
    throw new Error('Method not implemented.')
  }

  updatePassword(
    email: string,
    password: string
  ): Promise<object | ApplicationError> {
    throw new Error('Method not implemented.')
  }

  emailExists(email: string, id?: string | undefined): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
