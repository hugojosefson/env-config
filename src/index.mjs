import identity from './fn/identity.mjs'
import pipe from './fn/pipe.mjs'
import onlyListedKeys from './only-listed-keys.mjs'
import parseObject from './parse-object.mjs'

const envConfig = ({
  source = process.env,
  keys = Object.keys(source),
  decoders = defaultDecoders,
  transformers = [identity],
  transformer = pipe(...transformers),
} = {}) =>
  pipe(onlyListedKeys(keys), parseObject(decoders), transformer)(source)

/**
 * Parses the source into an object.
 *
 * @param source Source object. _Optional. Default: `process.env`._
 * @param keys Array of keys to use. _Optional. Default: All keys in `source`._
 * @param decoders Array of decoder definitions to attempt to use for decoding each value. Each decoder definition is an object with a property `prefix` whose value is a string, or a property `test` whose value is a function to test whether to use this decoder to process the value. Additionally, each decoder definition has a property `decode` which is a function taking the original value, and returning the decoded value. Alternatively `decodeWithoutPrefix` can be defined, which is called with the original value, just having its prefix chopped off first. _Optional. Default: `defaultDecoders`._
 * @param transformers Array of functions for making any changes to the configuration object afterwards. Will be run in order of appearance. _Optional._
 * @param transformer Alternatively for convenience, a single function for making any change to the configuration object afterwards. _Takes the complete config object as argument, and must return the new/altered config object. Optional._
 * @returns {*} An object where the values are parsed according to <a href="#features">Features</a>.
 * @public
 * @name envConfig
 */
export default envConfig

/**
 * Default decoders, decoding strings prefixed with `base64:` and `hex:` into strings, and `base64binary:` and `hexbinary` into `Buffer`s.
 * @public
 */
export const defaultDecoders = [
  {
    prefix: 'base64:',
    decodeWithoutPrefix: s => Buffer.from(s, 'base64').toString(),
  },
  {
    prefix: 'base64binary:',
    decodeWithoutPrefix: s => Buffer.from(s, 'base64'),
  },
  {
    prefix: 'hex:',
    decodeWithoutPrefix: s => Buffer.from(s, 'hex').toString(),
  },
  {
    prefix: 'hexbinary:',
    decodeWithoutPrefix: s => Buffer.from(s, 'hex'),
  },
]
