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

export default envConfig
