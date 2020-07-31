import { isArray, isObject } from './fn/is'

export default (
  parseObject: (source: Record<string, any>) => Record<string, any>
): ((value: any) => any) => {
  const parseIfObject = (value: any): any => {
    if (isObject(value)) {
      return parseObject(value)
    }
    if (isArray(value)) {
      return value.map(parseIfObject)
    }
    return value
  }

  return parseIfObject
}
