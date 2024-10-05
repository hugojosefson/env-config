export default (...fns) =>
  input =>
    fns.reduce((acc, curr) => curr(acc), input)
