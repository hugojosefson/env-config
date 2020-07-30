// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('eslint-config-standard-typescript-prettier')

module.exports = {
  ...config,
  extends: [...config.extends, 'prettier-standard'],
  parserOptions: {
    project: './tsconfig-test.json',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true
    }
  },
  rules: {
    ...config.rules,

    // let prettier/prettier inject semicolons for disambiguation:
    '@typescript-eslint/no-extra-semi': [0],

    // remove other semicolons:
    semi: ['error', 'never']
  }
}
