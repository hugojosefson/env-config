import identity from './identity.mjs'

export default prefix => {
  if (typeof prefix !== 'string') return identity
  if (prefix.length === 0) return identity

  return s => {
    if (typeof s !== 'string') return s
    return s.substring(prefix.length)
  }
}
