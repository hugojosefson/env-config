import identity from './identity'
import { UnaryFn } from './memoize'

export default <T>(
  fn: UnaryFn<T, any> = identity,
  ...fns: UnaryFn<any, any>[]
): UnaryFn<T, any> => (input: T): any =>
  [fn, ...fns].reduce((acc, curr) => curr(acc), input)
