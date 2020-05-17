import pipe from './fn/pipe.mjs'
import withoutPrefix from './fn/without-prefix.mjs'

export default decoders => {
  const attemptDecode = (value, ...seenValues) => {
    if (decoders.length === 0) {
      return value
    }
    const result = decoders.reduce(
      (
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
      },
      value
    )

    if (result === value) return result
    if (seenValues.includes(result)) return result
    return attemptDecode(result, value, ...seenValues)
  }

  return attemptDecode
}
