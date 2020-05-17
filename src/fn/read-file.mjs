import { readFileSync } from 'fs'

export default path => readFileSync(path, { encoding: 'utf8' })
