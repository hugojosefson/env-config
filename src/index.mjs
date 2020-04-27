import { readFileSync } from 'fs'

import attemptJsonParse from './attempt-json-parse.mjs'
import identity from './fn/identity.mjs'
import memoize from './fn/memoize.mjs'
import pipe from './fn/pipe.mjs'
import trim from './fn/trim.mjs'
import toObjectReducer from './fn/to-object-reducer.mjs'
import { isArray, isObject } from './fn/is.mjs'

const parseIfObject = value => {
  if (isObject(value)) {
    return envConfig({ source: value })
  }
  if (isArray(value)) {
    return value.map(parseIfObject)
  }
  return value
}

const parseValue = pipe(trim, attemptJsonParse, value => parseIfObject(value))

const parseFile = memoize(
  pipe(path => readFileSync(path, { encoding: 'utf8' }), parseValue)
)

const handlePair = ([key, value]) =>
  key.endsWith('_FILE')
    ? [key.replace(/_FILE$/, ''), parseFile(value)]
    : [key, parseValue(value)]

const envConfig = ({
  source = process.env,
  keys = Object.keys(source),
  transformers = [identity],
  transformer = pipe(...transformers),
} = {}) =>
  transformer(
    Object.entries(source)
      .filter(
        ([key, value]) =>
          keys.includes(key) || keys.includes(key.replace(/_FILE$/, ''))
      )
      .map(handlePair)
      .reduce(toObjectReducer, {})
  )

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
