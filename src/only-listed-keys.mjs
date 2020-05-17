import { isString } from './fn/is.mjs'
import toObjectReducer from './fn/to-object-reducer.mjs'

const hasKeyIn = keys => ([key, value]) =>
  isString(key) &&
  (keys.includes(key) ||
    keys.includes(key.replace(/_FILE$/, '')) ||
    keys.includes(`${key}_FILE`, ''))

export default keys => {
  const filter = hasKeyIn(keys)
  return source =>
    Object.entries(source).filter(filter).reduce(toObjectReducer, {})
}
