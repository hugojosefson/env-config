import { isString } from './is'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default <T>(a: T): T => (isString(a) ? a.trim() : a)
