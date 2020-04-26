export default s => {
  try {
    return JSON.parse(s)
  } catch (ignored) {
    return s
  }
}
