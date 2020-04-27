import envConfig from './src/index.mjs'

/**
 * Parses the source into an object.
 * @param source Source object. _Optional. Default: `process.env`._
 * @param keys Array of keys to use. _Optional. Default: All keys in `source`._
 * @param transformers Array of functions for making any changes to the configuration object afterwards. Will be run in order of appearance. _Optional._
 * @param transformer Alternatively for convenience, a single function for making any change to the configuration object afterwards. _Takes the complete config object as argument, and must return the new/altered config object. Optional._
 * @returns {*} An object where the values are parsed according to <a href="#features">Features</a>.
 * @public
 * @name envConfig
 */
export default envConfig
