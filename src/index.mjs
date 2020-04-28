import { readFileSync } from 'fs'

import attemptJsonParse from './attempt-json-parse.mjs'
import identity from './fn/identity.mjs'
import memoize from './fn/memoize.mjs'
import pipe from './fn/pipe.mjs'
import trim from './fn/trim.mjs'
import toObjectReducer from './fn/to-object-reducer.mjs'
import { isArray, isObject, isString } from './fn/is.mjs'

const parseIfObject = value => {
  if (isObject(value)) {
    return parseObject(value)
  }
  if (isArray(value)) {
    return value.map(parseIfObject)
  }
  return value
}

const parseValue = pipe(trim, attemptJsonParse, parseIfObject)

const readFile = path => readFileSync(path, { encoding: 'utf8' })
const parseFile = memoize(pipe(readFile, parseValue))

const parsePair = ([key, value]) =>
  key.endsWith('_FILE')
    ? [key.replace(/_FILE$/, ''), parseFile(value)]
    : [key, parseValue(value)]

const hasKeyIn = keys => ([key, value]) =>
  isString(key) &&
  (keys.includes(key) ||
    keys.includes(key.replace(/_FILE$/, '')) ||
    keys.includes(`${key}_FILE`, ''))

const parseObject = source =>
  Object.entries(source).map(parsePair).reduce(toObjectReducer, {})

const onlyListedKeys = keys => {
  const filter = hasKeyIn(keys)
  return source =>
    Object.entries(source).filter(filter).reduce(toObjectReducer, {})
}

const envConfig = ({
  source = process.env,
  keys = Object.keys(source),
  transformers = [identity],
  transformer = pipe(...transformers),
} = {}) => pipe(onlyListedKeys(keys), parseObject, transformer)(source)

/**
 * Parses the source into an object.
 * @param source Source object. _Optional. Default: `process.env`._
 * @param keys Array of keys to use. _Optional. Default: All keys in `source`._
 * @param transformers Array of functions for making any changes to the configuration object afterwards. Will be run in order of appearance. _Optional._
 * @param transformer Alternatively for convenience, a single function for making any change to the configuration object afterwards. _Takes the complete config object as argument, and must return the new/altered config object. Optional._
 * @returns {*} An object where the values are parsed according to <a href="#features">Features</a>.
 * @public
 * @name envConfig
 */
export default envConfig
