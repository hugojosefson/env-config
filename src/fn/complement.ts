import { Predicate } from './and'

export default <T extends Array<any>>(fn: Predicate<T>) => (
  ...args: T
): boolean => !fn(...args)
