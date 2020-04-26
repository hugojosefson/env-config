/**
 * If possible, parses input param as JSON. Otherwise returns s.
 * @param s
 * @returns {any}
 */
export default s => {
  try {
    return JSON.parse(s)
  } catch (ignored) {
    return s
  }
}
