const and =
  (fn, ...fns) =>
  (...args) => {
    if (fns.length === 0) {
      return fn(...args)
    }
    return fn(...args) && and(...fns)(...args)
  }
export default and
