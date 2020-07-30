import { isString } from './is'

export type UnaryFn<T, U> = (a: T) => U

export default <T, U>(fn: UnaryFn<T, U>): UnaryFn<T, U> => {
  const cache = new Map()

  return (a: T): U => {
    if (!isString(a)) {
      return fn(a)
    }

    if (!cache.has(a)) {
      cache.set(a, fn(a))
    }

    return cache.get(a)
  }
}
