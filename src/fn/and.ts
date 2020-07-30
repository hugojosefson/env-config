export type UnaryPredicate<T> = (a: T) => boolean
export type Predicate<T extends Array<any>> = (...a: T) => boolean

function and<T extends Array<any>, U extends Array<any>>(
  fn: Predicate<T>,
  ...fns: Predicate<any>[]
): Predicate<T> {
  return (...args) => {
    if (fns.length > 0) {
      const [nextFn, ...restFns] = fns
      return fn(...args) && and(nextFn, ...restFns)(...args)
    } else {
      return fn(...args)
    }
  }
}
export default and
