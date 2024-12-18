import bcrypt from 'bcryptjs'

export default abstract class PasswordHelper {
  static #passwordSalt: string = process.env.PASSWORD_SALT!
  static #saltRounds: number = parseInt(process.env.SALT_ROUNDS ?? '11')

  static async encrypt(password: string): Promise<string> {
    password = password + this.#passwordSalt
    const _encryptedPassword = await bcrypt.hash(password, this.#saltRounds)
    return _encryptedPassword
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    password = password + this.#passwordSalt
    const _compare = await bcrypt.compare(password, hash)
    return _compare
  }
}
