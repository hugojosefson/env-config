import { isArray, isObject } from './fn/is.mjs'

export default parseObject => {
  const parseIfObject = value => {
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
