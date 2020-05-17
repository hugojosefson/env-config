import pipe from './fn/pipe.mjs'
import trim from './fn/trim.mjs'
import toObjectReducer from './fn/to-object-reducer.mjs'
import memoize from './fn/memoize.mjs'
import readFile from './fn/read-file.mjs'
import attemptDecode from './attempt-decode.mjs'
import attemptJsonParse from './attempt-json-parse.mjs'
import parseIfObject from './parse-if-object.mjs'

export default decoders => {
  const parsePair = ([key, value]) =>
    key.endsWith('_FILE')
      ? [key.replace(/_FILE$/, ''), parseFile(value)]
      : [key, parseValue(value)]

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
