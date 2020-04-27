import { isString } from './is.mjs'

export default fn => {
  const cache = new Map()

  return a => {
    if (!isString(a)) {
      return fn(a)
    }

    if (!cache.has(a)) {
      cache.set(a, fn(a))
    }

    return cache.get(a)
  }
}
