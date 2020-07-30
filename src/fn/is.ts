import and from './and'
import not from './complement'

type AConstructorTypeOf<T> = new (...args: any[]) => T

const is = <T extends AConstructorTypeOf<U>, U>(constructor: T) => (
  value:
    | any
    | {
        constructor?: AConstructorTypeOf<any>
      }
): boolean =>
  (value != null && value.constructor === constructor) ||
  value instanceof constructor

export default is
export const isArray = is(Array)
export const isObject = and(is(Object), not(isArray))
export const isString = <T>(a: T): boolean =>
  typeof a === 'string' || is(String)(a)
