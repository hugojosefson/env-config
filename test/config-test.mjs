/* eslint-env mocha */
import { deepStrictEqual as equal } from 'assert'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import envConfig from '../src/index.mjs'
import pipe from '../src/fn/pipe.mjs'

describe('envConfig', () => {
  it('is a function', () => {
    equal(typeof envConfig, 'function')
  })

  it('allows calling without args', () => {
    envConfig()
  })

  it('parses a PORT', () => {
    const actual = envConfig({ keys: ['PORT'], source: { PORT: '3000' } })
    const expected = { PORT: 3000 }
    equal(actual, expected)
  })

  it('parses a JSON object', () => {
    const MY_OBJECT = { my: { JSON: { hi: 'there' } } }

    const actual = envConfig({
      keys: ['MY_OBJECT'],
      source: { MY_OBJECT: JSON.stringify(MY_OBJECT) }
    })
    const expected = { MY_OBJECT }
    equal(actual, expected)
  })

  it('parses a JSON array', () => {
    const MY_ARRAY = [1, 2, 'test text', { my: { JSON: { hi: 'there' } } }]

    const actual = envConfig({
      keys: ['MY_ARRAY'],
      source: { MY_ARRAY: JSON.stringify(MY_ARRAY) }
    })
    const expected = { MY_ARRAY }
    equal(actual, expected)
  })

  it('reads a file', () => {
    const path = fileURLToPath(import.meta.url)
    const SOURCE_CODE = readFileSync(path, {encoding: 'utf8'}).trim()

    const actual = envConfig({ keys: ['SOURCE_CODE', 'PORT'], source: {SOURCE_CODE_FILE: path, PORT: '3000'} })
    const expected = {SOURCE_CODE, PORT: 3000}
    equal(actual, expected)
  })

  it('reads a nested file', () => {
    const path = 'test/fixture-1.json'

    const actual = envConfig({ source: {FIXTURE_FILE: path, PORT: '3000'} })
    const expected = {FIXTURE: JSON.parse(readFileSync('test/fixture-1-result.json', {encoding: 'utf8'})), PORT: 3000}
    equal(actual, expected)
  })

  it('reads a nested file, inside an array', () => {
    const path = 'test/fixture-3.json'

    const actual = envConfig({ source: {FIXTURE_FILE: path, PORT: '3000'} })
    const expected = {FIXTURE: JSON.parse(readFileSync('test/fixture-3-result.json', {encoding: 'utf8'})), PORT: 3000}
    equal(actual, expected)
  })
})

describe('pipe', () => {
  const plusOne = x => x + 1
  const double = x => 2 * x

  it('calls functions left to right', () => {
    const actual = pipe(plusOne, double)(10)
    equal(actual, 22)
  })
})
