export default <T extends Record<U, unknown>, U extends keyof T>(
  acc: T,
  [key, value]: [U, any]
): T => {
  acc[key] = value
  return acc
}
