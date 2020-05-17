import { readFileSync } from 'fs'

import attemptJsonParse from './attempt-json-parse.mjs'
import identity from './fn/identity.mjs'
import memoize from './fn/memoize.mjs'
import pipe from './fn/pipe.mjs'
import trim from './fn/trim.mjs'
import toObjectReducer from './fn/to-object-reducer.mjs'
import { isArray, isObject, isString } from './fn/is.mjs'

const withoutPrefix = prefix => {
  if (typeof prefix !== 'string') return identity
  if (prefix.length === 0) return identity

  return s => {
    if (typeof s !== 'string') return s
    return s.substring(prefix.length)
  }
}

const parseObjectWithDecoders = decoders => {
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

  const parseIfObject = value => {
    if (isObject(value)) {
      return parseObject(value)
    }
    if (isArray(value)) {
      return value.map(parseIfObject)
    }
    return value
  }

  const parseValue = pipe(trim, attemptDecode, attemptJsonParse, parseIfObject)

  const readFile = path => readFileSync(path, { encoding: 'utf8' })
  const parseFile = memoize(pipe(readFile, parseValue))

  const parsePair = ([key, value]) =>
    key.endsWith('_FILE')
      ? [key.replace(/_FILE$/, ''), parseFile(value)]
      : [key, parseValue(value)]

  const parseObject = source =>
    Object.entries(source).map(parsePair).reduce(toObjectReducer, {})

  return parseObject
}

const hasKeyIn = keys => ([key, value]) =>
  isString(key) &&
  (keys.includes(key) ||
    keys.includes(key.replace(/_FILE$/, '')) ||
    keys.includes(`${key}_FILE`, ''))

const onlyListedKeys = keys => {
  const filter = hasKeyIn(keys)
  return source =>
    Object.entries(source).filter(filter).reduce(toObjectReducer, {})
}

const envConfig = ({
  source = process.env,
  keys = Object.keys(source),
  decoders = defaultDecoders,
  transformers = [identity],
  transformer = pipe(...transformers),
} = {}) =>
  pipe(
    onlyListedKeys(keys),
    parseObjectWithDecoders(decoders),
    transformer
  )(source)

/**
 * Parses the source into an object.
 *
 * @param source Source object. _Optional. Default: `process.env`._
 * @param keys Array of keys to use. _Optional. Default: All keys in `source`._
 * @param decoders Array of decoder definitions to attempt to use for decoding each value. Each decoder definition is an object with a property `prefix` whose value is a string, or a property `test` whose value is a function to test whether to use this decoder to process the value. Additionally, each decoder definition has a property `decode` which is a function taking the original value, and returning the decoded value. Alternatively `decodeWithoutPrefix` can be defined, which is called with the original value, just having its prefix chopped off first. _Optional. Default: `defaultDecoders`._
 * @param transformers Array of functions for making any changes to the configuration object afterwards. Will be run in order of appearance. _Optional._
 * @param transformer Alternatively for convenience, a single function for making any change to the configuration object afterwards. _Takes the complete config object as argument, and must return the new/altered config object. Optional._
 * @returns {*} An object where the values are parsed according to <a href="#features">Features</a>.
 * @public
 * @name envConfig
 */
export default envConfig

/**
 * Default decoders, decoding strings prefixed with `base64:` and `hex:` into strings, and `base64binary:` and `hexbinary` into `Buffer`s.
 * @public
 */
export const defaultDecoders = [
  {
    prefix: 'base64:',
    decodeWithoutPrefix: s => Buffer.from(s, 'base64').toString(),
  },
  {
    prefix: 'base64binary:',
    decodeWithoutPrefix: s => Buffer.from(s, 'base64'),
  },
  {
    prefix: 'hex:',
    decodeWithoutPrefix: s => Buffer.from(s, 'hex').toString(),
  },
  {
    prefix: 'hexbinary:',
    decodeWithoutPrefix: s => Buffer.from(s, 'hex'),
  },
]
