import identity from './fn/identity.mjs'
import pipe from './fn/pipe.mjs'
import withoutPrefix from './fn/without-prefix.mjs'

const attemptDecodeReducer = (
  acc,
  {
    prefix,
    test = s => typeof s === 'string' && s.startsWith(prefix),
    decodeWithoutPrefix,
    decode = pipe(withoutPrefix(prefix), decodeWithoutPrefix),
  }
) => {
  try {
    if (test(acc)) {
      return decode(acc)
    }
  } catch (ignore) {}
  return acc
}

export default decoders => {
  if (decoders.length === 0) {
    return identity
  }

  const attemptDecode = (value, ...seenValues) => {
    const result = decoders.reduce(attemptDecodeReducer, value)

    if (result === value) return result
    if (seenValues.includes(result)) return result

    return attemptDecode(result, value, ...seenValues)
  }

  return attemptDecode
}
