export default <T extends Record<K, unknown>, K extends keyof T>(
  acc: T,
  [key, value]: [K, any]
): T => {
  acc[key] = value
  return acc
}
