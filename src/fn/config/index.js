import fs from 'fs'
import R from 'ramda'
import camelcase from 'camelcase'
import toObject from 'to-object-reducer'
import attemptJsonParse from './attempt-json-parse'

const deepJsonParse = obj => {
  if (!(R.is(Object, obj) || R.is(Array, obj))) {
    return attemptJsonParse(obj)
  }

  return R.map(value => {
    if (R.is(String, value)) {
      return attemptJsonParse(value)
    } else {
      if (R.is(Object, value) || R.is(Array, value)) {
        return deepJsonParse(value)
      } else {
        return value
      }
    }
  }, obj)
}

const loadFileReferences = R.mapObjIndexed((value, key) =>
  R.is(String, key) && key.endsWith('_FILE') ? fs.readFileSync(value) : value
)

const camelCaseKeys = obj =>
  R.toPairs(obj)
    .map(([key, value]) => [camelcase(key), value])
    .reduce(toObject, {})

export default ({
  keys = [],
  source = process.env,
  transform = R.identity
}) => {
  console.dir({ keys })
  const mayContainFileReferences = keys
    .filter(key => typeof key === 'string')
    .filter(key => !!key.length)
    .map(key => key.trim())
    .map(key => [key, source[key]])
    .map(([key, value]) => [key, deepJsonParse(value)])
    .reduce(toObject, {})

  const loadedFromFiles = loadFileReferences(mayContainFileReferences)

  const config = camelCaseKeys(loadedFromFiles)
  return transform(config)
}
