import { WalletProps, TransactionLevel } from '../../../entities/Wallet'
import { ZodValidator } from './ZodValidator'
import { t } from '../../../config/i18next/I18nextLocalization'
import { z, ZodObject, ZodRawShape } from 'zod'

export default class WalletValidator extends ZodValidator {
  walletParams: WalletProps

  constructor(walletParams: WalletProps) {
    super(walletParams)
    this.walletParams = walletParams
  }

  public schema(): ZodObject<ZodRawShape> {
    return z
      .object({
        id: z
          .string()
          .uuid({
            message: t('entity.wallet.error.id.format', {
              id: this.walletParams.id
            })
          })
          .optional(),
        transactionLevel: z.nativeEnum(TransactionLevel, {
          errorMap: () => {
            return {
              message: t('entity.wallet.error.transactionLevel.invalid', {
                transactionLevel: this.walletParams.transactionLevel
              })
            }
          }
        }),
        zoopAccountId: z.string().uuid({
          message: t('entity.wallet.error.zoopAccountId.format', {
            accountId: this.walletParams.zoopAccountId
          })
        }),
        userId: z
          .string()
          .uuid({
            message: t('entity.wallet.error.userId.format', {
              id: this.walletParams.userId
            })
          })
          .nullable(),
        isPrimary: z.boolean({
          errorMap: () => {
            return { message: t('entity.user.error.isBlocked') }
          }
        })
      })
      .required({
        zoopAccountId: true,
        transactionLevel: true,
        isPrimary: true
      })
  }
}
