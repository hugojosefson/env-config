/**
 * If possible, parses input param as JSON. Otherwise returns s.
 */
export default (s: string): string | any => {
  try {
    return JSON.parse(s)
  } catch (ignored) {
    return s
  }
}
