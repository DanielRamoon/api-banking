/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { prisma } from '../../config/database/prisma'
import { t } from '../../config/i18next/I18nextLocalization'
import Operation, { OperationProps } from '../../entities/Operation'
import { ApplicationError } from '../../helpers/ApplicationError'
import ApplicationHelper from '../../helpers/ApplicationHelper'
import { IOperationRepository } from '../IOperationRepository'

type ListOperatiosParams = {
  walletId: string
  userId: string
  companyId?: string
  page: number
  perPage: number
}

export class OperationRepository implements IOperationRepository {
  async create({
    zoopOperationId,
    type,
    amountCents,
    status,
    barCode,
    discount,
    interest,
    fine,
    fee,
    description,
    holderId,
    walletId,
    referenceId
  }: OperationProps): Promise<Operation | ApplicationError> {
    try {
      const operationPrisma = await prisma.operation.create({
        data: {
          zoop_operation_id: zoopOperationId,
          amount_cents: amountCents,
          holder_id: holderId,
          wallet_id: walletId,
          bar_code: barCode,
          reference_id: referenceId,
          status,
          discount,
          interest,
          fine,
          fee,
          description,
          type
        }
      })

      if (!operationPrisma)
        return new ApplicationError(
          t('error.creating', { resource: 'operation' })
        )

      const operation = ApplicationHelper.snakeToCamel(
        operationPrisma
      ) as OperationProps

      return new Operation(operation)
    } catch (error) {
      const _message =
        error instanceof ApplicationError
          ? error.message
          : t('error.creating', { resource: 'holder_document' })
      return new ApplicationError(_message)
    }
  }

  async list({
    walletId,
    userId,
    companyId,
    page,
    perPage
  }: ListOperatiosParams): Promise<ApplicationError | Operation[]> {
    try {
      let wallet = {}

      if (walletId) wallet = { ...wallet, id: walletId }
      if (userId) wallet = { ...wallet, user_id: userId }
      if (companyId) wallet = { ...wallet, user: { company_id: companyId } }

      const operations = await prisma.operation.findMany({
        skip: page,
        take: perPage,
        where: {
          wallet
        },
        orderBy: {
          created_at: 'desc'
        }
      })

      const formattedOperations = operations.map(operation => {
        return new Operation(
          ApplicationHelper.snakeToCamel(operation) as OperationProps
        )
      })

      return formattedOperations
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }

  async find(
    id: string,
    userId?: string,
    companyId?: string
  ): Promise<Operation | ApplicationError> {
    let wallet = {}

    if (userId) wallet = { ...wallet, user_id: userId }
    if (companyId) wallet = { ...wallet, user: { company_id: companyId } }

    try {
      const operationPrisma = await prisma.operation.findFirst({
        where: {
          OR: [{ id }, { zoop_operation_id: id }],
          wallet
        },
        include: {
          wallet: true
        }
      })

      if (!operationPrisma)
        return new ApplicationError(
          t('error.notFound', { resource: 'operation' })
        )

      const operation = ApplicationHelper.snakeToCamel(
        operationPrisma
      ) as OperationProps

      return operation as Operation
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }

  async findWithWalletId(
    id: string,
    walletId: string
  ): Promise<Operation | ApplicationError> {
    try {
      const operationPrisma = await prisma.operation.findFirst({
        where: { id, wallet_id: walletId }
      })

      if (!operationPrisma)
        return new ApplicationError(
          t('error.notFound', { resource: 'operation' })
        )

      const operation = ApplicationHelper.snakeToCamel(
        operationPrisma
      ) as OperationProps

      return operation as Operation
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }

  async count(): Promise<number | ApplicationError> {
    const holdersAggregate = await prisma.operation.aggregate({
      _count: {
        id: true
      }
    })

    return holdersAggregate?._count?.id
  }

  async update(
    id: string,
    params: OperationProps
  ): Promise<Operation | ApplicationError> {
    try {
      const _params = ApplicationHelper.camelToSnake(params)

      const operation = await prisma.operation.update({
        where: { id },
        data: {
          ..._params
        }
      })

      const updatedOperation = new Operation(
        ApplicationHelper.snakeToCamel(operation) as OperationProps
      )

      return updatedOperation
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
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
