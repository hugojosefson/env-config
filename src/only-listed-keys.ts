import { isString } from './fn/is'
import toObjectReducer from './fn/to-object-reducer'
import { Source } from '.'

const hasKeyIn = (keys: string[]) => ([key, ignoreValue]: [
  string,
  string | undefined
]) =>
  isString(key) &&
  (keys.includes(key) ||
    keys.includes(key.replace(/_FILE$/, '')) ||
    keys.includes(`${key}_FILE`))

export default (keys: string[]): ((source: Source) => Source) => {
  const filter = hasKeyIn(keys)
  return (source: Source): Source => {
    const entries = Object.entries(source)
    const filtered = entries.filter(filter)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return filtered.reduce(toObjectReducer, {})
  }
}
