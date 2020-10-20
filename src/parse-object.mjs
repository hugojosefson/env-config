import pipe from './fn/pipe.mjs'
import trim from './fn/trim.mjs'
import toObjectReducer from './fn/to-object-reducer.mjs'
import memoize from './fn/memoize.mjs'
import attemptDecode from './attempt-decode.mjs'
import attemptJsonParse from './attempt-json-parse.mjs'
import parseIfObject from './parse-if-object.mjs'

export default (decoders, readFile, failOnMissingFile) => {
  const parsePair = ([key, value]) => {
    const asFile = () => [key.replace(/_FILE$/, ''), parseFile(value)]
    const asValue = () => [key, parseValue(value)]

    if (key.endsWith('_FILE')) {
      try {
        return asFile()
      } catch (e) {
        if (failOnMissingFile) {
          throw e
        }
      }
    }

    return asValue()
  }

  const parseObject = source =>
    Object.entries(source).map(parsePair).reduce(toObjectReducer, {})

  const parseValue = pipe(
    trim,
    attemptDecode(decoders),
    attemptJsonParse,
    parseIfObject(parseObject)
  )

  const parseFile = memoize(pipe(readFile, parseValue))

  return parseObject
}
