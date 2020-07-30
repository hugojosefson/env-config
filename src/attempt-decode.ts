import identity from './fn/identity'
import pipe from './fn/pipe'
import withoutPrefix from './fn/without-prefix'
import { Decoder } from './index'

const attemptDecodeReducer = (
  acc: any,
  {
    prefix = '',
    test = s => prefix != null && typeof s === 'string' && s.startsWith(prefix),
    decodeWithoutPrefix = identity,
    decode = pipe(withoutPrefix(prefix), decodeWithoutPrefix)
  }: Decoder
) => {
  try {
    if (test(acc)) {
      return decode(acc)
    }
  } catch (ignore) {}
  return acc
}

export default (decoders: Decoder[]) => {
  if (decoders.length === 0) {
    return identity
  }

  const attemptDecode = (value: any, ...seenValues: any[]): any => {
    const result = decoders.reduce(attemptDecodeReducer, value)

    if (result === value) return result
    if (seenValues.includes(result)) return result

    return attemptDecode(result, value, ...seenValues)
  }

  return attemptDecode
}
