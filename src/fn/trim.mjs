import { isString } from './is.mjs'

export default a => (isString(a) ? a.trim() : a)
