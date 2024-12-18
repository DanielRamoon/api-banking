import { describe, expect, it } from '@jest/globals'
import ApplicationHelper from '../ApplicationHelper'

describe('ApplicationHelper', () => {
  describe('camelToSnake', () => {
    it('should convert camelCase keys to snake_case', () => {
      const camelCaseObject = {
        myPropertyName: 'value',
        nestedProperty: {
          anotherNested: 'nestedValue'
        }
      }

      const snakeCaseObject = ApplicationHelper.camelToSnake(camelCaseObject)

      expect(snakeCaseObject).toEqual({
        my_property_name: 'value',
        nested_property: {
          another_nested: 'nestedValue'
        }
      })
    })

    it('should handle arrays', () => {
      const camelCaseArray = [
        { camelKeyOne: 'value1' },
        { camelKeyTwo: 'value2' }
      ]

      const snakeCaseArray = ApplicationHelper.camelToSnake(camelCaseArray)

      expect(snakeCaseArray).toEqual([
        { camel_key_one: 'value1' },
        { camel_key_two: 'value2' }
      ])
    })
  })

  describe('snakeToCamel', () => {
    it('should convert snake_case keys to camelCase', () => {
      const snakeCaseObject = {
        my_property_name: 'value',
        nested_property: {
          another_nested: 'nestedValue'
        }
      }

      const camelCaseObject = ApplicationHelper.snakeToCamel(snakeCaseObject)

      expect(camelCaseObject).toEqual({
        myPropertyName: 'value',
        nestedProperty: {
          anotherNested: 'nestedValue'
        }
      })
    })

    it('should handle arrays', () => {
      const snakeCaseArray = [
        { snake_key_one: 'value1' },
        { snake_key_two: 'value2' }
      ]

      const camelCaseArray = ApplicationHelper.snakeToCamel(snakeCaseArray)

      expect(camelCaseArray).toEqual([
        { snakeKeyOne: 'value1' },
        { snakeKeyTwo: 'value2' }
      ])
    })
  })
})
