import pipe from './fn/pipe'
import trim from './fn/trim'
import toObjectReducer from './fn/to-object-reducer'
import memoize from './fn/memoize'
import attemptDecode from './attempt-decode'
import attemptJsonParse from './attempt-json-parse'
import { Decoder } from './index'
import parseIfObject from './parse-if-object'

export default (decoders: Decoder[], readFile: (path: string) => string) => {
  const parsePair = ([key, value]: [string, any]) =>
    key.endsWith('_FILE')
      ? [key.replace(/_FILE$/, ''), parseFile(value)]
      : [key, parseValue(value)]

  const parseObject: (source: Record<string, any>) => Record<string, any> = (
    source: Record<string, any>
  ): Record<string, any> => {
    const entries: [string, any][] = Object.entries(source)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return entries.map(parsePair).reduce(toObjectReducer, {})
  }

  const parseValue = pipe(
    trim,
    attemptDecode(decoders),
    attemptJsonParse,
    parseIfObject(parseObject)
  )

  const parseFile = memoize(pipe(readFile, parseValue))

  return parseObject
}
