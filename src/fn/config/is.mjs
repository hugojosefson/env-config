import not from './complement.mjs'
import and from './and.mjs'

const is = constructor => value =>
  (value != null && value.constructor === constructor) ||
  value instanceof constructor

export default is
export const isArray = is(Array)
export const isObject = and(is(Object), not(isArray))
export const isString = is(String)
