import identity from './identity'

export default <T, U>(prefix: T) => {
  if (typeof prefix !== 'string') return identity
  if (prefix.length === 0) return identity

  return (s: U): U => {
    if (typeof s !== 'string') return s
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return s.substring(prefix.length)
  }
}
