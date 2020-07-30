import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

export default (__url: ImportMeta['url'], filename: string): string =>
  resolve(dirname(fileURLToPath(__url)), filename)
