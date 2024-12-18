/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { lightFormat } from 'date-fns'

export default abstract class ApplicationHelper {
  static camelToSnake(object: any): object {
    if (Array.isArray(object)) {
      return object.map(item => this.camelToSnake(item))
    } else if (object !== null && typeof object === 'object') {
      const snakeObj: any = {}
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
          snakeObj[snakeKey] = this.camelToSnake(object[key])
        }
      }
      return snakeObj
    } else {
      return object
    }
  }

  static snakeToCamel(object: any): object {
    if (Array.isArray(object)) {
      return object.map(item => this.snakeToCamel(item))
    } else if (object !== null && typeof object === 'object') {
      const camelObj: any = {}
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
            letter.toUpperCase()
          )

          if (camelKey == 'createdAt' || camelKey == 'updatedAt') {
            camelObj[camelKey] = lightFormat(object[key], 'dd/MM/yyyy HH:mm:ss')
          } else {
            camelObj[camelKey] = this.snakeToCamel(object[key])
          }
        }
      }
      return camelObj
    } else {
      return object
    }
  }

  static CNPJFormatted(cnpj: string): string {
    if (!cnpj) return ''

    return cnpj
      .replace(/\D+/g, '')
      .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }

  static taxpayerIdFormatted(taxpayerId: string): string {
    if (!taxpayerId) return ''

    return taxpayerId
      .replace(/\D+/g, '')
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  static phoneFormatted(phone: string): string {
    if (!phone) return ''

    return phone
      .replace(/\D+/g, '')
      .replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4')
  }
}
