/* eslint-env mocha */
import { deepStrictEqual as equal } from 'assert'
import { readFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import envConfig from '../src'
import pipe from '../src/fn/pipe'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-line
const __url = import.meta.url

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
    const path = fileURLToPath(__url)
    const SOURCE_CODE = readFileSync(path, { encoding: 'utf8' }).trim()

    const actual = envConfig({
      keys: ['SOURCE_CODE', 'PORT'],
      source: { SOURCE_CODE_FILE: path, PORT: '3000' }
    })
    const expected = { SOURCE_CODE, PORT: 3000 }
    equal(actual, expected)
  })

  it('reads a nested file', () => {
    const path = 'test/fixture-1.json'

    const actual = envConfig({ source: { FIXTURE_FILE: path, PORT: '3000' } })
    const expected = {
      FIXTURE: JSON.parse(
        readFileSync('test/fixture-1-result.json', { encoding: 'utf8' })
      ),
      PORT: 3000
    }
    equal(actual, expected)
  })

  it('reads a nested file, inside an array', () => {
    const path = 'test/fixture-3.json'

    const actual = envConfig({ source: { FIXTURE_FILE: path, PORT: '3000' } })
    const expected = {
      FIXTURE: JSON.parse(
        readFileSync('test/fixture-3-result.json', { encoding: 'utf8' })
      ),
      PORT: 3000
    }
    equal(actual, expected)
  })

  it('decodes base64: value', () => {
    const actual = envConfig({
      keys: ['NAME'],
      source: { NAME: 'base64:TXkgTmFtZQ==' }
    })
    const expected = { NAME: 'My Name' }
    equal(actual, expected)
  })

  it('decodes base64: containing a JSON string into object', () => {
    const MY_OBJECT = { my: { JSON: { hi: 'there' } } }

    const actual = envConfig({
      keys: ['MY_OBJECT'],
      source: {
        MY_OBJECT: `base64:${Buffer.from(JSON.stringify(MY_OBJECT)).toString(
          'base64'
        )}`
      }
    })
    const expected = { MY_OBJECT }
    equal(actual, expected)
  })
  it('decodes base64: from a file to JSON, parses it', () => {
    const path = 'test/fixture-3.base64'

    const actual = envConfig({ source: { FIXTURE_FILE: path, PORT: '3000' } })
    const expected = {
      FIXTURE: JSON.parse(
        readFileSync('test/fixture-3-result.json', { encoding: 'utf8' })
      ),
      PORT: 3000
    }
    equal(actual, expected)
  })

  const base64 = (s: string) => 'base64:' + Buffer.from(s).toString('base64')

  it('decodes double base64 value', () => {
    const actual = envConfig({
      source: { DOUBLE: base64(base64('Hi there!')) }
    })
    const expected = {
      DOUBLE: 'Hi there!'
    }
    equal(actual, expected)
  })

  it('{redactFileContents: true} returns [redacted] for file contents', () => {
    const path = fileURLToPath(__url)
    const actual = envConfig({
      keys: ['SOURCE_CODE', 'PORT'],
      source: { SOURCE_CODE_FILE: path, PORT: '3000' },
      redactFileContents: true
    })
    const expected = {
      SOURCE_CODE: '[redacted]',
      PORT: 3000
    }
    equal(actual, expected)
  })

  it('{redactFileContents: true} returns [redacted] for file contents inside JSON object', () => {
    const path = fileURLToPath(__url)
    const actual = envConfig({
      keys: ['MY_JSON', 'PORT'],
      source: {
        MY_JSON: JSON.stringify({ a: { SOURCE_CODE_FILE: path, b: 2 } }),
        PORT: '3000'
      },
      redactFileContents: true
    })
    const expected = {
      MY_JSON: { a: { SOURCE_CODE: '[redacted]', b: 2 } },
      PORT: 3000
    }
    equal(actual, expected)
  })
})

describe('pipe', () => {
  const plusOne = (x: number) => x + 1
  const double = (x: number) => 2 * x

  it('calls functions left to right', () => {
    const actual = pipe(plusOne, double)(10)
    equal(actual, 22)
  })
})
